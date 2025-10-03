import { DatumParameterKey } from '../constants.js';
import { tokensMatch } from '../utils.js';
import { Asset } from '@indigo-labs/iris-sdk';
export class BaseDex {
    constructor(dexter) {
        this.dexter = dexter;
    }
    /**
     * Adjust the payment for the DEX order address to include the swap in amount.
     */
    buildSwapOrderPayment(swapParameters, orderPayment) {
        const swapInAmount = swapParameters[DatumParameterKey.SwapInAmount];
        const swapInToken = swapParameters[DatumParameterKey.SwapInTokenPolicyId]
            ? new Asset(swapParameters[DatumParameterKey.SwapInTokenPolicyId], swapParameters[DatumParameterKey.SwapInTokenAssetName])
            : 'lovelace';
        let assetBalance = orderPayment.assetBalances.find((payment) => {
            return tokensMatch(payment.asset, swapInToken);
        });
        if (!assetBalance) {
            orderPayment.assetBalances.push({
                asset: swapInToken,
                quantity: swapInAmount,
            });
        }
        else {
            assetBalance.quantity += swapInAmount;
        }
        return orderPayment;
    }
}
