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
import pool from '@dex/definitions/splash/pool';
import order from '@dex/definitions/splash/order';
import { bytesToHex, correspondingReserves, hexToBytes, lucidUtils, tokensMatch } from '@app/utils';
import { AddressDetails, Script } from 'lucid-cardano';
import { Uint64BE } from 'int64-buffer';
import blake2b from 'blake2b';
import { SplashApi } from '@dex/api/splash-api';

const MAX_INT: bigint = 9_223_372_036_854_775_807n;
const EXECUTOR_FEE: bigint = 1100000n;
const WORST_ORDER_STEP_COST: bigint = 900000n;

export class Splash extends BaseDex {

    public static readonly identifier: string = 'Splash';
    readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly cancelDatum: string = 'd87980';
    public readonly orderScriptHash: string = '464eeee89f05aff787d40045af2a40a83fd96c513197d32fbc54ff02';
    public readonly batcherKey: string = '5cb2c968e5d1c7197a6ce7615967310a375545d9bc65063a964335b2';
    public readonly orderScript: Script = {
        type: 'PlutusV2',
        script: '59042d01000033232323232323222323232232253330093232533300b0041323300100137566022602460246024602460246024601c6ea8008894ccc040004528099299980719baf00d300f301300214a226600600600260260022646464a66601c6014601e6ea80044c94ccc03cc030c040dd5000899191929998090038a99980900108008a5014a066ebcc020c04cdd5001180b180b980b980b980b980b980b980b980b980b98099baa00f3375e600860246ea8c010c048dd5180a98091baa00230043012375400260286eb0c050c054c054c044dd50028b1991191980080080191299980a8008a60103d87a80001323253330143375e6016602c6ea80080144cdd2a40006603000497ae0133004004001301900230170013758600a60206ea8010c04cc040dd50008b180098079baa0052301230130013322323300100100322533301200114a0264a66602066e3cdd7180a8010020a5113300300300130150013758602060226022602260226022602260226022601a6ea8004dd71808180898089808980898089808980898089808980898069baa0093001300c37540044601e00229309b2b19299980598050008a999804180218048008a51153330083005300900114a02c2c6ea8004c8c94ccc01cc010c020dd50028991919191919191919191919191919191919191919191919299981118128010991919191924c646600200200c44a6660500022930991980180198160011bae302a0015333022301f30233754010264646464a666052605800426464931929998141812800899192999816981800109924c64a666056605000226464a66606060660042649318140008b181880098169baa0021533302b3027001132323232323253330343037002149858dd6981a800981a8011bad30330013033002375a6062002605a6ea800858c0acdd50008b181700098151baa0031533302830240011533302b302a37540062930b0b18141baa002302100316302a001302a0023028001302437540102ca666042603c60446ea802c4c8c8c8c94ccc0a0c0ac00852616375a605200260520046eb4c09c004c08cdd50058b180d006180c8098b1bac30230013023002375c60420026042004603e002603e0046eb4c074004c074008c06c004c06c008c064004c064008dd6980b800980b8011bad30150013015002375a60260026026004602200260220046eb8c03c004c03c008dd7180680098049baa0051625333007300430083754002264646464a66601c60220042930b1bae300f001300f002375c601a00260126ea8004588c94ccc01cc0100044c8c94ccc030c03c00852616375c601a00260126ea800854ccc01cc00c0044c8c94ccc030c03c00852616375c601a00260126ea800858c01cdd50009b8748008dc3a4000ae6955ceaab9e5573eae815d0aba24c0126d8799fd87a9f581c96f5c1bee23481335ff4aece32fe1dfa1aa40a944a66d2d6edc9a9a5ffff0001',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new SplashApi(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        return Promise.resolve([
            'addr1x94ec3t25egvhqy2n265xfhq882jxhkknurfe9ny4rl9k6dj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrst84slu',
            'addr1x8nz307k3sr60gu0e47cmajssy4fmld7u493a4xztjrll0aj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrswgxsta',
            'addr1x8xw6pmmy8jcnpss6sg7za9c5lk2v9nflq684vzxyn70unaj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrs4tm5z7',
            'addr1x8cq97k066w4rd37wprvd4qrfxctzlyd6a67us2uv6hnen9j764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrsgzvahe',
            'addr1xxcdveqw6g88w6cvwkf705xw30gflshu79ljc3ysrmmluadj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrscak26z',
            'addr1x8mql508pa9emlqfeh0g6lmlzfmauf55eq49zmta8ny7q04j764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrs08z9dt',
            'addr1xxw7upjedpkr4wq839wf983jsnq3yg40l4cskzd7dy8eyndj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrsgddq74',
            'addr1x8zjsd5fagcwpysv2zklwu69kkqfcpwfvtxpz8s0r5kmakaj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrszgx7ef',
            'addr1x92m92cttwgpllls5y4c889splwgujjyy0eccl424nlezm9j764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrswdesh2',
            'addr1xxg94wrfjcdsjncmsxtj0r87zk69e0jfl28n934sznu95tdj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrs2993lw',
            'addr1x9wnm7vle7al9q4aw63aw63wxz7aytnpc4h3gcjy0yufxwaj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrs84l0h4',
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
                && !assetName?.toLowerCase()?.endsWith('_lq');
        });

        // Irrelevant UTxO
        if (![2, 3].includes(relevantAssets.length)) {
            return Promise.resolve(undefined);
        }

        try {
            const builder: DefinitionBuilder = await new DefinitionBuilder().loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            const liquidityPool: LiquidityPool = new LiquidityPool(
                Splash.identifier,
                parameters.PoolAssetAPolicyId === ''
                    ? 'lovelace'
                    : new Asset(parameters.PoolAssetAPolicyId as string, parameters.PoolAssetAAssetName as string),
                new Asset(parameters.PoolAssetBPolicyId as string, parameters.PoolAssetBAssetName as string),
                BigInt(parameters.ReserveA as number),
                BigInt(parameters.ReserveB as number),
                utxo.address,
                '',
                '',
            );

            const [lpTokenPolicyId, lpTokenAssetName] = typeof parameters.LpTokenPolicyId === 'string' && typeof parameters.LpTokenAssetName === 'string'
                ? [parameters.LpTokenPolicyId, parameters.LpTokenAssetName]
                : [null, null];
            const lpTokenBalance: AssetBalance | undefined = utxo.assetBalances.find((assetBalance: AssetBalance) => {
                return assetBalance.asset !== 'lovelace'
                    && assetBalance.asset.policyId === lpTokenPolicyId
                    && assetBalance.asset.nameHex === lpTokenAssetName;
            });
            const nftToken: Asset | undefined = utxo.assetBalances.find((assetBalance) => {
                return (assetBalance.asset as Asset).assetName?.toLowerCase()?.endsWith('_nft');
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
            return undefined;
        }

        return undefined;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        return (reserveIn * reserveOut) / (reserveOut - swapOutAmount) - reserveIn;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        return reserveOut - (reserveIn * reserveOut) / (reserveIn + swapInAmount);
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const reserveIn: bigint = tokensMatch(swapInToken, liquidityPool.assetA)
            ? liquidityPool.reserveA
            : liquidityPool.reserveB;

        return (1 - (Number(reserveIn) / Number(reserveIn + swapInAmount))) * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = [], dataProvider?: BaseDataProvider): Promise<PayToAddress[]> {
        const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');
        const minReceive = swapParameters.MinReceive as bigint;

        if (! batcherFee || ! deposit || ! minReceive) {
            return Promise.reject('Parameters for datum are not set.');
        }
        if (! dataProvider) {
            return Promise.reject('Data provider is required.');
        }

        const walletUtxos: UTxO[] = await dataProvider.utxos(
            swapParameters[DatumParameterKey.Address] as string,
            swapParameters[DatumParameterKey.SwapInTokenPolicyId] !== ''
                ? new Asset(swapParameters.SwapInTokenPolicyId as string, swapParameters.SwapInTokenAssetName as string)
                : undefined
        );
        const firstUtxo: UTxO = walletUtxos[0];

        const decimalToFractionalImproved = (decimalValue: bigint | number): [bigint, bigint] => {
            const [whole, decimals = ''] = decimalValue.toString()?.split('.');
            let truncatedDecimals = decimals.slice(0, 15);
            const denominator: bigint = BigInt(10 ** truncatedDecimals.length);
            const numerator = BigInt(whole) * denominator + BigInt(decimals);
            return [numerator, denominator];
        }

        const swapOutToken: Token = swapParameters.SwapOutTokenPolicyId === 'lovelace'
            ? 'lovelace'
            : new Asset(swapParameters.SwapOutTokenPolicyId as string, swapParameters.SwapOutTokenAssetName as string);

        const outDecimals: number = swapOutToken === 'lovelace'
            ? 6
            : (tokensMatch(swapOutToken, liquidityPool.assetA)) ? (liquidityPool.assetA as Asset).decimals : (liquidityPool.assetB as Asset).decimals;
        const [numerator, denominator] = decimalToFractionalImproved(Number(minReceive) / 10**outDecimals);

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

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order).then((builder: DefinitionBuilder) => {
            builder.pushParameters(swapParameters);
        });

        const hash: string = blake2b(28).update(hexToBytes(datumBuilder.getCbor())).digest('hex');

        swapParameters.Beacon = this.getBeacon(firstUtxo, hash);

        await datumBuilder.loadDefinition(order).then((builder: DefinitionBuilder) => {
            builder.pushParameters(swapParameters);
        });

        return [
            this.buildSwapOrderPayment(swapParameters, {
                address: lucidUtils.credentialToAddress(
                    {
                        type: 'Script',
                        hash: this.orderScriptHash,
                    },
                    {
                        type: 'Key',
                        hash: swapParameters.SenderStakingKeyHash as string,
                    },
                ),
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

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
            const addressDetails: AddressDetails | undefined = lucidUtils.getAddressDetails(utxo.address);

            return (addressDetails.paymentCredential?.hash ?? '') === this.orderScriptHash;
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

    private getBeacon(utxo: UTxO, datumHash: string) {
        return blake2b(28).update(
            Uint8Array.from([
                ...hexToBytes(utxo.txHash),
                ...new Uint64BE(Number(utxo.outputIndex)).toArray(),
                ...new Uint64BE(0).toArray(),
                ...hexToBytes(datumHash),
            ])
        ).digest('hex');
    }
}
