import { AssetBalance, BlockfrostConfig, Cip30Api, PayToAddress, UTxO, WalletOptions } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
import {
    Address,
    AddressDetails,
    Assets,
    Blockfrost,
    Datum,
    Lucid,
    TxComplete,
    TxHash,
    TxSigned,
    Unit
} from 'lucid-cardano';
import { AddressType } from '../../constants';

export class LucidProvider extends BaseWalletProvider {

    private _api: Lucid;
    private _usableAddress: string;
    private _paymentCredential: string;
    private _stakingCredential: string | undefined;

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
    }

    public address(): string {
        return this._usableAddress;
    }

    public publicKeyHash(): string {
        return this._paymentCredential;
    }

    public stakingKeyHash(): string {
        return this._stakingCredential ?? '';
    }

    public loadWallet(walletApi: Cip30Api): Promise<BaseWalletProvider> {
        this._api.selectWallet(walletApi);

        return this.loadWalletInformation();
    }

    public loadWalletFromSeedPhrase(seed: string[], options: WalletOptions): Promise<BaseWalletProvider> {
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
    }

    public createTransaction(): DexTransaction {
        const transaction: DexTransaction = new DexTransaction(this);
        transaction.providerData.tx = this._api.newTx();

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
                payment[assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id()] = assetBalance.quantity;

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

                return this as BaseWalletProvider;
            });
    }

}