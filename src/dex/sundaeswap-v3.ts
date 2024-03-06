import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import {
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    RequestConfig, SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import pool from '@dex/definitions/sundaeswap-v1/pool';
import order from '@dex/definitions/sundaeswap-v1/order';
import { BaseApi } from '@dex/api/base-api';
import { Script } from 'lucid-cardano';
import { SundaeSwapV3Api } from '@dex/api/sundaeswap-v3-api';

export class SundaeSwapV3 extends BaseDex {

    public static readonly identifier: string = 'SundaeSwapV1';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = '';
    public readonly poolAddress: string = '';
    public readonly lpTokenPolicyId: string = '';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new SundaeSwapV3Api(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.resolve([this.poolAddress]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(this.poolAddress);

        return await Promise.all(
            utxos.map(async (utxo: UTxO) => {
                return await this.liquidityPoolFromUtxo(provider, utxo);
            })
        )
        .then((liquidityPools: (LiquidityPool | undefined)[]) => {
            return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                return liquidityPool !== undefined;
            }) as LiquidityPool[];
        });
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (! utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier();

            return ! assetBalanceId.startsWith(this.lpTokenPolicyId);
        });

        // Irrelevant UTxO
        if (! [2, 3].includes(relevantAssets.length)) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwapV3.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress,
        );

        // Load additional pool information
        const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === this.lpTokenPolicyId;
        })?.asset as Asset;

        if (lpToken) {
            lpToken.nameHex = '6c' + lpToken.nameHex;
            liquidityPool.lpToken = lpToken;
            liquidityPool.identifier = lpToken.identifier();
        }

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string'
                ? parameters.PoolIdentifier
                : '';
            liquidityPool.poolFeePercent = typeof parameters.LpFeeNumerator === 'number' && typeof parameters.LpFeeDenominator === 'number'
                ? (parameters.LpFeeNumerator / parameters.LpFeeDenominator) * 100
                : 0;
            liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                ? BigInt(parameters.TotalLpTokens)
                : 0n;
        } catch (e) {
            return liquidityPool;
        }

        return liquidityPool;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const receive: bigint = (reserveIn * reserveOut) / (reserveOut - swapOutAmount) - reserveIn;
        const swapFee: bigint = ((receive * BigInt(Math.floor(liquidityPool.poolFeePercent * 100))) + BigInt(10000) - 1n) / 10000n;

        return receive + swapFee;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapFee: bigint = ((swapInAmount * BigInt(Math.floor(liquidityPool.poolFeePercent * 100))) + BigInt(10000) - 1n) / 10000n;

        return reserveOut - (reserveIn * reserveOut) / (reserveIn + swapInAmount - swapFee);
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const reserveIn: bigint = tokensMatch(swapInToken, liquidityPool.assetA)
            ? liquidityPool.reserveA
            : liquidityPool.reserveB;

        return (1 - (Number(reserveIn) / Number(reserveIn + swapInAmount))) * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = []): Promise<PayToAddress[]> {
        const scooperFee: SwapFee | undefined = this.swapOrderFees(liquidityPool).find((fee: SwapFee) => fee.id === 'scooperFee');
        const deposit: SwapFee | undefined = this.swapOrderFees(liquidityPool).find((fee: SwapFee) => fee.id === 'deposit');

        if (! scooperFee || ! deposit) {
            return Promise.reject('Parameters for datum are not set.');
        }

        const swapInToken: string = (swapParameters.SwapInTokenPolicyId as string) + (swapParameters.SwapInTokenAssetName as string);
        const swapOutToken: string = (swapParameters.SwapOutTokenPolicyId as string) + (swapParameters.SwapOutTokenAssetName as string);
        const swapDirection: number = [swapInToken, swapOutToken].sort((a: string, b: string) => {
            return a.localeCompare(b);
        })[0] === swapInToken ? 0 : 1;

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.ScooperFee]: scooperFee.value,
            [DatumParameterKey.Action]: swapDirection,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order)
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: this.orderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: scooperFee.value + deposit.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                    isInlineDatum: false,
                    spendUtxos: spendUtxos,
                }
            )
        ];
    }

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
            return utxo.address === this.orderAddress;
        });

        if (! relevantUtxo) {
            return Promise.reject('Unable to find relevant UTxO for cancelling the swap order.');
        }

        return [
            {
                address: returnAddress,
                addressType: AddressType.Base,
                assetBalances: relevantUtxo.assetBalances,
                isInlineDatum: false,
                spendUtxos: [{
                    utxo: relevantUtxo,
                    redeemer: this.cancelDatum,
                    validator: this.orderScript,
                    signer: returnAddress,
                }],
            }
        ];
    }

    public swapOrderFees(liquidityPool: LiquidityPool): SwapFee[] {
        return [
            {
                id: 'protocolFee',
                title: 'Sundae Protocol Fee',
                description: 'Sundae Protocol Fee',
                value: liquidityPool.extra.protocolFee ?? 2_500000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'A small ADA deposit that you will get back when your order is processed or cancelled.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}
