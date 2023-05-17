import { LiquidityPool } from './models/liquidity-pool';
import { DataProvider } from '../providers/data/data-provider';
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

/**
 * VyFinance constants.
 */
const POOL_ADDRESS: string = '';
const ORDER_ADDRESS: string = '';
const POOL_VALIDITY_ASSET: string = '';

export class VyFinance extends BaseDex {

    public readonly name: string = 'VyFinance';

    public async liquidityPools(provider: DataProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

    public liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB?: Token): LiquidityPool | undefined {
        return undefined;
    }

    public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        return 0n;
    }

    public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        return 0;
    }

    public async buildSwapOrder(swapParameters: DatumParameters): Promise<PayToAddress[]> {
        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition('/vyfinance/order.ts')
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
        return Promise.resolve([]);
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