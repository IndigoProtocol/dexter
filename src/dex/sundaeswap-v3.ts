import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Token } from './models/asset';
import { BaseDex } from './base-dex';
import {
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    RequestConfig, SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import pool from '@dex/definitions/sundaeswap-v1/pool';
import order from '@dex/definitions/sundaeswap-v1/order';
import { BaseApi } from '@dex/api/base-api';
import { Script } from 'lucid-cardano';
import { SundaeSwapV3Api } from '@dex/api/sundaeswap-v3-api';

export class SundaeSwapV3 extends BaseDex {

    public static readonly identifier: string = 'SundaeSwapV3';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    // TODO - update for mainnet
    public readonly orderAddress: string = 'addr_test1zpyyj6wexm6gf3zlzs7ez8upvdh7jfgy3cs9qj8wrljp925y2usavetr7qg4zg6cc8kqup4veczmfykgquw2kmmuhs5qkzsen3';
    public readonly poolAddress: string = 'addr_test1wzq5p39cjs50cfjwjzcscuw98fxrl8899dnkhuwek50tnjs09luug';
    public readonly lpTokenPolicyId: string = '4086577ed57c514f8e29b78f42ef4f379363355a3b65b9a032ee30c9';
    public readonly validityTokenPolicyId: string = '8140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '59081f010000332323232323232322322223253330093232533300b3370e90010010991919991119198008008021119299980999b87480000044c8c8cc00400401c894ccc06400452809919299980c19b8f00200514a226600800800260380046eb8c068004dd7180b98088010a99980999b87480080044c8c8c8cc004004008894ccc06800452889919299980c998048048010998020020008a50301d002301b0013758603000260220042a66602666e1d200400113232323300100100222533301a00114a026464a6660326601201200429444cc010010004c074008c06c004dd6180c00098088010a99980999b87480180044c8c8c8c8cdc48019919980080080124000444a66603a00420022666006006603e00464a66603666016016002266e0000920021002301e0023758603400260340046eb4c060004c04400854ccc04ccdc3a4010002264646464a66602e66e1d20020011323253330193370e9001180d1baa300d3017300d301700a13371200200a266e20004014dd6980e000980a8010a503015001300b301330093013006375a60300026022004264646464a66602e66e1d20020011323253330193370e9001180d1baa300d3017300f301700a13371200a002266e20014004dd6980e000980a8010a503015001300b3013300b3013006375a603000260220046022002600260160106eb0c044c048c048c048c048c048c048c048c048c02cc00cc02c018c044c048c048c048c048c048c048c048c02cc00cc02c0188c044c048004c8c8c8c8c94ccc040cdc3a40000022646464646464646464646464a66603e60420042646464649319299981019b87480000044c8c94ccc094c09c00852616375c604a002603c00e2a66604066e1d20020011323232325333027302900213232498c8c8c8c8c94ccc0b4c0bc00852616375a605a002605a0046eb8c0ac004c0ac00cdd718148011919191919299981618170010a4c2c6eb4c0b0004c0b0008dd7181500098150021bae3028003163758604e002604e0046eb0c094004c07801c54ccc080cdc3a400800226464a66604a604e004264931919191919191919299981698178010a4c2c6eb4c0b4004c0b4008dd7181580098158019bae30290023232323232533302c302e002149858dd6981600098160011bae302a001302a003375c60500046eb0c094008dd618118008b1919bb03026001302630270013758604a002603c00e2a66604066e1d20060011323253330253027002132498c8c8c8c8c94ccc0a8c0b000852616375a605400260540046eb8c0a0004c0a0008dd718130008b1bac3025001301e007153330203370e9004000899192999812981380109924c6464646464646464a66605a605e0042930b1bad302d001302d002375c605600260560066eb8c0a4008c8c8c8c8c94ccc0b0c0b800852616375a605800260580046eb8c0a8004c0a800cdd718140011bac3025002375860460022c6466ec0c098004c098c09c004dd61812800980f0038b180f00319299980f99b87480000044c8c8c8c94ccc098c0a00084c8c9263253330253370e90000008a99981418118018a4c2c2a66604a66e1d200200113232533302a302c002149858dd7181500098118018a99981299b87480100044c8c94ccc0a8c0b000852616302a00130230031630230023253330243370e9000000899191919299981598168010991924c64a66605466e1d200000113232533302f3031002132498c94ccc0b4cdc3a400000226464a66606460680042649318120008b181900098158010a99981699b87480080044c8c8c8c8c8c94ccc0d8c0e000852616375a606c002606c0046eb4c0d0004c0d0008dd6981900098158010b18158008b181780098140018a99981519b874800800454ccc0b4c0a000c52616163028002301d00316302b001302b0023029001302200416302200316302600130260023024001301d00816301d007300f00a32533301d3370e900000089919299981118120010a4c2c6eb8c088004c06c03054ccc074cdc3a40040022a66604060360182930b0b180d8058b180f800980f801180e800980e801180d800980d8011bad30190013019002301700130170023015001300e00b16300e00a3001001223253330103370e900000089919299980a980b8010a4c2c6eb8c054004c03800854ccc040cdc3a400400226464a66602a602e00426493198030009198030030008b1bac3015001300e002153330103370e900200089919299980a980b80109924c6600c00246600c00c0022c6eb0c054004c03800854ccc040cdc3a400c002264646464a66602e603200426493198040009198040040008b1bac30170013017002375a602a002601c0042a66602066e1d20080011323253330153017002149858dd6980a80098070010a99980819b87480280044c8c94ccc054c05c00852616375a602a002601c0042c601c00244646600200200644a66602600229309919801801980b0011801980a000919299980699b87480000044c8c94ccc048c05000852616375c602400260160042a66601a66e1d20020011323253330123014002149858dd7180900098058010b1805800899192999808180900109919299980799b8748000c0380084c8c94ccc044cdc3a40046020002266e3cdd7180a9807800806801980a00098068010008a50300e0011630100013756601e6020602060206020602060206012600260120084601e002601000629309b2b19299980499b874800000454ccc030c01c00c52616153330093370e90010008a99980618038018a4c2c2c600e0046eb80048c014dd5000918019baa0015734aae7555cf2ab9f5742ae893011e581c6ed8ba08a3a0ab1cdc63079fb057f84ff43f87dc4792f6f09b94e8030001',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new SundaeSwapV3Api(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.resolve([this.poolAddress]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(this.poolAddress);

        return await Promise.all(
            utxos.map(async (utxo: UTxO) => {
                return await this.liquidityPoolFromUtxo(provider, utxo);
            })
        )
        .then((liquidityPools: (LiquidityPool | undefined)[]) => {
            return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                return liquidityPool !== undefined;
            }) as LiquidityPool[];
        });
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (! utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier();

            return ! assetBalanceId.startsWith(this.validityTokenPolicyId);
        });

        // Irrelevant UTxO
        if (relevantAssets.length !== 2) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwapV3.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress,
        );

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            // TODO - can we grab the LP token?
            liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string'
                ? parameters.PoolIdentifier
                : '';
            liquidityPool.poolFeePercent = typeof parameters.OpeningFee === 'number'
                ? (parameters.OpeningFee / 10_000) * 100
                : 0;
            liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                ? BigInt(parameters.TotalLpTokens)
                : 0n;
        } catch (e) {
            return liquidityPool;
        }

        return liquidityPool;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const receive: bigint = (reserveIn * reserveOut) / (reserveOut - swapOutAmount) - reserveIn;
        const swapFee: bigint = ((receive * BigInt(Math.floor(liquidityPool.poolFeePercent * 100))) + BigInt(10000) - 1n) / 10000n;

        return receive + swapFee;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapFee: bigint = ((swapInAmount * BigInt(Math.floor(liquidityPool.poolFeePercent * 100))) + BigInt(10000) - 1n) / 10000n;

        return reserveOut - (reserveIn * reserveOut) / (reserveIn + swapInAmount - swapFee);
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const reserveIn: bigint = tokensMatch(swapInToken, liquidityPool.assetA)
            ? liquidityPool.reserveA
            : liquidityPool.reserveB;

        return (1 - (Number(reserveIn) / Number(reserveIn + swapInAmount))) * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = []): Promise<PayToAddress[]> {
        // TODO
        const scooperFee: SwapFee | undefined = this.swapOrderFees(liquidityPool).find((fee: SwapFee) => fee.id === 'scooperFee');
        const deposit: SwapFee | undefined = this.swapOrderFees(liquidityPool).find((fee: SwapFee) => fee.id === 'deposit');

        if (! scooperFee || ! deposit) {
            return Promise.reject('Parameters for datum are not set.');
        }

        const swapInToken: string = (swapParameters.SwapInTokenPolicyId as string) + (swapParameters.SwapInTokenAssetName as string);
        const swapOutToken: string = (swapParameters.SwapOutTokenPolicyId as string) + (swapParameters.SwapOutTokenAssetName as string);
        const swapDirection: number = [swapInToken, swapOutToken].sort((a: string, b: string) => {
            return a.localeCompare(b);
        })[0] === swapInToken ? 0 : 1;

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.ScooperFee]: scooperFee.value,
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
                    address: this.orderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: scooperFee.value + deposit.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                    isInlineDatum: true,
                    spendUtxos: spendUtxos,
                }
            )
        ];
    }

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
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
                spendUtxos: [{
                    utxo: relevantUtxo,
                    redeemer: this.cancelDatum,
                    validator: this.orderScript,
                    signer: returnAddress,
                }],
            }
        ];
    }

    public swapOrderFees(liquidityPool: LiquidityPool): SwapFee[] {
        return [
            {
                id: 'protocolFee',
                title: 'Sundae Protocol Fee',
                description: 'Sundae Protocol Fee',
                value: liquidityPool.extra.protocolFee ?? 2_500000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'A small ADA deposit that you will get back when your order is processed or cancelled.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}
