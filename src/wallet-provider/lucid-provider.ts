import { AssetBalance, BlockfrostConfig, PayToAddress } from '../types';
import { DexTransaction } from '../dex/models/dex-transaction';
import { WalletProvider } from './wallet-provider';
import { Blockfrost, Datum, Lucid, Tx, Unit } from 'lucid-cardano';
import { AddressType } from '../constants';

export class LucidProvider extends WalletProvider {

    private api: Lucid;
    private paymentCredential: string;
    private stakingCredential: string;
    private tx: Tx;

    async constructor(config: BlockfrostConfig) {
        super();

        if (config.projectId) {
            this.api = await Lucid.new(
                new Blockfrost(
                    config.url,
                    config.projectId
                ),
            );
        } else {
            this.api = await Lucid.new();
        }
    }

    publicKeyHash(): string {
        return this.paymentCredential;
    }

    stakingKeyHash(): string {
        return this.stakingCredential;
    }

    createTransaction(): DexTransaction {
        this.tx = this.api.newTx();

        return new DexTransaction();
    }

    payToAddresses(payToAddresses: PayToAddress[]): WalletProvider {
        payToAddresses.forEach((payToAddress: PayToAddress) => {
            // const payment: Record<Unit | 'lovelace', bigint> = {
            //     lovelace: payToAddress.assetBalances.reduce((total: bigint, assetBalance: AssetBalance) => {
            //         return assetBalance.asset === 'lovelace' ? total + assetBalance.quantity : total;
            //     }, 0n),
            // };

            const payment: Record<Unit | 'lovelace', bigint> = payToAddress.assetBalances
                .reduce((payment: Record<Unit | 'lovelace', bigint>, assetBalance: AssetBalance) => {
                    if (assetBalance.asset === 'lovelace') {
                        payment['lovelace'] = assetBalance.quantity;
                    }

                    return payment;
                }, { lovelace: 0n });

            if (payToAddress.addressType === AddressType.Contract) {
                this.tx.payToContract(
                    payToAddress.address,
                    payToAddress.datum as Datum,
                    payment,
                )
            }
        });

        return this;
    }

    submitTransaction(): WalletProvider {
        return this;
    }

}