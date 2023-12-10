import { AssetBalance, BlockfrostConfig, Cip30Api, KupmiosConfig, PayToAddress, UTxO, WalletOptions } from '@app/types';
import { DexTransaction } from '@dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
import {
    Address,
    AddressDetails,
    Assets,
    Blockfrost,
    Datum, Kupmios,
    Lucid,
    TxComplete,
    TxHash,
    TxSigned,
    Unit
} from 'lucid-cardano';
import { AddressType } from '@app/constants';

export class LucidProvider extends BaseWalletProvider {

    public isWalletLoaded: boolean = false;

    private _api: Lucid;
    private _usableAddress: string;
    private _paymentCredential: string;
    private _stakingCredential: string | undefined;

    public address(): string {
        return this._usableAddress;
    }

    public publicKeyHash(): string {
        return this._paymentCredential;
    }

    public stakingKeyHash(): string {
        return this._stakingCredential ?? '';
    }

    public loadWallet(walletApi: Cip30Api, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider> {
        return this.loadLucid(config)
            .then((lucid: Lucid) => {
                this._api = lucid;

                this._api.selectWallet(walletApi);

                return this.loadWalletInformation();
            });
    }

    public loadWalletFromSeedPhrase(seed: string[], options: WalletOptions = {}, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider> {
        return this.loadLucid(config)
            .then((lucid: Lucid) => {
                this._api = lucid;

                const addressType: 'Base' | 'Enterprise' = options.addressType === AddressType.Enterprise
                    ? 'Enterprise'
                    : 'Base';

                this._api.selectWalletFromSeed(
                    seed.join(' '),
                    {
                        addressType: addressType,
                        accountIndex: options.accountIndex ?? 0,
                    },
                );

                return this.loadWalletInformation();
            });
    }

    public createTransaction(): DexTransaction {
        const transaction: DexTransaction = new DexTransaction(this);
        transaction.providerData.tx = this._api.newTx();

        return transaction;
    }

    public attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction {
        if (! transaction.providerData.tx) {
            return transaction;
        }

        transaction.providerData.tx.attachMetadata(key, json);

        return transaction;
    }

    public paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction> {
        payToAddresses.forEach((payToAddress: PayToAddress) => {
            const payment: Assets = this.paymentFromAssets(payToAddress.assetBalances);

            // Include UTxOs to spend
            if (payToAddress.spendUtxos && payToAddress.spendUtxos.length > 0) {
                transaction.providerData.tx.collectFrom(
                    payToAddress.spendUtxos.map((utxo: UTxO) => {
                        return {
                            txHash: utxo.txHash,
                            outputIndex: utxo.outputIndex,
                            address: utxo.address,
                            datumHash: utxo.datumHash,
                            assets: this.paymentFromAssets(utxo.assetBalances)
                        };
                    })
                );
            }

            switch (payToAddress.addressType) {
                case AddressType.Contract:
                    transaction.providerData.tx.payToContract(
                        payToAddress.address,
                        payToAddress.datum as Datum,
                        payment,
                    );
                    break;
                case AddressType.Base:
                case AddressType.Enterprise:
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
        if (! this.isWalletLoaded) {
            throw new Error('Must load wallet before signing transaction.');
        }

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

    private paymentFromAssets(assetBalances: AssetBalance[]): Assets {
        return assetBalances
            .reduce((payment: Record<Unit | 'lovelace', bigint>, assetBalance: AssetBalance) => {
                payment[assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier()] = assetBalance.quantity;

                return payment;
            }, {} as Assets);
    }

    private loadWalletInformation(): Promise<BaseWalletProvider> {
        return this._api.wallet.address()
            .then((address: Address) => {
                const details: AddressDetails = this._api.utils.getAddressDetails(
                    address,
                );

                this._usableAddress = address;
                this._paymentCredential = details.paymentCredential?.hash ?? '';
                this._stakingCredential = details.stakeCredential?.hash ?? '';

                this.isWalletLoaded = true;

                return this as BaseWalletProvider;
            });
    }

    private loadLucid(config: BlockfrostConfig | KupmiosConfig): Promise<Lucid> {
        return Lucid.new(
            'kupoUrl' in config
                ? new Kupmios(
                    config.kupoUrl,
                    config.ogmiosUrl
                )
                : new Blockfrost(
                    config.url,
                    config.projectId
                )
        );
    }

}
