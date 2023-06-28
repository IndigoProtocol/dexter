import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Token } from './models/asset';
import { BaseDex } from './base-dex';
import { DatumParameters, PayToAddress, RequestConfig, SwapFee, UTxO } from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import order from '@dex/definitions/vyfinance/order';
import { BaseApi } from '@dex/api/base-api';
import { VyfinanceApi } from '@dex/api/vyfinance-api';

/**
 * VyFinance constants.
 */
const SWAP_ACTION_EXPECT_ASSET: number = 3;
const SWAP_ACTION_EXPECT_ADA: number = 4;

export class VyFinance extends BaseDex {

    public readonly name: string = 'VyFinance';
    public readonly api: BaseApi;

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new VyfinanceApi(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.reject('Unimplemented');
    }

    public async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        return Promise.reject('Unimplemented');
    }

    public liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        return Promise.reject('Unimplemented');
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        return 0n;
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

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters): Promise<PayToAddress[]> {
        const isDoubleSidedSwap: boolean = (swapParameters.SwapInTokenPolicyId as string) !== '' && (swapParameters.SwapOutTokenPolicyId as string) !== '';
        const swapDirection: number = (swapParameters.SwapInTokenPolicyId as string) === '' || isDoubleSidedSwap
            ? SWAP_ACTION_EXPECT_ASSET
            : SWAP_ACTION_EXPECT_ADA;

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.Action]: swapDirection,
            [DatumParameterKey.SenderKeyHashes]: (swapParameters.SenderPubKeyHash as string) + (swapParameters.SenderStakingKeyHash as string),
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
                    address: liquidityPool.extra.orderAddress,
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
