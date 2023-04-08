import { Token } from './asset';

export class LiquidityPool {

    dex: string;
    assetA: Token;
    assetB: Token;
    reserveA: bigint;
    reserveB: bigint;

    constructor(dex: string, assetA: Token, assetB: Token, reserveA: bigint, reserveB: bigint) {
        this.dex = dex;
        this.assetA = assetA;
        this.assetB = assetB;
        this.reserveA = reserveA;
        this.reserveB = reserveB;
    }

    get name(): string {
        const assetAName: string = this.assetA === 'lovelace' ? 'ADA' : this.assetA.assetName;
        const assetBName: string = this.assetB === 'lovelace' ? 'ADA' : this.assetB.assetName;

        return `${assetAName}/${assetBName}`;
    }

}