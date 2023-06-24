import { Dexter } from '@app/dexter';
import { Transaction, UTxO } from "@app/types";
import { LiquidityPool } from "@dex/models/liquidity-pool";
import { BaseDex } from "@dex/base-dex";

export class ListenerRequest {

    private _dexter: Dexter;
    private _onDexs: BaseDex[] = [];

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    /**
     * Listen for an updated state on specific DEXs.
     */
    public forDexs(dexs: string | string[]): ListenerRequest {
        (Array.isArray(dexs) ? dexs : [dexs]).forEach((dexName: string) => {
            if (! Object.keys(this._dexter.availableDexs).includes(dexName)) {
                throw new Error(`DEX ${dexName} is not available.`);
            }

            this._onDexs = this._onDexs.filter((dex: BaseDex) => {
                return dex.name !== dexName;
            }).concat(this._dexter.availableDexs[dexName]);
        });

        return this;
    }

    /**
     * Listen for an updated state on all available DEXs.
     */
    public forAllDexs(): ListenerRequest {
        this._onDexs = Object.values(this._dexter.availableDexs);

        return this;
    }

    public async onTransaction(tx: Transaction): Promise<LiquidityPool | undefined> {
        if (tx.outputs.length == 0) {
            return Promise.resolve(undefined);
        }

        for (const dex of (this._onDexs as BaseDex[])) {
            if (!this._dexter.dataProvider) {
                return Promise.resolve(undefined);
            }

            const poolAddresses: string[] = await dex.liquidityPoolAddresses(this._dexter.dataProvider);

            const correspondingUtxo: UTxO | undefined = tx.outputs.find((utxo: UTxO) => {
                return poolAddresses.includes(utxo.address);
            });

            if (correspondingUtxo) {
                return dex.liquidityPoolFromUtxo(this._dexter.dataProvider, correspondingUtxo);
            }
        }

        return Promise.resolve(undefined);
    }

}
