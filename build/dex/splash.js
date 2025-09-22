import { BaseDex } from './base-dex.js';
import { DefinitionBuilder } from '../definition-builder.js';
import { AddressType, DatumParameterKey } from '../constants.js';
import order from './definitions/splash/order.js';
import { bytesToHex, correspondingReserves, hexToBytes, lucidUtils, tokensMatch } from '../utils.js';
import { Uint64BE } from 'int64-buffer';
import blake2b from 'blake2b';
import { Asset } from '@indigo-labs/iris-sdk';
const EXECUTOR_FEE = 1100000n;
const WORST_ORDER_STEP_COST = 900000n;
export class Splash extends BaseDex {
    constructor() {
        super(...arguments);
        /**
         * On-Chain constants.
         */
        this.cancelDatum = 'd87980';
        this.orderScriptHash = '464eeee89f05aff787d40045af2a40a83fd96c513197d32fbc54ff02';
        this.batcherKey = '5cb2c968e5d1c7197a6ce7615967310a375545d9bc65063a964335b2';
        this.orderScript = {
            type: 'PlutusV2',
            script: '59042d01000033232323232323222323232232253330093232533300b0041323300100137566022602460246024602460246024601c6ea8008894ccc040004528099299980719baf00d300f301300214a226600600600260260022646464a66601c6014601e6ea80044c94ccc03cc030c040dd5000899191929998090038a99980900108008a5014a066ebcc020c04cdd5001180b180b980b980b980b980b980b980b980b980b98099baa00f3375e600860246ea8c010c048dd5180a98091baa00230043012375400260286eb0c050c054c054c044dd50028b1991191980080080191299980a8008a60103d87a80001323253330143375e6016602c6ea80080144cdd2a40006603000497ae0133004004001301900230170013758600a60206ea8010c04cc040dd50008b180098079baa0052301230130013322323300100100322533301200114a0264a66602066e3cdd7180a8010020a5113300300300130150013758602060226022602260226022602260226022601a6ea8004dd71808180898089808980898089808980898089808980898069baa0093001300c37540044601e00229309b2b19299980598050008a999804180218048008a51153330083005300900114a02c2c6ea8004c8c94ccc01cc010c020dd50028991919191919191919191919191919191919191919191919299981118128010991919191924c646600200200c44a6660500022930991980180198160011bae302a0015333022301f30233754010264646464a666052605800426464931929998141812800899192999816981800109924c64a666056605000226464a66606060660042649318140008b181880098169baa0021533302b3027001132323232323253330343037002149858dd6981a800981a8011bad30330013033002375a6062002605a6ea800858c0acdd50008b181700098151baa0031533302830240011533302b302a37540062930b0b18141baa002302100316302a001302a0023028001302437540102ca666042603c60446ea802c4c8c8c8c94ccc0a0c0ac00852616375a605200260520046eb4c09c004c08cdd50058b180d006180c8098b1bac30230013023002375c60420026042004603e002603e0046eb4c074004c074008c06c004c06c008c064004c064008dd6980b800980b8011bad30150013015002375a60260026026004602200260220046eb8c03c004c03c008dd7180680098049baa0051625333007300430083754002264646464a66601c60220042930b1bae300f001300f002375c601a00260126ea8004588c94ccc01cc0100044c8c94ccc030c03c00852616375c601a00260126ea800854ccc01cc00c0044c8c94ccc030c03c00852616375c601a00260126ea800858c01cdd50009b8748008dc3a4000ae6955ceaab9e5573eae815d0aba24c0126d8799fd87a9f581c96f5c1bee23481335ff4aece32fe1dfa1aa40a944a66d2d6edc9a9a5ffff0001',
        };
    }
    estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
        const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
        return (reserveIn * reserveOut) / (reserveOut - swapOutAmount) - reserveIn;
    }
    estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
        const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
        return reserveOut - (reserveIn * reserveOut) / (reserveIn + swapInAmount);
    }
    priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
        if (!liquidityPool.state)
            return 0;
        const reserveIn = tokensMatch(swapInToken, liquidityPool.tokenA)
            ? liquidityPool.state.reserveA
            : liquidityPool.state.reserveB;
        return (1 - (Number(reserveIn) / Number(reserveIn + swapInAmount))) * 100;
    }
    async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
        const batcherFee = this.swapOrderFees().find((fee) => fee.id === 'batcherFee');
        const deposit = this.swapOrderFees().find((fee) => fee.id === 'deposit');
        const minReceive = swapParameters.MinReceive;
        if (!batcherFee || !deposit || !minReceive) {
            return Promise.reject('Parameters for datum are not set.');
        }
        if (!this.dexter.dataProvider) {
            return Promise.reject('Data provider is required.');
        }
        const walletUtxos = await this.dexter.dataProvider.utxos(swapParameters[DatumParameterKey.Address], swapParameters[DatumParameterKey.SwapInTokenPolicyId] !== ''
            ? new Asset(swapParameters.SwapInTokenPolicyId, swapParameters.SwapInTokenAssetName)
            : undefined);
        const firstUtxo = walletUtxos[0];
        const decimalToFractionalImproved = (decimalValue) => {
            const [whole, decimals = ''] = decimalValue.toString()?.split('.');
            let truncatedDecimals = decimals.slice(0, 15);
            const denominator = BigInt(10 ** truncatedDecimals.length);
            const numerator = BigInt(whole) * denominator + BigInt(decimals);
            return [numerator, denominator];
        };
        const swapOutToken = swapParameters.SwapOutTokenPolicyId === 'lovelace'
            ? 'lovelace'
            : new Asset(swapParameters.SwapOutTokenPolicyId, swapParameters.SwapOutTokenAssetName);
        const outDecimals = swapOutToken === 'lovelace'
            ? 6
            : (tokensMatch(swapOutToken, liquidityPool.tokenA)) ? liquidityPool.tokenA.decimals ?? 0 : liquidityPool.tokenB.decimals ?? 0;
        const [numerator, denominator] = decimalToFractionalImproved(Number(minReceive) / 10 ** outDecimals);
        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.Action]: '00',
            [DatumParameterKey.BaseFee]: WORST_ORDER_STEP_COST,
            [DatumParameterKey.ExecutionFee]: EXECUTOR_FEE,
            [DatumParameterKey.LpFeeNumerator]: numerator,
            [DatumParameterKey.LpFeeDenominator]: denominator,
            [DatumParameterKey.Beacon]: bytesToHex(Uint8Array.from(new Array(28).fill(0))),
            [DatumParameterKey.Batcher]: this.batcherKey,
        };
        const datumBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order).then((builder) => {
            builder.pushParameters(swapParameters);
        });
        const hash = blake2b(28).update(hexToBytes(datumBuilder.getCbor())).digest('hex');
        swapParameters.Beacon = this.getBeacon(firstUtxo, hash);
        await datumBuilder.loadDefinition(order).then((builder) => {
            builder.pushParameters(swapParameters);
        });
        return [
            this.buildSwapOrderPayment(swapParameters, {
                address: lucidUtils.credentialToAddress({
                    type: 'Script',
                    hash: this.orderScriptHash,
                }, {
                    type: 'Key',
                    hash: swapParameters.SenderStakingKeyHash,
                }),
                addressType: AddressType.Contract,
                assetBalances: [
                    {
                        asset: 'lovelace',
                        quantity: batcherFee?.value + deposit.value,
                    },
                ],
                datum: datumBuilder.getCbor(),
                isInlineDatum: true,
                spendUtxos: spendUtxos.concat({ utxo: firstUtxo }),
            }),
        ];
    }
    async buildCancelSwapOrder(txOutputs, returnAddress) {
        const relevantUtxo = txOutputs.find((utxo) => {
            const addressDetails = lucidUtils.getAddressDetails(utxo.address);
            return (addressDetails.paymentCredential?.hash ?? '') === this.orderScriptHash;
        });
        if (!relevantUtxo) {
            return Promise.reject('Unable to find relevant UTxO for cancelling the swap order.');
        }
        return [
            {
                address: returnAddress,
                addressType: AddressType.Base,
                assetBalances: relevantUtxo.assetBalances,
                isInlineDatum: false,
                spendUtxos: [{
                        utxo: relevantUtxo,
                        redeemer: this.cancelDatum,
                        validator: this.orderScript,
                        signer: returnAddress,
                    }],
            }
        ];
    }
    swapOrderFees() {
        const networkFee = 0.5;
        const reward = 1;
        const minNitro = 1.2;
        const batcherFee = (reward + networkFee) * minNitro;
        const batcherFeeInAda = BigInt(Math.round(batcherFee * 10 ** 6));
        return [
            {
                id: 'batcherFee',
                title: 'Batcher Fee',
                description: 'Fee paid for the service of off-chain batcher to process transactions.',
                value: batcherFeeInAda,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 2000000n,
                isReturned: true,
            },
        ];
    }
    getBeacon(utxo, datumHash) {
        return blake2b(28).update(Uint8Array.from([
            ...hexToBytes(utxo.txHash),
            ...new Uint64BE(Number(utxo.outputIndex)).toArray(),
            ...new Uint64BE(0).toArray(),
            ...hexToBytes(datumHash),
        ])).digest('hex');
    }
}
Splash.identifier = 'Splash';
