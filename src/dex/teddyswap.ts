import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
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
import { AddressType, DatumParameterKey } from '@app/constants';
import { BaseApi } from '@dex/api/base-api';
import pool from './definitions/teddyswap/pool';
import order from './definitions/teddyswap/order';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { TeddyswapApi } from '@dex/api/teddyswap-api';
import { Script } from 'lucid-cardano';

const MAX_INT: bigint = 9_223_372_036_854_775_807n;

export class TeddySwap extends BaseDex {

    public static readonly identifier: string = 'TeddySwap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1z99tz7hungv6furtdl3zn72sree86wtghlcr4jc637r2eadkp2avt5gp297dnxhxcmy6kkptepsr5pa409qa7gf8stzs0706a3';
    public readonly cancelDatum: string = 'd8799f00000001ff';
    public readonly orderScript: Script = {
        type: 'PlutusV2',
        script: '5905090100003232323232323232323232323232323232323232323222253330153232323232323232323232323232323232323232323232323232323253330313370e90010010991919299812a99981a19b8753330343370e6eb4c0d4c0d803d2000148000520024800054cc094cdc399815005181a80e240042a6604a664466ebcdd3981c8011ba730390013035004303500815330253370e666066444a666062002200426600666e00009200230390014800004d20041533025337126eb4c0d4c0d805800854cc0940044cccc8888cdc499b833370466e08cc0b803800c008004cdc019b823302e00e004483403ccdc100100099b8000648008c0d4078c0d4074dd6981a80b1bad303501b13322332303622533303300114a02a66607266ebcc0e800400c52889801181d8009ba90010023758606a64606e606e606e606e606e002606c0286eb8c0d40604cdc3811811a9991981a0008a513232325330273371e6eb8c0dcc0e0008dd7181b981c000899b8f375c606e0046eb8c0dc004c0e00a0c0dc004c0d00704ccccc88888c8c8cdc499b8133702605401a6eb4004cdc199b82005004003302a0135333039323253302c3371e6eb8c0f0c0f4008dd7181e181e800899b8f375c60780046eb8c0f0004c0f40b4c0f00184dd400288009ba848000c0d0074dd6981a00a8009bad3034019375a6068030a666064646464a6604c66e3cdd7181b181b8011bae3036303700113371e6eb8c0d8008dd7181b000981b813981b000981980d899b83337040026eb4c0cc05ccdc09bad3033017375a6066030200266e04cc09c028c0c8068cc09c010c0c806858c0d0008c0ac004dd51817981800c9bab32302f30303031001302e302f001302f00133028375a605800e0146eacc8c0b0c0b4c0b8004c0acc0b0004c0b0004cc094dd6981480280399911919192999816191919299981799b87480080084c8c8c94ccc0c8cdc3a400000429404cdd79ba7004374e002606a00460580026ea801c4c8c8c94ccc0c8cdc3a400400429404cdd79ba7004374e002606a00460580026ea801cc0c8008c0a4004dd500088010b1919191919299981819b87480000084c8c8c8c94ccc0d0cdc3a4000004264646464a66607066e1d20020021613374a9000000981d80118190009baa0013035001163037002302e00137540026062002266e95200202b3033002302a0013754002605a605c605e0026058605c00a6eacc8c8c94ccc0b4cdc3a40040042c2a66605a66e3cdd7181700080309817181798180038b181800118138009baa00132302b302d001302a302c003375c60500166050014660466eb4c09c004010c09c004c098004c098040dd618118011bac3022002302230220013022302000a3020001301f001301e001301d001301c001301b001301a00130190013019004301800114985920aca597c9282533300b0011480004ccc044cdd7980698090009ba9006375a602a60246eacc054c04800520002233301100200100314a066e952000330013752004660026ea40080215d0245002232333004003375c601c0026eb8c038c03c004c03c004888cccc01000920002333300500248001d69bab00100323002375200244446601444a66600e002200a2a66601a66ebcc024c0380040184c010c044c0380044c008c03c00400555cfa5eb8155ce91299980299b8800248000584cc00c008004c0048894ccc014cdc3801240002600c00226600666e04009200230070012323002233002002001230022330020020015734ae855d1118011baa0015573c1',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new TeddyswapApi(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.resolve([
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zp5hu6t748dfdd6cxlxxssyqez4wqwcrq44crfgkltqh2cqcwcjyr',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zqgdzhkv23nm3v7tanurzu8v5vll365n7hq8f26937hatlqnv5cpz',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8z8rxrld450e6c360mu72ru7u8zz0602px3esxykcx87f9ns2tytsd',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zz6mve63ntrqp7yxgkk395rngtzdmzdjzzuzdkdks0afwqsmdsegq',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zr0vp2360e2j2gve54sxsheawjd6s6we2d25xl96a3r0jdqzvyqkl',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zzlsgmhduch9juwcjf6vjqeht0jv2g2mlz86wqh42h8akdqglnguu',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zxk96389hhwyhv0t07gh89wqnaqg9cqkwsz4esd9sm562rs55tl66',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8z9re630pc4dzmhtku8276tyq0glgn53h93vw5rl9e6w4g8su86xvk',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zpczswng09euafg44jclrg5tm7xg260qzyavu9dysz8g3js7pzqla',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8z92v2k4gz85r5rq035n2llzemqvcz70h7hdr3njur05y6nsmrsjpe',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zxn5qy8sn2d7wtdtvjcsv7v0h7u9zsleljxv3nschr5sj3sla73t7',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zzw03em2wpuy6t66rx4hqmggelr8r2whwru8uuptxzwdlfsss26rc',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zphr7r6v67asj5jc5w5uapfapv0u9433m3v9aag9w46spaqc60ygw',
            'addr1zy5th50h46anh3v7zdvh7ve6amac7k4h3mdfvt0p6czm8zrlxa5g3cwp6thfvzwhd9s4vcjjdwttsss65l09dum7g9rs0mr8px',
        ]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const poolAddresses: string[] = await this.liquidityPoolAddresses(provider);

        const addressPromises: Promise<LiquidityPool[]>[] = poolAddresses.map(async (address: string) => {
            const utxos: UTxO[] = await provider.utxos(address);

            return await Promise.all(
                utxos.map(async (utxo: UTxO) => {
                    return await this.liquidityPoolFromUtxo(provider, utxo);
                })
            ).then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[];
            });

        });

        return Promise.all(addressPromises).then((liquidityPools: Awaited<LiquidityPool[]>[]) => liquidityPools.flat());
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (!utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const relevantAssets = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetName = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.assetName;
            return !assetName?.toLowerCase()?.endsWith('_nft')
                && !assetName?.toLowerCase()?.endsWith('_identity')
                && !assetName?.toLowerCase()?.endsWith('_lp');
        });

