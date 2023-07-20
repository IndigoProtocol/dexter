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
    RequestConfig,
    SwapFee,
    UTxO
} from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import pool from '@dex/definitions/sundaeswap/pool';
import order from '@dex/definitions/sundaeswap/order';
import { BaseApi } from '@dex/api/base-api';
import { SundaeSwapApi } from '@dex/api/sundaeswap-api';

export class SundaeSwap extends BaseDex {

    public static readonly identifier: string = 'SundaeSwap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8';
    public readonly poolAddress: string = 'addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu';
    public readonly lpTokenPolicyId: string = '0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b913';

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new SundaeSwapApi(this, requestConfig);
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
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();

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
            SundaeSwap.identifier,
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
        }

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string'
                ? parameters.PoolIdentifier
                : '';
            liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                ? BigInt(parameters.TotalLpTokens)
                : 0n;
            liquidityPool.poolFeePercent = typeof parameters.LpFeeNumerator === 'number' && typeof parameters.LpFeeDenominator === 'number'
                ? (parameters.LpFeeNumerator / parameters.LpFeeDenominator) * 100
                : 0;
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
        const scooperFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'scooperFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

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
                spendUtxos: [relevantUtxo],
            }
        ];
    }

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'scooperFee',
                title: 'Scooper Processing Fee',
                description: 'An ADA fee paid to the Sundae Scooper Network for processing your order.',
                value: 2_500000n,
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
