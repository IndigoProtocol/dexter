import { BaseDex } from './base-dex';
import {
    DatumParameters,
    PayToAddress,
    SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import order from '@dex/definitions/minswap-v1/order';
import { Script } from 'lucid-cardano';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';

export class Minswap extends BaseDex {

    public static readonly identifier: string = 'Minswap';

    /**
     * On-Chain constants.
     */
    public readonly marketOrderAddress: string = 'addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt';
    public readonly limitOrderAddress: string = 'addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '59014f59014c01000032323232323232322223232325333009300e30070021323233533300b3370e9000180480109118011bae30100031225001232533300d3300e22533301300114a02a66601e66ebcc04800400c5288980118070009bac3010300c300c300c300c300c300c300c007149858dd48008b18060009baa300c300b3754601860166ea80184ccccc0288894ccc04000440084c8c94ccc038cd4ccc038c04cc030008488c008dd718098018912800919b8f0014891ce1317b152faac13426e6a83e06ff88a4d62cce3c1634ab0a5ec133090014a0266008444a00226600a446004602600a601a00626600a008601a006601e0026ea8c03cc038dd5180798071baa300f300b300e3754601e00244a0026eb0c03000c92616300a001375400660106ea8c024c020dd5000aab9d5744ae688c8c0088cc0080080048c0088cc00800800555cf2ba15573e6e1d200201',
    };

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        if (! liquidityPool.state) return 0n;

        const poolFeeMultiplier: bigint = 10000n;
        const poolFeePercent: number = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const swapInNumerator: bigint = swapOutAmount * reserveIn * poolFeeMultiplier;
        const swapInDenominator: bigint = (reserveOut - swapOutAmount) * poolFeeModifier;

        return swapInNumerator / swapInDenominator + 1n;
    }

    public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        if (! liquidityPool.state) return 0n;

        const poolFeeMultiplier: bigint = 10000n;
        const poolFeePercent: number = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * reserveOut * poolFeeModifier;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        return swapOutNumerator / swapOutDenominator;
    }

    public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        if (! liquidityPool.state) return 0;

        const poolFeeMultiplier: bigint = 10000n;
        const poolFeePercent: number = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * poolFeeModifier * reserveOut;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        const priceImpactNumerator: bigint = (reserveOut * swapInAmount * swapOutDenominator * poolFeeModifier)
            - (swapOutNumerator * reserveIn * poolFeeMultiplier);
        const priceImpactDenominator: bigint = reserveOut * swapInAmount * swapOutDenominator * poolFeeMultiplier;

        return Number(priceImpactNumerator * 100n) / Number(priceImpactDenominator);
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = []): Promise<PayToAddress[]> {
        const networkFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'networkFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

        if (! networkFee || ! deposit) {
            return Promise.reject('Parameters for datum are not set.');
        }

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.BatcherFee]: networkFee.value,
            [DatumParameterKey.DepositFee]: deposit.value,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order)
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: this.marketOrderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: networkFee.value + deposit.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                    isInlineDatum: false,
                    spendUtxos: spendUtxos,
                }
            )
        ];
    }

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
            return [this.marketOrderAddress, this.limitOrderAddress].includes(utxo.address);
        });

        if (! relevantUtxo) {
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

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'networkFee',
                title: 'Network Fee',
                description: 'The fee paid to the Cardano network to process a transaction.',
                value: 900000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}
