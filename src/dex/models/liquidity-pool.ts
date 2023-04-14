import { Asset, Token } from './asset';

export class LiquidityPool {

    dex: string;
    address: string;
    lpToken: Asset;
    totalLpTokens: bigint;
    assetA: Token;
    assetB: Token;
    reserveA: bigint;
    reserveB: bigint;

    constructor(dex: string, address: string, lpToken: Asset, totalLpTokens: bigint, assetA: Token, assetB: Token, reserveA: bigint, reserveB: bigint) {
        this.dex = dex;
        this.address = address;
        this.lpToken = lpToken;
        this.totalLpTokens = totalLpTokens;
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

    get price(): number {
        const assetADecimals: number = this.assetA === 'lovelace' ? 6 : this.assetA.decimals;
        const assetBDecimals: number = this.assetB === 'lovelace' ? 6 : this.assetB.decimals;

        const adjustedReserveA = Number(this.reserveA) / (10**assetADecimals)
        const adjustedReserveB = Number(this.reserveB) / (10**assetBDecimals)

        return adjustedReserveA / adjustedReserveB;
    }

}