        // Irrelevant UTxO
        if (![2, 3].includes(relevantAssets.length)) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            TeddySwap.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress
        );

        try {
            const builder: DefinitionBuilder = await new DefinitionBuilder().loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            const [lpTokenPolicyId, lpTokenAssetName] = typeof parameters.LpTokenPolicyId === 'string' && typeof parameters.LpTokenAssetName === 'string'
                ? [parameters.LpTokenPolicyId, parameters.LpTokenAssetName]
                : [null, null];
            const lpTokenBalance: AssetBalance | undefined = utxo.assetBalances.find((assetBalance: AssetBalance) => {
                return assetBalance.asset !== 'lovelace'
                    && assetBalance.asset.policyId === lpTokenPolicyId
                    && assetBalance.asset.nameHex === lpTokenAssetName;
            });const nftToken: Asset | undefined = utxo.assetBalances.find((assetBalance) => {
                return (assetBalance.asset as Asset).assetName?.toLowerCase()?.endsWith('_identity');
            })?.asset as Asset | undefined;

            if (! lpTokenBalance || ! nftToken) {
                return Promise.resolve(undefined);
            }

            liquidityPool.poolNft = nftToken;
            liquidityPool.lpToken = lpTokenBalance.asset as Asset;
            liquidityPool.totalLpTokens = MAX_INT - lpTokenBalance.quantity;
            liquidityPool.identifier = liquidityPool.lpToken.identifier();
            liquidityPool.poolFeePercent = typeof parameters.LpFee === 'number' ? (1000 - parameters.LpFee) / 10 : 0.3;
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
        const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');
        const minReceive = swapParameters.MinReceive as bigint;

        if (!batcherFee || !deposit || !minReceive) {
            return Promise.reject('Parameters for datum are not set.');
        }
        if (! liquidityPool.poolNft) {
            return Promise.reject('Pool NFT is required.');
        }

        const decimalToFractionalImproved = (decimalValue: bigint | number): [bigint, bigint] => {
            const [whole, decimals = ''] = decimalValue.toString()?.split('.');
            let truncatedDecimals = decimals.slice(0, 15);
            const denominator: bigint = BigInt(10 ** truncatedDecimals.length);
            const numerator = BigInt(whole) * denominator + BigInt(decimals);
            return [numerator, denominator];
        }

        const batcherFeeForToken = Number(batcherFee.value) / Number(minReceive);
        const [numerator, denominator] = decimalToFractionalImproved(batcherFeeForToken);
        const lpfee: bigint = BigInt(1000 - Math.floor(liquidityPool.poolFeePercent * 10));

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.TokenPolicyId]: liquidityPool.poolNft.policyId,
            [DatumParameterKey.TokenAssetName]: liquidityPool.poolNft.nameHex,
            [DatumParameterKey.LpFee]: lpfee,
            [DatumParameterKey.LpFeeNumerator]: numerator,
            [DatumParameterKey.LpFeeDenominator]: denominator,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order).then((builder: DefinitionBuilder) => {
            builder.pushParameters(swapParameters);
        });

        return [
            this.buildSwapOrderPayment(swapParameters, {
                address: this.orderAddress,
                addressType: AddressType.Contract,
                assetBalances: [
                    {
                        asset: 'lovelace',
                        quantity: batcherFee?.value + deposit.value,
                    },
                ],
                datum: datumBuilder.getCbor(),
                isInlineDatum: true,
                spendUtxos: spendUtxos,
            }),
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

    public swapOrderFees(): SwapFee[] {
        const networkFee: number = 0.5;
        const reward: number = 1;
        const minNitro: number = 1.2;
        const batcherFee: number = (reward + networkFee) * minNitro;
        const batcherFeeInAda: bigint = BigInt(Math.round(batcherFee * 10 ** 6));

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
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }
}
