import { BaseDex } from './base-dex';
import { AssetBalance, DatumParameters, DefinitionConstr, DefinitionField, UTxO } from '../types';
import { Asset, Token } from './models/asset';
import { LiquidityPool } from './models/liquidity-pool';
import { BaseProvider } from '../provider/base-provider';
import { DefinitionBuilder } from '../definition-builder';

export class MuesliSwap extends BaseDex {

    public readonly name: string = 'MuesliSwap';

    private readonly orderAddress: string = 'addr1zyq0kyrml023kwjk8zr86d5gaxrt5w8lxnah8r6m6s4jp4g3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqqktyhv';
    private readonly poolAddress: string = 'addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7xnh3gfhnqcwez2pzmr4tryugrr0uahuk49xqw7dc645chscql0d7';
    private readonly factoryPolicyId: string = 'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f';
    private readonly poolNftPolicyId: string = '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f';
    private readonly lpTokenPolicyId: string = 'af3d70acf4bd5b3abb319a7d75c89fb3e56eafcdd46b2e9b57a2557f';

    async liquidityPools(provider: BaseProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(this.poolAddress, (assetA === 'lovelace' ? undefined : assetA));
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

            return ! assetBalanceId.startsWith(this.factoryPolicyId)
                && ! assetBalanceId.startsWith(this.poolNftPolicyId);
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
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === this.poolNftPolicyId;
        })?.asset as Asset;

        if (lpToken) {
            lpToken.policyId = this.lpTokenPolicyId;
            liquidityPool.lpToken = lpToken;
        }

        return liquidityPool;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        return 0n;
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        return 0;
    }

}