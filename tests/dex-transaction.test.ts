import { DexTransaction, MockWalletProvider, TransactionStatus } from '../src';

describe('DexTransaction', () => {

    const transaction: DexTransaction = new DexTransaction(new MockWalletProvider());

    it('Fails to submit when un-signed', () => {
        expect(() => { transaction.submit(); }).toThrowError();
    });

    it('Can sign', () => {
        return transaction.sign()
            .then(() => {
                expect(transaction.isSigned).toBe(true);
            });
    });

    it('Can submit', () => {
        return transaction.submit()
            .then(() => {
                expect(transaction.hash).toBe('hashtest');
            });
    });

    it('Can expose building status', () => {
        const testTransaction: DexTransaction = new DexTransaction(new MockWalletProvider());
        let receivedStatus: boolean = false;

        testTransaction.onBuilding(() => receivedStatus = true);

        testTransaction.status = TransactionStatus.Building;

        expect(receivedStatus).toBe(true);
    });

    it('Can expose signing status', () => {
        const testTransaction: DexTransaction = new DexTransaction(new MockWalletProvider());
        let receivedStatus: boolean = false;

        testTransaction.onSigning(() => receivedStatus = true);

        testTransaction.status = TransactionStatus.Signing;

        expect(receivedStatus).toBe(true);
    });

    it('Can expose submitting status', () => {
        const testTransaction: DexTransaction = new DexTransaction(new MockWalletProvider());
        let receivedStatus: boolean = false;

        testTransaction.onSubmitting(() => receivedStatus = true);

        testTransaction.status = TransactionStatus.Submitting;

        expect(receivedStatus).toBe(true);
    });

    it('Can expose submitted status', () => {
        const testTransaction: DexTransaction = new DexTransaction(new MockWalletProvider());
        let receivedStatus: boolean = false;

        testTransaction.onSubmitted(() => receivedStatus = true);

        testTransaction.status = TransactionStatus.Submitted;

        expect(receivedStatus).toBe(true);
    });

    it('Can expose error status', () => {
        const testTransaction: DexTransaction = new DexTransaction(new MockWalletProvider());
        let receivedStatus: boolean = false;

        testTransaction.onError(() => receivedStatus = true);

        testTransaction.status = TransactionStatus.Errored;

        expect(receivedStatus).toBe(true);
    });

});
