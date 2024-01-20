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
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import pool from '@dex/definitions/sundaeswap/pool';
import order from '@dex/definitions/sundaeswap/order';
import { BaseApi } from '@dex/api/base-api';
import { SundaeSwapApi } from '@dex/api/sundaeswap-api';
import { Script } from 'lucid-cardano';

export class SundaeSwap extends BaseDex {

    public static readonly identifier: string = 'SundaeSwap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8';
    public readonly poolAddress: string = 'addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu';
    public readonly lpTokenPolicyId: string = '0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b913';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '59084601000033233322232332232333222323332223322323332223233223233223332223333222233322233223322332233223332223322332233322232323232322222325335300b001103c13503d35303b3357389201035054350003c498ccc888c8c8c94cd4c05c0144d4c0680188888cd4c04c480048d4c0ed40188888888888cd4c078480048ccd5cd19b8f375c0020180440420066a6040006446a6048004446a605000444666aa60302400244a66a6a07c0044266a08c0020042002a0886466a002a088a08a2446600466a609000846a0820024a0806600400e00226a606ca002444444444466a6032240024646464666ae68cdc399991119191800802990009aa82c1119a9a826000a4000446a6aa08a00444a66a6050666ae68cdc78010048150148980380089803001990009aa82b9119a9a825800a4000446a6aa08800444a66a604e666ae68cdc7801003814814080089803001999aa81e3ae335503c75ceb4d4c084cccd5cd19b8735573aa006900011998119aba1500335742a00466a080eb8d5d09aba2500223505135304f33573892010350543100050499262220020183371491010270200035302801422220044800808007c4d5d1280089aab9e500113754002012264a66a6a070601a6aae78dd50008a81a910a99a9a81d0008a81b910a99a9a81e0008a81c910a99a9a81f0008a81d910a99a9a8200008a81e910a99a9a8210008a81f910a99a9a8220008a820910a99a9a8230008a821910a99a9a8240008a822910a99a9a8250008a823910a99a9a82600089999999999825981000a18100090080071810006181000500418100031810002001110a8259a980a1999ab9a3370e6aae754009200023301635742a0046ae84d5d1280111a8211a982019ab9c490103505431000414992622002135573ca00226ea8004cd40148c8c8c8c8cccd5cd19b8735573aa00890001199980d9bae35742a0086464646666ae68cdc39aab9d5002480008cc88cc08c008004c8c8c8cccd5cd19b8735573aa004900011991198148010009919191999ab9a3370e6aae754009200023302d304735742a00466a07a4646464646666ae68cdc3a800a4004466606a6eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d4009200023037304e357426aae7940188d4154d4c14ccd5ce2490350543100054499264984d55cea80189aba25001135573ca00226ea8004d5d09aba2500223504e35304c335738921035054310004d49926135573ca00226ea8004d5d0a80119a81cbae357426ae8940088d4128d4c120cd5ce249035054310004949926135573ca00226ea8004d5d0a80119a81abae357426ae8940088d4118d4c110cd5ce249035054310004549926135573ca00226ea8004d5d0a8019bad35742a00464646464646666ae68cdc3a800a40084605c646464646666ae68cdc3a800a40044606c6464646666ae68cdc39aab9d5002480008cc88cd40f8008004dd69aba15002375a6ae84d5d1280111a8289a982799ab9c491035054310005049926135573ca00226ea8004d5d09aab9e500423333573466e1d40092000233036304b35742a0086eb4d5d09aba2500423504e35304c335738921035054310004d499264984d55cea80109aab9e5001137540026ae84d55cf280291999ab9a3370ea0049001118169bad357426aae7940188cccd5cd19b875003480008ccc0bcc11cd5d0a8031bad35742a00a66a072eb4d5d09aba2500523504a353048335738920103505431000494992649926135573aa00626ae8940044d55cf280089baa001357426ae8940088d4108d4c100cd5ce249035054310004149926135744a00226ae8940044d55cf280089baa0010033350052323333573466e1d40052002201623333573466e1d40092000201623504035303e335738921035054310003f499264984d55ce9baa001002335005200100112001230023758002640026aa072446666aae7c004940c08cd40bcd5d080118019aba2002498c8004d540e088448894cd4d40bc0044008884cc014008ccd54c01c48004014010004c8004d540dc884894cd4d40b400440188854cd4c01cc01000840244cd4c01848004010004488008488004800488848ccc00401000c00880048848cc00400c00880044880084880048004888848cccc00401401000c00880048848cc00400c00880048848cc00400c00880048848cc00400c00880048488c00800c888488ccc00401401000c800484888c00c0108884888ccc00801801401084888c00401080048488c00800c88488cc00401000c800448848cc00400c008480044488c88c008dd5800990009aa80d11191999aab9f0022501223350113355008300635573aa004600a6aae794008c010d5d100180c09aba10011122123300100300211200112232323333573466e1d400520002350083005357426aae79400c8cccd5cd19b87500248008940208d405cd4c054cd5ce24810350543100016499264984d55cea80089baa00112122300200311220011200113500d35300b3357389211f556e6578706563746564205478496e666f20636f6e737472756374696f6e2e0000c498888888888848cccccccccc00402c02802402001c01801401000c00880044488008488488cc00401000c480048c8c8cccd5cd19b875001480088c018dd71aba135573ca00646666ae68cdc3a80124000460106eb8d5d09aab9e500423500c35300a3357389201035054310000b499264984d55cea80089baa001212230020032122300100320012323333573466e1d40052002200823333573466e1d40092000200a2350073530053357389210350543100006499264984d55ce9baa0011200120011261220021220012001112323001001223300330020020014891c0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b9130001',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new SundaeSwapApi(this, requestConfig);
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

            return ! assetBalanceId.startsWith(this.lpTokenPolicyId);
        });

        // Irrelevant UTxO
        if (! [2, 3].includes(relevantAssets.length)) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwap.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress,
        );

        // Load additional pool information
        const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === this.lpTokenPolicyId;
        })?.asset as Asset;

        if (lpToken) {
            lpToken.nameHex = '6c' + lpToken.nameHex;
            liquidityPool.lpToken = lpToken;
            liquidityPool.identifier = lpToken.identifier();
        }

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string'
                ? parameters.PoolIdentifier
                : '';
            liquidityPool.poolFeePercent = typeof parameters.LpFeeNumerator === 'number' && typeof parameters.LpFeeDenominator === 'number'
                ? (parameters.LpFeeNumerator / parameters.LpFeeDenominator) * 100
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
        const scooperFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'scooperFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

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
                    isInlineDatum: false,
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

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'scooperFee',
                title: 'Scooper Processing Fee',
                description: 'An ADA fee paid to the Sundae Scooper Network for processing your order.',
                value: 2_500000n,
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
