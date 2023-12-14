import { Asset, Token } from './asset';

export class LiquidityPool {

    dex: string;
    assetA: Token;
    assetB: Token;
    reserveA: bigint;
    reserveB: bigint;
    address: string;
    marketOrderAddress: string;
    limitOrderAddress: string;

    lpToken: Asset;
    poolNft: Asset;
    identifier: string = '';
    poolFeePercent: number = 0;
    totalLpTokens: bigint = 0n;
    extra: any = {};

    constructor(dex: string, assetA: Token, assetB: Token, reserveA: bigint, reserveB: bigint, address: string, marketOrderAddress: string = '', limitOrderAddress: string = '') {
        this.dex = dex;
        this.assetA = assetA;
        this.assetB = assetB;
        this.reserveA = reserveA;
        this.reserveB = reserveB;
        this.address = address;
        this.marketOrderAddress = marketOrderAddress;
        this.limitOrderAddress = limitOrderAddress;
    }

    get uuid(): string {
        return `${this.dex}.${this.pair}.${this.identifier}`;
    }

    get pair(): string {
        const assetAName: string = this.assetA === 'lovelace' ? 'ADA' : this.assetA.assetName;
        const assetBName: string = this.assetB === 'lovelace' ? 'ADA' : this.assetB.assetName;

        return `${assetAName}/${assetBName}`;
    }

    get price(): number {
        const assetADecimals: number = this.assetA === 'lovelace' ? 6 : this.assetA.decimals;
        const assetBDecimals: number = this.assetB === 'lovelace' ? 6 : this.assetB.decimals;

        const adjustedReserveA: number = Number(this.reserveA) / (10**assetADecimals);
        const adjustedReserveB: number = Number(this.reserveB) / (10**assetBDecimals);

        return adjustedReserveA / adjustedReserveB;
    }

    get totalValueLocked(): number {
        const assetADecimals: number = this.assetA === 'lovelace' ? 6 : this.assetA.decimals;
        const assetBDecimals: number = this.assetB === 'lovelace' ? 6 : this.assetB.decimals;

        if (this.assetA === 'lovelace') {
            return (Number(this.reserveA) / 10**assetADecimals) + ((Number(this.reserveB) / 10**assetBDecimals) * this.price);
        }

        return ((Number(this.reserveA) / 10**assetADecimals) * this.price) * ((Number(this.reserveB) / 10**assetBDecimals) * (1 / this.price));
    }

}
