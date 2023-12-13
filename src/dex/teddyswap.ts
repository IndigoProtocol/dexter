import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import { DatumParameters, DefinitionConstr, DefinitionField, PayToAddress, RequestConfig, SwapFee, UTxO } from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { AddressType, DatumParameterKey } from '@app/constants';
import { BaseApi } from '@dex/api/base-api';
import pool from './definitions/teddyswap/pool';
import order from './definitions/teddyswap/order';
import { correspondingReserves, tokensMatch } from '..';

export class TeddySwap extends BaseDex {

    public static readonly identifier: string = 'TeddySwap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1z99tz7hungv6furtdl3zn72sree86wtghlcr4jc637r2eadkp2avt5gp297dnxhxcmy6kkptepsr5pa409qa7gf8stzs0706a3';
    public readonly poolAddress: string = 'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8z9kp2avt5gp297dnxhxcmy6kkptepsr5pa409qa7gf8stzsxg8sx3';


    constructor(requestConfig: RequestConfig = {}) {
        super();
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.resolve([this.poolAddress]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const poolAddresses: string[] = await this.liquidityPoolAddresses(provider);

        const addressPromises: Promise<LiquidityPool[]>[] = poolAddresses.map(async (address: string) => {
            const utxos: UTxO[] = await provider.utxos(address);

            return await Promise.all(
                utxos.map(async (utxo: UTxO) => {
                    return await this.liquidityPoolFromUtxo(provider, utxo);
                })
            ).then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[];
            });

        });

        return Promise.all(addressPromises).then((liquidityPools: Awaited<LiquidityPool[]>[]) => liquidityPools.flat());
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (!utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const relevantAssets = utxo.assetBalances.filter((assetBalance) => {
            const assetName = (assetBalance.asset as Asset).assetName;
            return !assetName?.toLowerCase()?.endsWith('_nft') && !assetName?.toLowerCase()?.endsWith('_identity');
        });

        // Irrelevant UTxO
        if (![2, 3].includes(relevantAssets.length)) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 3 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 3 ? 2 : 3;

        const liquidityPool: LiquidityPool = new LiquidityPool(TeddySwap.identifier, relevantAssets[assetAIndex].asset, relevantAssets[assetBIndex].asset, relevantAssets[assetAIndex].quantity, relevantAssets[assetBIndex].quantity, utxo.address, this.orderAddress, this.orderAddress);

        // Load additional pool information
        const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
            const assetName = (assetBalance.asset as Asset).assetName;
            return assetName?.toLowerCase()?.endsWith('_lp');
        })?.asset as Asset;

        if (lpToken) {
            liquidityPool.lpToken = lpToken;
        }

        try {
            const builder: DefinitionBuilder = await new DefinitionBuilder().loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string' ? parameters.PoolIdentifier : '';
            liquidityPool.poolFeePercent = typeof parameters.LpFee === 'number' ? (1000 - parameters.LpFee) / 10 : 0.3;
        } catch (e) {
            return liquidityPool;
        }

        return liquidityPool;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const receive: bigint = (reserveIn * reserveOut) / (reserveOut - swapOutAmount) - reserveIn;
        const swapFee: bigint = ((receive * BigInt(liquidityPool.poolFeePercent * 100)) + BigInt(10000) - 1n) / 10000n;

        return receive + swapFee;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapFee: bigint = ((swapInAmount * BigInt(liquidityPool.poolFeePercent * 100)) + BigInt(10000) - 1n) / 10000n;

        return reserveOut - (reserveIn * reserveOut) / (reserveIn + swapInAmount - swapFee);
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const reserveIn: bigint = tokensMatch(swapInToken, liquidityPool.assetA)
            ? liquidityPool.reserveA
            : liquidityPool.reserveB;

        return (1 - (Number(reserveIn) / Number(reserveIn + swapInAmount))) * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: UTxO[] = []): Promise<PayToAddress[]> {
        const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');
        const minReceive = swapParameters.MinReceive as bigint;

        if (!batcherFee || !deposit || !minReceive) {
            return Promise.reject('Parameters for datum are not set.');
        }

        const batcherFeeForToken = Number(batcherFee.value) / Number(minReceive);
        // const number = bignumber(batcherFeeForToken.toString());
        const [numerator, denominator] = decimalToFractionalImproved(batcherFeeForToken); // We need to test this new method.

        const lpfee = 1000 - liquidityPool.poolFeePercent * 10;

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.TokenPolicyId]: liquidityPool.lpToken.policyId,
            [DatumParameterKey.TokenAssetName]: liquidityPool.lpToken.nameHex,
            [DatumParameterKey.LpFee]: lpfee,
            [DatumParameterKey.LpFeeNumerator]: numerator,
            [DatumParameterKey.LpFeeDenominator]: denominator,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order).then((builder: DefinitionBuilder) => {
            builder.pushParameters(swapParameters);
        });

        return [
            this.buildSwapOrderPayment(swapParameters, {
                address: this.orderAddress,
                addressType: AddressType.Contract,
                assetBalances: [
                    {
                        asset: 'lovelace',
                        quantity: batcherFee?.value + deposit.value,
                    },
                ],
                datum: datumBuilder.getCbor(),
                spendUtxos: spendUtxos,
            }),
        ];
    }

    public buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        throw new Error('Method not implemented.');
    }

    public swapOrderFees(): SwapFee[] {
        const networkFee: number = 0.5;
        const reward: number = 1;
        const minNitro: number = 1.2;
        const batcherFee: number = (reward + networkFee) * minNitro;
        const batcherFeeInAda: bigint = BigInt(Math.round(batcherFee * 10 ** 6));

        return [
            {
                id: 'batcherFee',
                title: 'Batcher Fee',
                description: 'Fee paid for the service of off-chain batcher to process transactions.',
                value: batcherFeeInAda,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }
}

// WIP to remove the mathjs dependency & configuration logic. (TEST)
function decimalToFractionalImproved(decimalValue: bigint | number): [bigint, bigint] {
    const [whole, decimals = ''] = decimalValue.toString()?.split('.');
    let truncatedDecimals = decimals.slice(0, 15);
    const denominator = 10n ** BigInt(truncatedDecimals.length);
    const numerator = BigInt(whole + truncatedDecimals);
    return [numerator, denominator];
}
