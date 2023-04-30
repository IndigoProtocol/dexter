import { DexTransaction, MockWalletProvider } from '../src';

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

});