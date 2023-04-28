import { Asset, Token } from './asset';

export class LiquidityPool {

    dex: string;
    address: string;
    assetA: Token;
    assetB: Token;
    reserveA: bigint;
    reserveB: bigint;

    lpToken: Asset;
    totalLpTokens: bigint = 0n;
    identifier: string = '';
    poolFee: number = 0;

    constructor(dex: string, address: string, assetA: Token, assetB: Token, reserveA: bigint, reserveB: bigint) {
        this.dex = dex;
        this.address = address;
        this.assetA = assetA;
        this.assetB = assetB;
        this.reserveA = reserveA;
        this.reserveB = reserveB;
    }

    get uuid(): string {
        return `${this.dex}.${this.name}.${this.identifier}`;
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

    get totalValueLocked(): number {
        const assetADecimals: number = this.assetA === 'lovelace' ? 6 : this.assetA.decimals;
        const assetBDecimals: number = this.assetB === 'lovelace' ? 6 : this.assetB.decimals;

        return ((Number(this.reserveA) / 10**assetADecimals) * this.price) * ((Number(this.reserveB) / 10**assetBDecimals) * (1 / this.price));
    }

}