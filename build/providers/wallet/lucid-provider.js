import { DexTransaction } from '../../dex/models/dex-transaction.js';
import { BaseWalletProvider } from './base-wallet-provider.js';
import { Blockfrost, Kupmios, Lucid } from 'lucid-cardano';
import { AddressType } from '../../constants.js';
export class LucidProvider extends BaseWalletProvider {
    constructor() {
        super(...arguments);
        this.isWalletLoaded = false;
    }
    address() {
        return this._usableAddress;
    }
    publicKeyHash() {
        return this._paymentCredential;
    }
    stakingKeyHash() {
        return this._stakingCredential ?? '';
    }
    loadWallet(walletApi, config) {
        return this.loadLucid(config)
            .then((lucid) => {
            this._api = lucid;
            this._api.selectWallet(walletApi);
            return this.loadWalletInformation();
        });
    }
    loadWalletFromSeedPhrase(seed, options = {}, config) {
        return this.loadLucid(config)
            .then((lucid) => {
            this._api = lucid;
            const addressType = options.addressType === AddressType.Enterprise
                ? 'Enterprise'
                : 'Base';
            this._api.selectWalletFromSeed(seed.join(' '), {
                addressType: addressType,
                accountIndex: options.accountIndex ?? 0,
            });
            return this.loadWalletInformation();
        });
    }
    createTransaction() {
        const transaction = new DexTransaction(this);
        transaction.providerData.tx = this._api.newTx();
        return transaction;
    }
    attachMetadata(transaction, key, json) {
        if (!transaction.providerData.tx) {
            return transaction;
        }
        transaction.providerData.tx.attachMetadata(key, json);
        return transaction;
    }
    async paymentsForTransaction(transaction, payToAddresses) {
        payToAddresses.forEach((payToAddress) => {
            const payment = this.paymentFromAssets(payToAddress.assetBalances);
            // Include UTxOs to spend
            if (payToAddress.spendUtxos && payToAddress.spendUtxos.length > 0) {
                payToAddress.spendUtxos.forEach((spendUtxo) => {
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
                        transaction.providerData.tx.attachSpendingValidator(spendUtxo.validator);
                    }
                    if (spendUtxo.signer) {
                        transaction.providerData.tx.addSigner(spendUtxo.signer);
                    }
                });
            }
            switch (payToAddress.addressType) {
                case AddressType.Contract:
                    transaction.providerData.tx.payToContract(payToAddress.address, payToAddress.isInlineDatum
                        ? {
                            inline: payToAddress.datum,
                        }
                        : payToAddress.datum, payment);
                    break;
                case AddressType.Base:
                case AddressType.Enterprise:
                    transaction.providerData.tx.payToAddress(payToAddress.address, payment);
                    break;
                default:
                    throw new Error('Encountered unknown address type.');
            }
        });
        return transaction.providerData.tx.complete()
            .then((tx) => {
            transaction.providerData.tx = tx;
            return transaction;
        });
    }
    signTransaction(transaction) {
        if (!this.isWalletLoaded) {
            throw new Error('Must load wallet before signing transaction.');
        }
        return transaction.providerData.tx.sign().complete()
            .then((signedTx) => {
            transaction.providerData.tx = signedTx;
            return transaction;
        });
    }
    submitTransaction(transaction) {
        return transaction.providerData.tx.submit()
            .then((txHash) => {
            return txHash;
        });
    }
    paymentFromAssets(assetBalances) {
        return assetBalances
            .reduce((payment, assetBalance) => {
            payment[assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier()] = assetBalance.quantity;
            return payment;
        }, {});
    }
    loadWalletInformation() {
        return this._api.wallet.address()
            .then((address) => {
            const details = this._api.utils.getAddressDetails(address);
            this._usableAddress = address;
            this._paymentCredential = details.paymentCredential?.hash ?? '';
            this._stakingCredential = details.stakeCredential?.hash ?? '';
            this.isWalletLoaded = true;
            return this;
        });
    }
    loadLucid(config) {
        return Lucid.new('kupoUrl' in config
            ? new Kupmios(config.kupoUrl, config.ogmiosUrl)
            : new Blockfrost(config.url, config.projectId));
    }
}
