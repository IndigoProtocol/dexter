import { BaseDex } from './base-dex';
import { LiquidityPool } from './models/liquidity-pool';
import { BaseProvider } from '../provider/base-provider';
import { Token } from './models/asset';
import { AssetBalance, UTxO } from '../types/provider';

export class Minswap extends BaseDex {

    public name: string = 'Minswap';

    private readonly poolAddress: string = 'addr1z8snz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxz2j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq0xmsha';
    private readonly marketOrderAddress: string = 'addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt';
    private readonly validityToken: string = '13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f4d494e53574150';
    private readonly lpPolicyId: string = 'e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86';
    private readonly nftPolicyId: string = '0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1';

    liquidityPools(provider: BaseProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const assetAId: string = assetA === 'lovelace' ? 'lovelace' : assetA.id();
        const assetBId: string = assetB ? (assetB === 'lovelace' ? 'lovelace' : assetB.id()) : '';

        return provider.utxos(this.poolAddress, (assetA === 'lovelace' ? '' : assetA.id()))
            .then((utxos: UTxO[]) => {
                return utxos.map((utxo: UTxO) => {
                    const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
                        const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();

                        return assetBalanceId !== this.validityToken
                            && !assetBalanceId.startsWith(this.lpPolicyId)
                            && !assetBalanceId.startsWith(this.nftPolicyId)
                            && ([assetAId, assetBId].includes(assetBalanceId) || !assetBId);
                    })

                    if (relevantAssets.length !== 2) {
                        return undefined;
                    }

                    return new LiquidityPool(
                        this.name,
                        relevantAssets[0].asset,
                        relevantAssets[1].asset,
                        relevantAssets[0].quantity,
                        relevantAssets[1].quantity,
                    );
                })
            });
    }

    orders(): void {
    }

    submitSwap(): void {
    }

}