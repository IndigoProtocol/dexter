import { BaseDex } from './base-dex';
import { DefinitionBuilder } from '../definition-builder';
import { correspondingReserves, tokensMatch } from '../utils';
import { AddressType, DatumParameterKey } from '../constants';
import order from './definitions/vyfinance/order';
/**
 * VyFinance constants.
 */
const SWAP_ACTION_EXPECT_ASSET = 3;
const SWAP_ACTION_EXPECT_ADA = 4;
export class VyFinance extends BaseDex {
    constructor() {
        super(...arguments);
        /**
         * On-Chain constants.
         */
        this.cancelDatum = 'd87a80';
        this.orderScript = {
            type: 'PlutusV1',
            script: '590a8c010000332323232322232322322323253353330093333573466e1cd55cea803a40004646424660020060046464646666ae68cdc3a800a40184642444444460020106eb4d5d09aab9e500323333573466e1d4009200a232122222223002008375a6ae84d55cf280211999ab9a3370ea00690041190911111118018041bad357426aae7940148cccd5cd19b875004480188c848888888c010020dd69aba135573ca00c46666ae68cdc3a802a400842444444400a46666ae68cdc3a8032400446424444444600c0106464646666ae68cdc39aab9d5002480008cc8848cc00400c008dd69aba15002375a6ae84d5d1280111931a99ab9c01d01c01b01a135573ca00226ea8004d5d09aab9e500823333573466e1d401d2000232122222223007008375a6ae84d55cf280491931a99ab9c01a019018017016015014013012011135573aa00226ea8004d5d09aba25008375c6ae85401c8c98d4cd5ce0078070068061999ab9a3370ea0089001109100111999ab9a3370ea00a9000109100091931a99ab9c01000f00e00d00c3333573466e1cd55cea8012400046644246600200600464646464646464646464646666ae68cdc39aab9d500a480008cccccccccc888888888848cccccccccc00402c02802402001c01801401000c008d5d0a80519a80b90009aba1500935742a0106ae85401cd5d0a8031aba1500535742a00866a02eeb8d5d0a8019aba15002357426ae8940088c98d4cd5ce00d80d00c80c09aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c8c8c8cccd5cd19b875001480188c848888c010014c8c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008301b35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008301c357426aae79402c8cccd5cd19b875007480008c848888888c014020c074d5d09aab9e500c23263533573804003e03c03a03803603403203002e26aae7540104d55cf280189aab9e5002135573ca00226ea8004d5d09aab9e500323333573466e1d400920042321222230020053011357426aae7940108cccd5cd19b875003480088c848888c004014c8c8c8cccd5cd19b8735573aa004900011991091980080180119191999ab9a3370e6aae75400520002375c6ae84d55cf280111931a99ab9c01c01b01a019137540026ae854008dd69aba135744a004464c6a66ae7006406005c0584d55cf280089baa001357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6a66ae7005805405004c0480440404d55cea80089baa001357426ae8940088c98d4cd5ce007807006806080689931a99ab9c4901035054350000d00c135573ca00226ea80044d55ce9baa001135573ca00226ea800448c88c008dd60009900099180080091191999aab9f0022122002233221223300100400330053574200660046ae8800c01cc0080088c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a8012400046424460040066464646666ae68cdc3a800a400446424460020066eb8d5d09aab9e500323333573466e1d400920002321223002003375c6ae84d55cf280211931a99ab9c00f00e00d00c00b135573aa00226ea8004d5d09aab9e500623263533573801401201000e00c26aae75400c4d5d1280089aab9e5001137540029309000a481035054310033232323322323232323232323232332223222253350021350012232350032222222222533533355301512001321233001225335002210031001002501e25335333573466e3c0300040540504d40800045407c00c84054404cd4c8c8d4cc8848cc00400c008ccdc624000030004a66a666ae68cdc7a800a4410000b00a150151350165001223355011002001133371802e02e0026a00a4400444004260086a6464646464a66a6666666ae900148cccd5cd19b8735573aa00a900011999aab9f500525019233335573ea00a4a03446666aae7d40149406c8cccd55cf9aba2500625335323232323333333574800846666ae68cdc39aab9d5004480008cccd55cfa8021281191999aab9f500425024233335573e6ae89401494cd4c088d5d0a80390a99a99a811119191919191999999aba400623333573466e1d40092002233335573ea00c4a05e46666aae7d4018940c08cccd55cfa8031281891999aab9f35744a00e4a66a605a6ae854028854cd4c0b8d5d0a80510a99a98179aba1500a21350361223330010050040031503415033150322503203303203103023333573466e1d400d2000233335573ea00e4a06046666aae7cd5d128041299a98171aba150092135033122300200315031250310320312502f02c02b2502d2502d2502d2502d02e135573aa00826ae8940044d5d1280089aab9e5001137540026ae85401c84d40a048cc00400c0085409854094940940980940909408807c940849408494084940840884d5d1280089aab9e5001137540026ae854024854cd4ccd54054070cd54054070060d5d0a80490a99a99a80d00e9aba150092135020123330010040030021501e1501d1501c2501c01d01c01b01a250180152501725017250172501701821001135626135744a00226ae8940044d55cf280089baa00135001223500222222222225335009132635335738921035054380001f01b22100222200232001355011225335001100422135002225335333573466e3c00801c02402040244c01800c488008488004c8004d5403488448894cd40044d400c88004884ccd401488008c010008ccd54c01c480040140100044488c88ccccccd5d2000aa8029299a98019bab002213500f0011500d55005550055500500e3200135500e223233335573e00446a01e2440044a66a600c6aae754008854cd4c018d55cf280190a99a98031aba200521350123212233001003004335500b003002150101500f1500e00f135742002224a0102244246600200600446666666ae900049401c9401c9401c8d4020dd6801128038040911919191999999aba400423333573466e1d40092000233335573ea0084a01846666aae7cd5d128029299a98049aba15006213500f3500f0011500d2500d00e00d23333573466e1d400d2002233335573ea00a46a01ca01a4a01a01c4a0180120104a0144a0144a0144a01401626aae7540084d55cf280089baa00123232323333333574800846666ae68cdc3a8012400446666aae7d4010940288cccd55cf9aba2500525335300a35742a00c426a01a24460020062a0164a01601801646666ae68cdc3a801a400046666aae7d40149402c8cccd55cf9aba2500625335300b35742a00e426a01c24460040062a0184a01801a0184a01400e00c4a0104a0104a0104a01001226aae7540084d55cf280089baa0014988ccccccd5d20009280192801928019280191a8021bae002004121223002003112200112001480e0448c8c00400488cc00cc00800800522011c',
        };
    }
    estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
        if (!liquidityPool.state)
            return 0n;
        const poolFeeMultiplier = 1000n;
        const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
        const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));
        const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
        const swapInNumerator = swapOutAmount * reserveIn * poolFeeMultiplier;
        const swapInDenominator = (reserveOut - swapOutAmount) * poolFeeModifier;
        return swapInNumerator / swapInDenominator + 1n;
    }
    estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
        if (!liquidityPool.state)
            return 0n;
        const poolFeeMultiplier = 1000n;
        const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
        const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));
        const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
        const swapOutNumerator = swapInAmount * reserveOut * poolFeeModifier;
        const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
        return swapOutNumerator / swapOutDenominator;
    }
    priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
        if (!liquidityPool.state)
            return 0;
        const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken).map((x) => Number(x));
        const estimatedReceive = Number(this.estimatedReceive(liquidityPool, swapInToken, swapInAmount));
        const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
        const swapFee = Number(swapInAmount) * poolFeePercent / 100;
        return (1 - estimatedReceive / ((Number(swapInAmount) - swapFee) * (reserveOut / reserveIn))) * 100;
    }
    async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
        const isDoubleSidedSwap = swapParameters.SwapInTokenPolicyId !== '' && swapParameters.SwapOutTokenPolicyId !== '';
        const swapDirection = swapParameters.SwapInTokenPolicyId === '' || isDoubleSidedSwap
            ? SWAP_ACTION_EXPECT_ASSET
            : SWAP_ACTION_EXPECT_ADA;
        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.Action]: swapDirection,
            [DatumParameterKey.SenderKeyHashes]: swapParameters.SenderPubKeyHash + swapParameters.SenderStakingKeyHash,
        };
        const datumBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order)
            .then((builder) => {
            builder.pushParameters(swapParameters);
        });
        return [
            this.buildSwapOrderPayment(swapParameters, {
                address: liquidityPool.orderAddress,
                addressType: AddressType.Contract,
                assetBalances: [
                    {
                        asset: 'lovelace',
                        quantity: this.swapOrderFees().reduce((feeAmount, fee) => feeAmount + fee.value, 0n),
                    },
                ],
                datum: datumBuilder.getCbor(),
                isInlineDatum: false,
                spendUtxos: spendUtxos,
            })
        ];
    }
    async buildCancelSwapOrder(txOutputs, returnAddress) {
        const relevantUtxo = txOutputs.find((utxo) => {
            return utxo.address !== returnAddress;
        });
        if (!relevantUtxo) {
            return Promise.reject('Unable to find relevant UTxO for cancelling the swap order.');
        }
        // const nft = this.dexter.dataProvider?.utxos()
        // todo
        // const pool: LiquidityPool | undefined = (await this.api.liquidityPools())
        //     .find((pool: LiquidityPool) => [pool.marketOrderAddress, pool.limitOrderAddress].includes(relevantUtxo.address));
        //
        // if (! pool) {
        //     return Promise.reject('Unable to find relevant liquidity pool for cancelling the swap order.');
        // }
        const script = this.orderScript;
        // script.script += `${pool.extra.nft.policyId}0001`;
        return [
            {
                address: returnAddress,
                addressType: AddressType.Base,
                assetBalances: relevantUtxo.assetBalances,
                isInlineDatum: false,
                spendUtxos: [{
                        utxo: relevantUtxo,
                        redeemer: this.cancelDatum,
                        validator: script,
                        signer: returnAddress,
                    }],
            }
        ];
    }
    swapOrderFees() {
        return [
            {
                id: 'processFee',
                title: 'Process Fee',
                description: 'Fee paid to the off-chain processor fulfilling order.',
                value: 1900000n,
                isReturned: false,
            },
            {
                id: 'minAda',
                title: 'MinADA',
                description: 'MinADA will be held in the UTxO and returned when the order is processed.',
                value: 2000000n,
                isReturned: true,
            },
        ];
    }
}
VyFinance.identifier = 'VyFinance';
