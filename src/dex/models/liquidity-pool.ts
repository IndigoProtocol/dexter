import { Asset } from '../../types/dex';

export class LiquidityPool {

    dex: string;
    assetA: Asset;
    assetB: Asset;
    reserveA: bigint;
    reserveB: bigint;

    constructor(dex: string, assetA: Asset, assetB: Asset, reserveA: bigint, reserveB: bigint) {
        this.dex = dex;
        this.assetA = assetA;
        this.assetB = assetB;
        this.reserveA = reserveA;
        this.reserveB = reserveB;
    }

}