export class Asset {

    public policyId: string;
    public assetNameHex: string;
    public decimals: number;

    constructor(policyId: string, assetNameHex: string, decimals: number = 0) {
        this.policyId = policyId;
        this.assetNameHex = assetNameHex;
        this.decimals = decimals;
    }

    static fromId(id: string): Asset {
        return new Asset(
            id.slice(0, 56),
            id.slice(56)
        );
    }

    id(dilimeter: '' | '.' = ''): string {
        return this.policyId + dilimeter + this.assetNameHex;
    }

    get assetName(): string {
        return Buffer.from(this.assetNameHex, 'hex').toString();
    }

}

export type Token = Asset | 'lovelace';