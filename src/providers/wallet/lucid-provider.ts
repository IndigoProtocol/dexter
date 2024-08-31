import {
    AssetBalance,
    BlockfrostConfig,
    Cip30Api,
    KupmiosConfig,
    PayToAddress,
    SpendUTxO,
    WalletOptions
} from '@app/types';
import { DexTransaction } from '@dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
import {
    Address,
    AddressDetails,
    Assets,
    Blockfrost,
    CBORHex,
    getAddressDetails,
    Kupmios,
    Lucid,
    LucidEvolution,
    TxHash,
    TxSignBuilder,
    TxSigned,
    Unit
} from '@lucid-evolution/lucid';
import { AddressType } from '@app/constants';

export class LucidProvider extends BaseWalletProvider {

    public isWalletLoaded: boolean = false;

    private _api: LucidEvolution;
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
            .then((lucid: LucidEvolution) => {
                this._api = lucid;

                this._api.selectWallet.fromAPI(walletApi);

                return this.loadWalletInformation();
            });
    }

    public loadWalletFromSeedPhrase(seed: string[], options: WalletOptions = {}, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider> {
        return this.loadLucid(config)
            .then((lucid: LucidEvolution) => {
                this._api = lucid;
                this._api.selectWallet.fromSeed(seed.join(' '));

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
                payToAddress.spendUtxos.forEach((spendUtxo: SpendUTxO) => {
                    transaction.providerData.tx.collectFrom([
                        {
                            txHash: spendUtxo.utxo.txHash,
                            outputIndex: spendUtxo.utxo.outputIndex,
                            address: spendUtxo.utxo.address,
                            datumHash: spendUtxo.utxo.datum ? null : spendUtxo.utxo.datumHash,
                            datum: spendUtxo.utxo.datum,
                            assets: this.paymentFromAssets(spendUtxo.utxo.assetBalances),
                        }
                    ], spendUtxo.redeemer);

                    if (spendUtxo.validator) {
                        transaction.providerData.tx.attach.SpendingValidator(spendUtxo.validator);
                    }

                    if (spendUtxo.signer) {
                        transaction.providerData.tx.addSigner(spendUtxo.signer);
                    }
                });
            }

            switch (payToAddress.addressType) {
                case AddressType.Contract:
                    transaction.providerData.tx.pay.ToContract(
                        payToAddress.address,
                        payToAddress.isInlineDatum
                            ? {
                                kind: 'inline',
                                value: payToAddress.datum as CBORHex,
                            }
                            : {
                                kind: 'asHash',
                                value: payToAddress.datum as CBORHex
                            },
                        payment,
                    );
                    break;
                case AddressType.Base:
                case AddressType.Enterprise:
                    transaction.providerData.tx.pay.ToAddress(
                        payToAddress.address,
                        payment,
                    );
                    break;
                default:
                    throw new Error('Encountered unknown address type.');
            }
        });

        return transaction.providerData.tx.complete()
            .then((tx: TxSignBuilder) => {
                transaction.providerData.tx = tx;

                return transaction;
            });
    }

    public signTransaction(transaction: DexTransaction): Promise<DexTransaction> {
        if (! this.isWalletLoaded) {
            throw new Error('Must load wallet before signing transaction.');
        }

        return transaction.providerData.tx.sign.withWallet().complete()
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
        return this._api.wallet().address()
            .then((address: Address) => {
                const details: AddressDetails = getAddressDetails(
                    address,
                );

                this._usableAddress = address;
                this._paymentCredential = details.paymentCredential?.hash ?? '';
                this._stakingCredential = details.stakeCredential?.hash ?? '';

                this.isWalletLoaded = true;

                return this as BaseWalletProvider;
            });
    }

    private loadLucid(config: BlockfrostConfig | KupmiosConfig): Promise<LucidEvolution> {
        return Lucid(
            'kupoUrl' in config
                ? new Kupmios(
                    config.kupoUrl,
                    config.ogmiosUrl
                )
                : new Blockfrost(
                    config.url,
                    config.projectId
                ),
            'Mainnet',
        );
    }

}
