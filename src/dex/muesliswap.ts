import { BaseDex } from './base-dex';
import {
    AssetAddress,
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    RequestConfig,
    SwapFee,
    UTxO
} from '@app/types';
import { Asset, Token } from './models/asset';
import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import pool from '@dex/definitions/muesliswap/pool';
import order from '@dex/definitions/muesliswap/order';
import { BaseApi } from '@dex/api/base-api';
import { MuesliSwapApi } from '@dex/api/muesliswap-api';

export class MuesliSwap extends BaseDex {

    public static readonly identifier: string = 'MuesliSwap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1zyq0kyrml023kwjk8zr86d5gaxrt5w8lxnah8r6m6s4jp4g3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqqktyhv';
    public readonly lpTokenPolicyId: string = 'af3d70acf4bd5b3abb319a7d75c89fb3e56eafcdd46b2e9b57a2557f';
    public readonly poolNftPolicyIdV1: string = '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f';
    public readonly poolNftPolicyIdV2: string = '7a8041a0693e6605d010d5185b034d55c79eaf7ef878aae3bdcdbf67';
    public readonly factoryToken: string = 'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f4d7565736c69537761705f414d4d';

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new MuesliSwapApi(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        const validityAsset: Asset = Asset.fromIdentifier(this.factoryToken);
        const assetAddresses: AssetAddress[] = await provider.assetAddresses(validityAsset);

        return Promise.resolve([...new Set(assetAddresses.map((assetAddress: AssetAddress) => assetAddress.address))]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const validityAsset: Asset = Asset.fromIdentifier(this.factoryToken);
        const poolAddresses: string[] = await this.liquidityPoolAddresses(provider);

        const addressPromises: Promise<LiquidityPool[]>[] = poolAddresses.map(async (address: string) => {
            const utxos: UTxO[] = await provider.utxos(address, validityAsset);

            return await Promise.all(
                utxos.map(async (utxo: UTxO): Promise<LiquidityPool | undefined> => {
                    return await this.liquidityPoolFromUtxo(provider, utxo);
                })
            )
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool): boolean => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[]
            });
        });

        return Promise.all(addressPromises)
            .then((liquidityPools: (Awaited<LiquidityPool[]>)[]) => liquidityPools.flat());
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (! utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier();

            return ! assetBalanceId.startsWith(this.factoryToken.slice(0, 56))
                && ! [this.poolNftPolicyIdV1, this.poolNftPolicyIdV2].includes(assetBalanceId);
        });

        // Irrelevant UTxO
        if (relevantAssets.length < 2) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            MuesliSwap.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress,
        );

        // Load additional pool information
        const lpToken: Asset = utxo.assetBalances.find((assetBalance: AssetBalance) => {
            return assetBalance.asset !== 'lovelace' && [this.poolNftPolicyIdV1, this.poolNftPolicyIdV2].includes(assetBalance.asset.policyId);
        })?.asset as Asset;

        if (lpToken) {
            lpToken.policyId = this.lpTokenPolicyId;
            liquidityPool.lpToken = lpToken;
            liquidityPool.identifier = lpToken.identifier();
        }

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                ? BigInt(parameters.TotalLpTokens)
                : 0n;
            liquidityPool.poolFeePercent = typeof parameters.LpFee === 'number'
                ? parameters.LpFee / 100
                : 0;

        } catch (e) {
            return liquidityPool;
        }

        return liquidityPool;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const receive: number = (Number(reserveIn) * Number(reserveOut)) / (Number(reserveOut) - Number(swapOutAmount)) - Number(reserveIn);

        return BigInt(Math.floor(Number(receive) * (1 + liquidityPool.poolFeePercent / 100)));
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapFee: bigint = ((swapInAmount * BigInt(liquidityPool.poolFeePercent * 100)) + BigInt(10000) - 1n) / 10000n;
        const adjustedSwapInAmount: bigint = swapInAmount - swapFee;

        const estimatedReceive: number = Number(reserveOut) - (Number(reserveIn) * Number(reserveOut)) / (Number(reserveIn) + Number(adjustedSwapInAmount));

        return BigInt(Math.floor(estimatedReceive));
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const estimatedReceive: bigint = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);

        const oldPrice: number = Number(reserveIn) / Number(reserveOut);
        const swapPrice: number = Number(swapInAmount) / Number(estimatedReceive);

        return(swapPrice - oldPrice) / oldPrice * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: UTxO[] = []): Promise<PayToAddress[]> {
        const matchMakerFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee): boolean => fee.id === 'matchmakerFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee): boolean => fee.id === 'deposit');

        if (! matchMakerFee || ! deposit || ! swapParameters[DatumParameterKey.MinReceive]) {
            return Promise.reject('Parameters for datum are not set.');
        }

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.TotalFees]: matchMakerFee.value + deposit.value,
            [DatumParameterKey.AllowPartialFill]: 1,
        };

        // Asset -> ADA swap
        if (! swapParameters[DatumParameterKey.SwapOutTokenPolicyId]) {
            (swapParameters[DatumParameterKey.MinReceive] as bigint) -= matchMakerFee.value;
        }

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order)
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: this.orderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: matchMakerFee.value + deposit.value,
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
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO): boolean => {
            return utxo.address === this.orderAddress;
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
                spendUtxos: [relevantUtxo],
            }
        ];
    }

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'matchmakerFee',
                title: 'Matchmaker Fee',
                description: 'Fee to cover costs for the order matchmakers.',
                value: 950000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 1_700000n,
                isReturned: true,
            },
        ];
    }

}
