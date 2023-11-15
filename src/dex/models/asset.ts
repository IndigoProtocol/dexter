export class Asset {

    public policyId: string;
    public nameHex: string;
    public decimals: number;

    constructor(policyId: string, nameHex: string, decimals: number = 0) {
        this.policyId = policyId;
        this.nameHex = nameHex;
        this.decimals = decimals;
    }

    static fromIdentifier(id: string, decimals: number = 0): Asset {
        id = id.replace('.', '');

        return new Asset(
            id.slice(0, 56),
            id.slice(56),
            decimals,
        );
    }

    identifier(dilimeter: '' | '.' = ''): string {
        return this.policyId + dilimeter + this.nameHex;
    }

    get assetName(): string {
        return Buffer.from(this.nameHex, 'hex').toString();
    }

}

export type Token = Asset | 'lovelace';
