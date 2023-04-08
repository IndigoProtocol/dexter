export class Asset {

    policyId: string;
    assetHex: string;

    constructor(policyId: string, assetHex: string) {
        this.policyId = policyId;
        this.assetHex = assetHex;
    }

    static fromId(id: string): Asset {
        return new Asset(
            id.slice(0, 56),
            id.slice(56)
        );
    }

    get assetName(): string {
        return Buffer.from(this.assetHex, 'hex').toString();
    }

    id(dilimeter: '' | '.' = '') {
        return `${this.policyId}${dilimeter}${this.assetHex}`;
    }

}

export type Token = Asset | 'lovelace';