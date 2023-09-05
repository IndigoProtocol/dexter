import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import { AssetAddress, AssetBalance, DatumParameters, DefinitionConstr, DefinitionField, PayToAddress, RequestConfig, SwapFee, UTxO } from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import { BaseApi } from '@dex/api/base-api';
import { Script } from 'lucid-cardano';
import pool from './definitions/spectrum/pool';
import order from './definitions/spectrum/order';
import { all, bignumber, BigNumber, ConfigOptions, create, FormatOptions, MathJsStatic } from 'mathjs';

export class Spectrum extends BaseDex {
  public static readonly identifier: string = 'Spectrum';
  public readonly api: BaseApi;

  /**
   * On-Chain constants.
   */
  public readonly orderAddress: string = 'addr1wynp362vmvr8jtc946d3a3utqgclfdl5y9d3kn849e359hsskr20n';
  public readonly poolAddress: string = 'addr1x8nz307k3sr60gu0e47cmajssy4fmld7u493a4xztjrll0aj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrswgxsta';

  constructor(requestConfig: RequestConfig = {}) {
    super();
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
    ).then((liquidityPools: (LiquidityPool | undefined)[]) => {
      return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
        return liquidityPool !== undefined;
      }) as LiquidityPool[];
    });
  }

  public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
    if (!utxo.datumHash) {
      return Promise.resolve(undefined);
    }

    const relevantAssets = utxo.assetBalances.filter((assetBalance) => {
      // const assetBalanceId = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();
      const assetName = (assetBalance.asset as Asset).assetName;
      return !assetName?.toLowerCase()?.endsWith('_nft') && !assetName?.toLowerCase()?.endsWith('_lq');
    });

    // Irrelevant UTxO
    if (![2, 3].includes(relevantAssets.length)) {
      return Promise.resolve(undefined);
    }

    // Could be ADA/X or X/X pool
    const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
    const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

    const liquidityPool: LiquidityPool = new LiquidityPool(Spectrum.identifier, relevantAssets[assetAIndex].asset, relevantAssets[assetBIndex].asset, relevantAssets[assetAIndex].quantity, relevantAssets[assetBIndex].quantity, utxo.address, this.orderAddress, this.orderAddress);

    // Load additional pool information
    const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
      const assetName = (assetBalance.asset as Asset).assetName;
      return assetName?.toLowerCase()?.endsWith('_nft');
    })?.asset as Asset;

    if (lpToken) {
      lpToken.nameHex = lpToken.nameHex;
      liquidityPool.lpToken = lpToken;
    }

    try {
      const builder: DefinitionBuilder = await new DefinitionBuilder().loadDefinition(pool);
      const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
      const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

      liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string' ? parameters.PoolIdentifier : '';
      liquidityPool.poolFeePercent = typeof parameters.LpFee === 'number' ? (1000 - parameters.LpFee) / 10 : 0.3;
    } catch (e) {
      return liquidityPool;
    }
    return liquidityPool;
  }

  estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
    return 0n;
  }

  public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
    return 2n;
  }

  public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
    return 0;
  }

  public buildCancelSwapOrder(): [redeemer: string] {
    throw new Error('Method not implemented.');
  }

  public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: UTxO[] = []): Promise<PayToAddress[]> {
    const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
    const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');
    const minReceive = swapParameters.MinReceive as bigint;

    if (!batcherFee || !deposit || !minReceive) {
      return Promise.reject('Parameters for datum are not set.');
    }

    const batcherFeeForToken = Number(batcherFee.value) / Number(minReceive);
    const number = bignumber(batcherFeeForToken.toString());
    const [numerator, denominator] = decimalToFractional(number);

    const lpfee = 1000 - liquidityPool.poolFeePercent * 10;

    swapParameters = {
      ...swapParameters,
      [DatumParameterKey.TokenPolicyId]: liquidityPool.lpToken.policyId,
      [DatumParameterKey.TokenAssetName]: liquidityPool.lpToken.nameHex,
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
        spendUtxos: spendUtxos,
      }),
    ];
  }

  public swapOrderFees(): SwapFee[] {
    const networkFee = 0.5; // 0.5 ADA
    const reward = 1; // 1 ADA.
    const minNitro = 1.2;
    const batcherFee = (reward + networkFee) * minNitro;
    const batcherFeeInAda = BigInt(Math.round(batcherFee * 10 ** 6));
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

const mathConf: ConfigOptions = {
  epsilon: 1e-24,
  matrix: 'Matrix',
  number: 'BigNumber',
  precision: 64,
};

const formatOptions: FormatOptions = {
  notation: 'fixed',
};

export const math = create(all, mathConf) as Partial<MathJsStatic>;

function evaluate(expr: string): string {
  return math.format!(math.evaluate!(expr), formatOptions);
}

function decimalToFractional(n: BigNumber | number): [bigint, bigint] {
  const fmtN = math.format!(n, formatOptions);
  const [whole, decimals = ''] = String(fmtN).split('.');
  const numDecimals = decimals.length;
  const denominator = BigInt(evaluate(`10^${numDecimals}`));
  const numerator = BigInt(whole) * denominator + BigInt(decimals);
  return [numerator, denominator];
}

// WIP to remove the mathjs dependency & configuration logic.
function decimalToFractionalImproved(decimalValue: bigint | number): [bigint, bigint] {
  const [whole, decimals = ''] = decimalValue.toString()?.split('.');
  let truncatedDecimals = decimals.slice(0, 15);
  const denominator = 10n ** BigInt(truncatedDecimals.length);
  const numerator = BigInt(whole + truncatedDecimals);
  return [numerator, denominator];
}
