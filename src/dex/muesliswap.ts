import { BaseDex } from './base-dex';
import {
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress, SwapFee,
    UTxO
} from '../types';
import { Asset, Token } from './models/asset';
import { LiquidityPool } from './models/liquidity-pool';
import { DataProvider } from '../providers/data/data-provider';
import { DefinitionBuilder } from '../definition-builder';
import { correspondingReserves } from '../utils';
import { AddressType, DatumParameterKey } from '../constants';

/**
 * MuesliSwap constants.
 */
const ORDER_ADDRESS: string = 'addr1zyq0kyrml023kwjk8zr86d5gaxrt5w8lxnah8r6m6s4jp4g3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqqktyhv';
const POOL_ADDRESS: string = 'addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7xnh3gfhnqcwez2pzmr4tryugrr0uahuk49xqw7dc645chscql0d7';
const FACTORY_TOKEN_POLICY_ID: string = 'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f';
const POOL_NFT_POLICY_ID: string = '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f';
const LP_TOKEN_POLICY_ID: string = 'af3d70acf4bd5b3abb319a7d75c89fb3e56eafcdd46b2e9b57a2557f';

export class MuesliSwap extends BaseDex {

    public readonly name: string = 'MuesliSwap';

    async liquidityPools(provider: DataProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(POOL_ADDRESS, (assetA === 'lovelace' ? undefined : assetA));
        const builder: DefinitionBuilder = await (new DefinitionBuilder())
            .loadDefinition('/muesliswap/pool.js');

        const liquidityPoolPromises: Promise<LiquidityPool | undefined>[] = utxos.map(async (utxo: UTxO) => {
            const liquidityPool: LiquidityPool | undefined = this.liquidityPoolFromUtxo(utxo, assetA, assetB);

            if (liquidityPool) {
                const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
                const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

                liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                    ? BigInt(parameters.TotalLpTokens)
                    : 0n;
                liquidityPool.poolFee = typeof parameters.LpFee === 'number'
                    ? parameters.LpFee
                    : 0;
            }

            return liquidityPool;
        });

        return await Promise.all(liquidityPoolPromises)
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[]
            });
    }

    liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB?: Token): LiquidityPool | undefined {
        if (! utxo.datumHash) {
            return undefined;
        }

        const assetAId: string = assetA === 'lovelace' ? 'lovelace' : assetA.id();
        const assetBId: string = assetB ? (assetB === 'lovelace' ? 'lovelace' : assetB.id()) : '';

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();

            return ! assetBalanceId.startsWith(FACTORY_TOKEN_POLICY_ID)
                && ! assetBalanceId.startsWith(POOL_NFT_POLICY_ID);
        });

        // Irrelevant UTxO
        if (relevantAssets.length < 2) {
            return undefined;
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const relevantAssetAId: string = relevantAssets[assetAIndex].asset === 'lovelace'
            ? 'lovelace'
            : (relevantAssets[assetAIndex].asset as Asset).id()
        const relevantAssetBId: string = relevantAssets[assetBIndex].asset === 'lovelace'
            ? 'lovelace'
            : (relevantAssets[assetBIndex].asset as Asset).id()

        // Only grab requested pools
        const matchesFilter: boolean = (relevantAssetAId === assetAId && relevantAssetBId === assetBId)
            || (relevantAssetAId === assetBId && relevantAssetBId === assetAId)
            || (relevantAssetAId === assetAId && ! assetBId)
            || (relevantAssetBId === assetAId && ! assetBId);

        if (! matchesFilter) {
            return undefined;
        }

        const liquidityPool: LiquidityPool = new LiquidityPool(
            this.name,
            utxo.address,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
        );

        const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === POOL_NFT_POLICY_ID;
        })?.asset as Asset;

        if (lpToken) {
            lpToken.policyId = LP_TOKEN_POLICY_ID;
            liquidityPool.lpToken = lpToken;
        }

        return liquidityPool;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapFee: bigint = ((swapInAmount * BigInt(liquidityPool.poolFee * 100)) + BigInt(10000) - 1n) / 10000n;
        const adjustedSwapInAmount: bigint = swapInAmount - swapFee;

        const estimatedReceive: number = Number(reserveOut) - (Number(reserveIn) * Number(reserveOut)) / (Number(reserveIn) + Number(adjustedSwapInAmount));

        return BigInt(Math.floor(estimatedReceive));
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const estimatedReceive: bigint = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);

        const oldPrice: number = Number(reserveIn) / Number(reserveOut);
        const swapPrice: number = Number(swapInAmount) / Number(estimatedReceive);

        return(swapPrice - oldPrice) / oldPrice * 100;
    }

    buildSwapOrder(swapParameters: DatumParameters): PayToAddress[] {
        const matchMakerFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'matchmakerFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

        if (! matchMakerFee || ! deposit || ! swapParameters[DatumParameterKey.MinReceive]) {
            throw new Error('Parameters for datum are not set.');
        }

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.TotalFees]: matchMakerFee.value + deposit.value,
        };
        (swapParameters[DatumParameterKey.MinReceive] as bigint) -= (matchMakerFee.value + deposit.value);

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        datumBuilder.loadDefinition('/muesliswap/swap.ts')
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: ORDER_ADDRESS,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: matchMakerFee.value + deposit.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                }
            )
        ];
    }

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'matchmakerFee',
                title: 'Matchmaker Fee',
                description: 'Fee to cover costs for the order matchmakers.',
                value: 950000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 1_700000n,
                isReturned: true,
            },
        ];
    }

}