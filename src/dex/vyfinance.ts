import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '../providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import {
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    SwapFee,
    UTxO
} from '../types';
import { DefinitionBuilder } from '../definition-builder';
import { correspondingReserves } from '../utils';
import { AddressType, DatumParameterKey } from '../constants';
import order from './definitions/vyfinance/order';
import { BaseApi } from './api/base-api';
import { VyfinanceApi } from './api/vyfinance-api';

/**
 * VyFinance constants.
 */
const ORDER_ADDRESS: string = '';

export class VyFinance extends BaseDex {

    public readonly name: string = 'VyFinance';

    public api(): BaseApi {
        return new VyfinanceApi(this);
    }

    public async liquidityPools(provider: BaseDataProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return this.api().liquidityPools(assetA, assetB);
    }

    public liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB?: Token): LiquidityPool | undefined {
        return undefined;
    }

    public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const constFactor: bigint = reserveIn * reserveOut;
        const swapFee: bigint = BigInt((Number(swapInAmount) * liquidityPool.poolFeePercent / 100));

        return reserveOut - constFactor / (reserveIn + swapInAmount - swapFee);
    }

    public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const [reserveIn, reserveOut]: number[] = correspondingReserves(liquidityPool, swapInToken).map((x: bigint) => Number(x));

        const estimatedReceive: number = Number(this.estimatedReceive(liquidityPool, swapInToken, swapInAmount));
        const swapFee: number = Number(swapInAmount) * liquidityPool.poolFeePercent / 100;

        return (1 - estimatedReceive / ((Number(swapInAmount) - swapFee) * (reserveOut / reserveIn))) * 100;
    }

    public async buildSwapOrder(swapParameters: DatumParameters): Promise<PayToAddress[]> {
        const isDoubleSidedSwap: boolean = (swapParameters.SwapInTokenPolicyId as string) !== '' && (swapParameters.SwapOutTokenPolicyId as string) !== '';
        const swapDirection: number = (swapParameters.SwapInTokenPolicyId as string) === '' || isDoubleSidedSwap
            ? 3
            : 4

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.Action]: swapDirection,
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
                    address: ORDER_ADDRESS,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: this.swapOrderFees().reduce((feeAmount: bigint, fee: SwapFee) => feeAmount + fee.value, 0n),
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                }
            )
        ];
    }

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
            return utxo.address !== returnAddress;
        });

        if (! relevantUtxo) {
            return Promise.reject('Unable to find relevant UTxO for cancelling the swap order.');
        }

        return [
            {
                address: returnAddress,
                addressType: AddressType.Base,
                assetBalances: relevantUtxo.assetBalances,
                spendUtxos: [relevantUtxo],
            }
        ];
    }

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'processFee',
                title: 'Process Fee',
                description: 'Fee paid to the off-chain processor fulfilling order.',
                value: 1_900000n,
                isReturned: false,
            },
            {
                id: 'minAda',
                title: 'MinADA',
                description: 'MinADA will be held in the UTxO and returned when the order is processed.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}