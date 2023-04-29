import { AssetBalance, BlockfrostConfig, PayToAddress } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';
import { WalletProvider } from './wallet-provider';
import { Blockfrost, Datum, Lucid, TxComplete, TxHash, TxSigned, Unit } from 'lucid-cardano';
import { AddressType } from '../../constants';

export class LucidProvider extends WalletProvider {

    private _api: Lucid;
    private _usableAddress: string;
    private _paymentCredential: string;
    private _stakingCredential: string;

    constructor(config: BlockfrostConfig) {
        super();

        Lucid.new(
            new Blockfrost(
                config.url,
                config.projectId
            ),
        ).then((lucid: Lucid) => {
            this._api = lucid;
        });

        //todo: need to load wallet
    }

    public address(): string {
        return this._usableAddress;
    }

    public publicKeyHash(): string {
        return this._paymentCredential;
    }

    public stakingKeyHash(): string {
        return this._stakingCredential;
    }

    public createTransaction(): DexTransaction {
        const transaction: DexTransaction = new DexTransaction(this);
        transaction.providerData.tx = this._api.newTx();

        return transaction;
    }

    public paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction> {
        payToAddresses.forEach((payToAddress: PayToAddress) => {
            const payment: Record<Unit | 'lovelace', bigint> = payToAddress.assetBalances
                .reduce((payment: Record<Unit | 'lovelace', bigint>, assetBalance: AssetBalance) => {
                    payment[assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id()] = assetBalance.quantity;

                    return payment;
                }, {} as Record<Unit | 'lovelace', bigint>);

            switch (payToAddress.addressType) {
                case AddressType.Contract:
                    transaction.providerData.tx.payToContract(
                        payToAddress.address,
                        payToAddress.datum as Datum,
                        payment,
                    );
                    break;
                case AddressType.Address:
                    transaction.providerData.tx.payToAddress(
                        payToAddress.address,
                        payment,
                    );
                    break;
                default:
                    throw new Error('Encountered unknown address type.');
            }
        });

        return transaction.providerData.tx.complete()
            .then((tx: TxComplete) => {
                transaction.providerData.tx = tx;

                return transaction;
            });
    }

    public signTransaction(transaction: DexTransaction): Promise<DexTransaction> {
        return transaction.providerData.tx.sign().complete()
            .then((signedTx: TxSigned) => {
                transaction.providerData.tx = signedTx;

                return transaction;
            });
    }

    public submitTransaction(transaction: DexTransaction): Promise<string> {
        return transaction.providerData.tx.submit()
            .then((txHash: TxHash) => {
                return txHash;
            });
    }

}