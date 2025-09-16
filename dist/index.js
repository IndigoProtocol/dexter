// src/constants.ts
var MetadataKey = /* @__PURE__ */ ((MetadataKey3) => {
  MetadataKey3[MetadataKey3["Message"] = 674] = "Message";
  return MetadataKey3;
})(MetadataKey || {});
var DatumParameterKey = /* @__PURE__ */ ((DatumParameterKey2) => {
  DatumParameterKey2["Action"] = "Action";
  DatumParameterKey2["TokenPolicyId"] = "TokenPolicyId";
  DatumParameterKey2["TokenAssetName"] = "TokenAssetName";
  DatumParameterKey2["ReserveA"] = "ReserveA";
  DatumParameterKey2["ReserveB"] = "ReserveB";
  DatumParameterKey2["CancelDatum"] = "CancelDatum";
  DatumParameterKey2["AScale"] = "AScale";
  DatumParameterKey2["BScale"] = "BScale";
  DatumParameterKey2["Address"] = "Address";
  DatumParameterKey2["SenderPubKeyHash"] = "SenderPubKeyHash";
  DatumParameterKey2["SenderStakingKeyHash"] = "SenderStakingKeyHash";
  DatumParameterKey2["SenderKeyHashes"] = "SenderKeyHashes";
  DatumParameterKey2["ReceiverPubKeyHash"] = "ReceiverPubKeyHash";
  DatumParameterKey2["ReceiverStakingKeyHash"] = "ReceiverStakingKeyHash";
  DatumParameterKey2["ReceiverDatum"] = "ReceiverDatum";
  DatumParameterKey2["ReceiverDatumType"] = "ReceiverDatumType";
  DatumParameterKey2["SwapInAmount"] = "SwapInAmount";
  DatumParameterKey2["SwapInTokenPolicyId"] = "SwapInTokenPolicyId";
  DatumParameterKey2["SwapInTokenAssetName"] = "SwapInTokenAssetName";
  DatumParameterKey2["SwapOutTokenPolicyId"] = "SwapOutTokenPolicyId";
  DatumParameterKey2["SwapOutTokenAssetName"] = "SwapOutTokenAssetName";
  DatumParameterKey2["SwapAdditionalAdaOnOrder"] = "SwapAdditionalAdaOnOrder";
  DatumParameterKey2["MinReceive"] = "MinReceive";
  DatumParameterKey2["Expiration"] = "Expiration";
  DatumParameterKey2["AllowPartialFill"] = "AllowPartialFill";
  DatumParameterKey2["Direction"] = "Direction";
  DatumParameterKey2["FeePaymentKeyHash"] = "FeePaymentKeyHash";
  DatumParameterKey2["Beacon"] = "Beacon";
  DatumParameterKey2["Batcher"] = "Batcher";
  DatumParameterKey2["InToken"] = "InToken";
  DatumParameterKey2["TotalFees"] = "TotalFees";
  DatumParameterKey2["BatcherFee"] = "BatcherFee";
  DatumParameterKey2["DepositFee"] = "DepositFee";
  DatumParameterKey2["ScooperFee"] = "ScooperFee";
  DatumParameterKey2["BaseFee"] = "BaseFee";
  DatumParameterKey2["ExecutionFee"] = "ExecutionFee";
  DatumParameterKey2["FeeSharingNumerator"] = "FeeSharingNumerator";
  DatumParameterKey2["OpeningFee"] = "OpeningFee";
  DatumParameterKey2["FinalFee"] = "FinalFee";
  DatumParameterKey2["FeesFinalized"] = "FeesFinalized";
  DatumParameterKey2["MarketOpen"] = "MarketOpen";
  DatumParameterKey2["ProtocolFee"] = "ProtocolFee";
  DatumParameterKey2["SwapFee"] = "SwapFee";
  DatumParameterKey2["ProjectFeeInBasis"] = "ProjectFeeInBasis";
  DatumParameterKey2["ReserveFeeInBasis"] = "ReserveFeeInBasis";
  DatumParameterKey2["FeeBasis"] = "FeeBasis";
  DatumParameterKey2["AgentFee"] = "AgentFee";
  DatumParameterKey2["PoolIdentifier"] = "PoolIdentifier";
  DatumParameterKey2["TotalLpTokens"] = "TotalLpTokens";
  DatumParameterKey2["LpTokenPolicyId"] = "LpTokenPolicyId";
  DatumParameterKey2["LpTokenAssetName"] = "LpTokenAssetName";
  DatumParameterKey2["LpFee"] = "LpFee";
  DatumParameterKey2["LpFeeNumerator"] = "LpFeeNumerator";
  DatumParameterKey2["LpFeeDenominator"] = "LpFeeDenominator";
  DatumParameterKey2["PoolAssetAPolicyId"] = "PoolAssetAPolicyId";
  DatumParameterKey2["PoolAssetAAssetName"] = "PoolAssetAAssetName";
  DatumParameterKey2["PoolAssetATreasury"] = "PoolAssetATreasury";
  DatumParameterKey2["PoolAssetABarFee"] = "PoolAssetABarFee";
  DatumParameterKey2["PoolAssetBPolicyId"] = "PoolAssetBPolicyId";
  DatumParameterKey2["PoolAssetBAssetName"] = "PoolAssetBAssetName";
  DatumParameterKey2["PoolAssetBTreasury"] = "PoolAssetBTreasury";
  DatumParameterKey2["PoolAssetBBarFee"] = "PoolAssetBBarFee";
  DatumParameterKey2["RootKLast"] = "RootKLast";
  DatumParameterKey2["LastInteraction"] = "LastInteraction";
  DatumParameterKey2["RequestScriptHash"] = "RequestScriptHash";
  DatumParameterKey2["StakeAdminPolicy"] = "StakeAdminPolicy";
  DatumParameterKey2["LqBound"] = "LqBound";
  DatumParameterKey2["Unknown"] = "Unknown";
  return DatumParameterKey2;
})(DatumParameterKey || {});
var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2[TransactionStatus2["Building"] = 0] = "Building";
  TransactionStatus2[TransactionStatus2["Signing"] = 1] = "Signing";
  TransactionStatus2[TransactionStatus2["Submitting"] = 2] = "Submitting";
  TransactionStatus2[TransactionStatus2["Submitted"] = 3] = "Submitted";
  TransactionStatus2[TransactionStatus2["Errored"] = 4] = "Errored";
  return TransactionStatus2;
})(TransactionStatus || {});
var AddressType = /* @__PURE__ */ ((AddressType2) => {
  AddressType2[AddressType2["Contract"] = 0] = "Contract";
  AddressType2[AddressType2["Base"] = 1] = "Base";
  AddressType2[AddressType2["Enterprise"] = 2] = "Enterprise";
  return AddressType2;
})(AddressType || {});

// src/utils.ts
import { C, fromHex, Lucid, toHex, Utils } from "lucid-cardano";
import { encoder } from "js-encoding-utils";
var lucidUtils = new Utils(new Lucid());
function tokensMatch(tokenA, tokenB) {
  const tokenAId = tokenA === "lovelace" ? "lovelace" : tokenA.identifier();
  const tokenBId = tokenB === "lovelace" ? "lovelace" : tokenB.identifier();
  return tokenAId === tokenBId;
}
function correspondingReserves(liquidityPool, token) {
  if (!liquidityPool.state) return [0n, 0n];
  return tokensMatch(token, liquidityPool.tokenA) ? [liquidityPool.state.reserveA, liquidityPool.state.reserveB] : [liquidityPool.state.reserveB, liquidityPool.state.reserveA];
}
function appendSlash(value) {
  if (!value) return "";
  if (value.endsWith("/")) return;
  return `${value}/`;
}
function datumJsonToCbor(json) {
  const convert = (json2) => {
    if (!isNaN(json2.int)) {
      return C.PlutusData.new_integer(C.BigInt.from_str(json2.int.toString()));
    } else if (json2.bytes || !isNaN(Number(json2.bytes))) {
      return C.PlutusData.new_bytes(fromHex(json2.bytes));
    } else if (json2.map) {
      const l = C.PlutusList.new();
      json2.forEach((v) => {
        l.add(convert(v));
      });
      return C.PlutusData.new_list(l);
    } else if (json2.list) {
      const l = C.PlutusList.new();
      json2.list.forEach((v) => {
        l.add(convert(v));
      });
      return C.PlutusData.new_list(l);
    } else if (!isNaN(json2.constructor)) {
      const l = C.PlutusList.new();
      json2.fields.forEach((v) => {
        l.add(convert(v));
      });
      return C.PlutusData.new_constr_plutus_data(
        C.ConstrPlutusData.new(
          C.BigNum.from_str(json2.constructor.toString()),
          l
        )
      );
    }
    throw new Error("Unsupported type");
  };
  return toHex(convert(json).to_bytes());
}
function determineAddressType(address) {
  const details = lucidUtils.getAddressDetails(address);
  if (details.type === "Enterprise") {
    return 2 /* Enterprise */;
  }
  return 1 /* Base */;
}
var bytesToHex = (bytes) => encoder.arrayBufferToHexString(bytes);
var hexToBytes = (hex) => encoder.hexStringToArrayBuffer(hex);
var formatDigits = (value, digits = 6) => Number(Number(value).toFixed(digits));

// src/dex/base-dex.ts
import { Asset } from "@indigo-labs/iris-sdk";
var BaseDex = class {
  constructor(dexter) {
    this.dexter = dexter;
  }
  /**
   * Adjust the payment for the DEX order address to include the swap in amount.
   */
  buildSwapOrderPayment(swapParameters, orderPayment) {
    const swapInAmount = swapParameters["SwapInAmount" /* SwapInAmount */];
    const swapInToken = swapParameters["SwapInTokenPolicyId" /* SwapInTokenPolicyId */] ? new Asset(
      swapParameters["SwapInTokenPolicyId" /* SwapInTokenPolicyId */],
      swapParameters["SwapInTokenAssetName" /* SwapInTokenAssetName */]
    ) : "lovelace";
    let assetBalance = orderPayment.assetBalances.find((payment) => {
      return tokensMatch(payment.asset, swapInToken);
    });
    if (!assetBalance) {
      orderPayment.assetBalances.push({
        asset: swapInToken,
        quantity: swapInAmount
      });
    } else {
      assetBalance.quantity += swapInAmount;
    }
    return orderPayment;
  }
};

// src/definition-builder.ts
import _ from "lodash";
var DefinitionBuilder = class {
  /**
   * Load a DEX definition file as a template for this builder.
   */
  async loadDefinition(definition) {
    this._definition = _.cloneDeepWith(definition, (value) => {
      if (value instanceof Function) {
        return value;
      }
    });
    return this;
  }
  /**
   * Push specified parameters to the definition template.
   */
  pushParameters(parameters) {
    if (!this._definition) {
      throw new Error(`Definition file must be loaded before applying parameters`);
    }
    this._definition = this.applyParameters(this._definition, parameters);
    return this;
  }
  /**
   * Pull parameters of a datum using a definition template.
   */
  pullParameters(definedDefinition) {
    if (!this._definition) {
      throw new Error(`Definition file must be loaded before pulling parameters`);
    }
    return this.extractParameters(definedDefinition, this._definition);
  }
  /**
   * Retrieve the CBOR for the builder.
   */
  getCbor() {
    return datumJsonToCbor(JSON.parse(JSON.stringify(this._definition)));
  }
  /**
   * Recursively set specified parameters.
   */
  applyParameters(field, mappedParameters) {
    if (field instanceof Function) {
      return field(field, mappedParameters, false);
    }
    if ("fields" in field) {
      if (typeof field.constructor === "string") {
        const parameterValue = mappedParameters[field.constructor];
        if (typeof parameterValue !== "number") {
          throw new Error(`Invalid parameter value '${parameterValue}' for constructor value`);
        }
        field.constructor = parameterValue;
      }
      field.fields = field.fields.map((fieldParameter) => {
        return this.applyParameters(fieldParameter, mappedParameters);
      });
    }
    if ("list" in field) {
      field.list = field.list?.map((fieldParameter) => {
        return this.applyParameters(fieldParameter, mappedParameters);
      });
    }
    if ("int" in field) {
      let parameterValue = mappedParameters[field.int];
      if (typeof parameterValue === "bigint") {
        parameterValue = Number(parameterValue);
      }
      if (typeof parameterValue !== "number") {
        throw new Error(`Invalid parameter value '${parameterValue}' for type 'int'`);
      }
      field.int = parameterValue;
    }
    if ("bytes" in field) {
      const parameterValue = mappedParameters[field.bytes] ?? "";
      if (typeof parameterValue !== "string") {
        throw new Error(`Invalid parameter value '${parameterValue}' for type 'bytes'`);
      }
      field.bytes = parameterValue;
    }
    if (Array.isArray(field) && field.every((item) => typeof item === "object" && Object.keys(item).length === 1)) {
      field.forEach((value) => {
        return this.applyParameters(value, mappedParameters);
      });
    }
    return field;
  }
  /**
   * Recursively pull parameters from datum using definition template.
   */
  extractParameters(definedDefinition, templateDefinition, foundParameters = {}) {
    if (!templateDefinition) return foundParameters;
    if (templateDefinition instanceof Function) {
      templateDefinition(definedDefinition, foundParameters);
      return foundParameters;
    }
    if (templateDefinition instanceof Array) {
      templateDefinition.map((fieldParameter, index) => {
        return this.extractParameters(fieldParameter, templateDefinition[index], foundParameters);
      }).forEach((parameters) => {
        foundParameters = { ...foundParameters, ...parameters };
      });
    }
    if ("fields" in definedDefinition) {
      if (!("fields" in templateDefinition)) {
        throw new Error("Template definition does not match with 'fields'");
      }
      if (templateDefinition.constructor && typeof templateDefinition.constructor !== "number") {
        foundParameters[templateDefinition.constructor] = definedDefinition.constructor;
      } else if (templateDefinition.constructor !== definedDefinition.constructor) {
        throw new Error("Template definition does not match with constructor value");
      }
      definedDefinition.fields.map((fieldParameter, index) => {
        return this.extractParameters(fieldParameter, templateDefinition.fields[index], foundParameters);
      }).forEach((parameters) => {
        foundParameters = { ...foundParameters, ...parameters };
      });
    }
    if ("list" in definedDefinition) {
      if (!("list" in templateDefinition) || !Array.isArray(definedDefinition.list)) {
        throw new Error("Template definition does not match or 'list' is not an array");
      }
      definedDefinition.list.map((fieldParameter, index) => {
        if (templateDefinition.list) {
          return this.extractParameters(fieldParameter, templateDefinition.list[index], foundParameters);
        } else {
          throw new Error(`Template definition at index ${index} is undefined`);
        }
      }).forEach((parameters) => {
        foundParameters = { ...foundParameters, ...parameters };
      });
    }
    if ("int" in definedDefinition) {
      if (!("int" in templateDefinition)) {
        throw new Error("Template definition does not match with 'int'");
      }
      if (typeof templateDefinition.int !== "number") {
        foundParameters[templateDefinition.int] = definedDefinition.int;
      }
    }
    if ("bytes" in definedDefinition) {
      if (!("bytes" in templateDefinition)) {
        throw new Error("Template definition does not match with 'bytes'");
      }
      const datumKeys = Object.values(DatumParameterKey);
      if (datumKeys.includes(templateDefinition.bytes)) {
        foundParameters[templateDefinition.bytes] = definedDefinition.bytes;
      }
    }
    return foundParameters;
  }
};

// src/dex/definitions/minswap-v1/order.ts
var order_default = {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "ReceiverPubKeyHash" /* ReceiverPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: 1,
      fields: []
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */
            },
            {
              bytes: "SwapOutTokenAssetName" /* SwapOutTokenAssetName */
            }
          ]
        },
        {
          int: "MinReceive" /* MinReceive */
        }
      ]
    },
    {
      int: "BatcherFee" /* BatcherFee */
    },
    {
      int: "DepositFee" /* DepositFee */
    }
  ]
};

// src/dex/minswap.ts
var Minswap = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.marketOrderAddress = "addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt";
    this.limitOrderAddress = "addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70";
    this.cancelDatum = "d87a80";
    this.orderScript = {
      type: "PlutusV1",
      script: "59014f59014c01000032323232323232322223232325333009300e30070021323233533300b3370e9000180480109118011bae30100031225001232533300d3300e22533301300114a02a66601e66ebcc04800400c5288980118070009bac3010300c300c300c300c300c300c300c007149858dd48008b18060009baa300c300b3754601860166ea80184ccccc0288894ccc04000440084c8c94ccc038cd4ccc038c04cc030008488c008dd718098018912800919b8f0014891ce1317b152faac13426e6a83e06ff88a4d62cce3c1634ab0a5ec133090014a0266008444a00226600a446004602600a601a00626600a008601a006601e0026ea8c03cc038dd5180798071baa300f300b300e3754601e00244a0026eb0c03000c92616300a001375400660106ea8c024c020dd5000aab9d5744ae688c8c0088cc0080080048c0088cc00800800555cf2ba15573e6e1d200201"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const swapInNumerator = swapOutAmount * reserveIn * poolFeeMultiplier;
    const swapInDenominator = (reserveOut - swapOutAmount) * poolFeeModifier;
    return swapInNumerator / swapInDenominator + 1n;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * reserveOut * poolFeeModifier;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    return swapOutNumerator / swapOutDenominator;
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * poolFeeModifier * reserveOut;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    const priceImpactNumerator = reserveOut * swapInAmount * swapOutDenominator * poolFeeModifier - swapOutNumerator * reserveIn * poolFeeMultiplier;
    const priceImpactDenominator = reserveOut * swapInAmount * swapOutDenominator * poolFeeMultiplier;
    return Number(priceImpactNumerator * 100n) / Number(priceImpactDenominator);
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const networkFee = this.swapOrderFees().find((fee) => fee.id === "networkFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    if (!networkFee || !deposit) {
      return Promise.reject("Parameters for datum are not set.");
    }
    swapParameters = {
      ...swapParameters,
      ["BatcherFee" /* BatcherFee */]: networkFee.value,
      ["DepositFee" /* DepositFee */]: deposit.value
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: this.marketOrderAddress,
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: networkFee.value + deposit.value
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: false,
          spendUtxos
        }
      )
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      return [this.marketOrderAddress, this.limitOrderAddress].includes(utxo.address);
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "networkFee",
        title: "Network Fee",
        description: "The fee paid to the Cardano network to process a transaction.",
        value: 900000n,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.",
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
Minswap.identifier = "Minswap";

// src/dex/definitions/sundaeswap-v1/order.ts
var order_default2 = {
  constructor: 0,
  fields: [
    {
      bytes: "PoolIdentifier" /* PoolIdentifier */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
                    }
                  ]
                },
                {
                  constructor: 0,
                  fields: [
                    {
                      constructor: 0,
                      fields: [
                        {
                          constructor: 0,
                          fields: [
                            {
                              bytes: "SenderStakingKeyHash" /* SenderStakingKeyHash */
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              constructor: 1,
              fields: []
            }
          ]
        },
        {
          constructor: 1,
          fields: []
        }
      ]
    },
    {
      int: "ScooperFee" /* ScooperFee */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: "Action" /* Action */,
          fields: []
        },
        {
          int: "SwapInAmount" /* SwapInAmount */
        },
        {
          constructor: 0,
          fields: [
            {
              int: "MinReceive" /* MinReceive */
            }
          ]
        }
      ]
    }
  ]
};

// src/dex/sundaeswap.ts
var SundaeSwap = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.orderAddress = "addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8";
    this.cancelDatum = "d87a80";
    this.orderScript = {
      type: "PlutusV1",
      script: "59084601000033233322232332232333222323332223322323332223233223233223332223333222233322233223322332233223332223322332233322232323232322222325335300b001103c13503d35303b3357389201035054350003c498ccc888c8c8c94cd4c05c0144d4c0680188888cd4c04c480048d4c0ed40188888888888cd4c078480048ccd5cd19b8f375c0020180440420066a6040006446a6048004446a605000444666aa60302400244a66a6a07c0044266a08c0020042002a0886466a002a088a08a2446600466a609000846a0820024a0806600400e00226a606ca002444444444466a6032240024646464666ae68cdc399991119191800802990009aa82c1119a9a826000a4000446a6aa08a00444a66a6050666ae68cdc78010048150148980380089803001990009aa82b9119a9a825800a4000446a6aa08800444a66a604e666ae68cdc7801003814814080089803001999aa81e3ae335503c75ceb4d4c084cccd5cd19b8735573aa006900011998119aba1500335742a00466a080eb8d5d09aba2500223505135304f33573892010350543100050499262220020183371491010270200035302801422220044800808007c4d5d1280089aab9e500113754002012264a66a6a070601a6aae78dd50008a81a910a99a9a81d0008a81b910a99a9a81e0008a81c910a99a9a81f0008a81d910a99a9a8200008a81e910a99a9a8210008a81f910a99a9a8220008a820910a99a9a8230008a821910a99a9a8240008a822910a99a9a8250008a823910a99a9a82600089999999999825981000a18100090080071810006181000500418100031810002001110a8259a980a1999ab9a3370e6aae754009200023301635742a0046ae84d5d1280111a8211a982019ab9c490103505431000414992622002135573ca00226ea8004cd40148c8c8c8c8cccd5cd19b8735573aa00890001199980d9bae35742a0086464646666ae68cdc39aab9d5002480008cc88cc08c008004c8c8c8cccd5cd19b8735573aa004900011991198148010009919191999ab9a3370e6aae754009200023302d304735742a00466a07a4646464646666ae68cdc3a800a4004466606a6eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d4009200023037304e357426aae7940188d4154d4c14ccd5ce2490350543100054499264984d55cea80189aba25001135573ca00226ea8004d5d09aba2500223504e35304c335738921035054310004d49926135573ca00226ea8004d5d0a80119a81cbae357426ae8940088d4128d4c120cd5ce249035054310004949926135573ca00226ea8004d5d0a80119a81abae357426ae8940088d4118d4c110cd5ce249035054310004549926135573ca00226ea8004d5d0a8019bad35742a00464646464646666ae68cdc3a800a40084605c646464646666ae68cdc3a800a40044606c6464646666ae68cdc39aab9d5002480008cc88cd40f8008004dd69aba15002375a6ae84d5d1280111a8289a982799ab9c491035054310005049926135573ca00226ea8004d5d09aab9e500423333573466e1d40092000233036304b35742a0086eb4d5d09aba2500423504e35304c335738921035054310004d499264984d55cea80109aab9e5001137540026ae84d55cf280291999ab9a3370ea0049001118169bad357426aae7940188cccd5cd19b875003480008ccc0bcc11cd5d0a8031bad35742a00a66a072eb4d5d09aba2500523504a353048335738920103505431000494992649926135573aa00626ae8940044d55cf280089baa001357426ae8940088d4108d4c100cd5ce249035054310004149926135744a00226ae8940044d55cf280089baa0010033350052323333573466e1d40052002201623333573466e1d40092000201623504035303e335738921035054310003f499264984d55ce9baa001002335005200100112001230023758002640026aa072446666aae7c004940c08cd40bcd5d080118019aba2002498c8004d540e088448894cd4d40bc0044008884cc014008ccd54c01c48004014010004c8004d540dc884894cd4d40b400440188854cd4c01cc01000840244cd4c01848004010004488008488004800488848ccc00401000c00880048848cc00400c00880044880084880048004888848cccc00401401000c00880048848cc00400c00880048848cc00400c00880048848cc00400c00880048488c00800c888488ccc00401401000c800484888c00c0108884888ccc00801801401084888c00401080048488c00800c88488cc00401000c800448848cc00400c008480044488c88c008dd5800990009aa80d11191999aab9f0022501223350113355008300635573aa004600a6aae794008c010d5d100180c09aba10011122123300100300211200112232323333573466e1d400520002350083005357426aae79400c8cccd5cd19b87500248008940208d405cd4c054cd5ce24810350543100016499264984d55cea80089baa00112122300200311220011200113500d35300b3357389211f556e6578706563746564205478496e666f20636f6e737472756374696f6e2e0000c498888888888848cccccccccc00402c02802402001c01801401000c00880044488008488488cc00401000c480048c8c8cccd5cd19b875001480088c018dd71aba135573ca00646666ae68cdc3a80124000460106eb8d5d09aab9e500423500c35300a3357389201035054310000b499264984d55cea80089baa001212230020032122300100320012323333573466e1d40052002200823333573466e1d40092000200a2350073530053357389210350543100006499264984d55ce9baa0011200120011261220021220012001112323001001223300330020020014891c0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b9130001"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const receive = reserveIn * reserveOut / (reserveOut - swapOutAmount) - reserveIn;
    const swapFee = (receive * BigInt(Math.floor(poolFeePercent * 100)) + BigInt(1e4) - 1n) / 10000n;
    return receive + swapFee;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const swapFee = (swapInAmount * BigInt(Math.floor(poolFeePercent * 100)) + BigInt(1e4) - 1n) / 10000n;
    return reserveOut - reserveIn * reserveOut / (reserveIn + swapInAmount - swapFee);
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const reserveIn = tokensMatch(swapInToken, liquidityPool.tokenA) ? liquidityPool.state.reserveA : liquidityPool.state.reserveB;
    return (1 - Number(reserveIn) / Number(reserveIn + swapInAmount)) * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const scooperFee = this.swapOrderFees().find((fee) => fee.id === "scooperFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    if (!scooperFee || !deposit) {
      return Promise.reject("Parameters for datum are not set.");
    }
    const swapInToken = swapParameters.SwapInTokenPolicyId + swapParameters.SwapInTokenAssetName;
    const swapOutToken = swapParameters.SwapOutTokenPolicyId + swapParameters.SwapOutTokenAssetName;
    const swapDirection = [swapInToken, swapOutToken].sort((a, b) => {
      return a.localeCompare(b);
    })[0] === swapInToken ? 0 : 1;
    swapParameters = {
      ...swapParameters,
      ["ScooperFee" /* ScooperFee */]: scooperFee.value,
      ["Action" /* Action */]: swapDirection
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default2).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: this.orderAddress,
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: scooperFee.value + deposit.value
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: false,
          spendUtxos
        }
      )
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      return utxo.address === this.orderAddress;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "scooperFee",
        title: "Scooper Processing Fee",
        description: "An ADA fee paid to the Sundae Scooper Network for processing your order.",
        value: 2500000n,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "A small ADA deposit that you will get back when your order is processed or cancelled.",
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
SundaeSwap.identifier = "SundaeSwap";

// src/dex/definitions/muesliswap/order.ts
var order_default3 = {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      constructor: 0,
                      fields: [
                        {
                          bytes: "SenderStakingKeyHash" /* SenderStakingKeyHash */
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          bytes: "SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */
        },
        {
          bytes: "SwapOutTokenAssetName" /* SwapOutTokenAssetName */
        },
        {
          bytes: "SwapInTokenPolicyId" /* SwapInTokenPolicyId */
        },
        {
          bytes: "SwapInTokenAssetName" /* SwapInTokenAssetName */
        },
        {
          int: "MinReceive" /* MinReceive */
        },
        {
          constructor: "AllowPartialFill" /* AllowPartialFill */,
          fields: []
        },
        {
          // matchMakerFee + deposit
          int: "TotalFees" /* TotalFees */
        }
      ]
    }
  ]
};

// src/dex/muesliswap.ts
var MuesliSwap = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.orderAddress = "addr1zyq0kyrml023kwjk8zr86d5gaxrt5w8lxnah8r6m6s4jp4g3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqqktyhv";
    this.cancelDatum = "d87980";
    this.orderScript = {
      type: "PlutusV2",
      script: "59152a010000323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323223232323232322232323232323232323232533355333573460d000226464646424446600200a0086eb4d5d09aba2003355333573460d060da0022660a06eb4d5d098360009bad357426ae88c1b000458c1b88894ccd5cd18358008b0a999ab9a337100029000099801983500118350008991982a19b8400300133708004002660ce0040026ea8d5d080098350010a999ab9a306700113212223002004375a6ae84c1a800854ccd5cd18330008220b099180e1a9a805030911111111111299a999aa983583601892999ab9a3371e01c002260c80020c400840d20c2a020426038660946010002660946603a666aa60b40c06a0340c26a0340c4666aa60b40c044a66a6a0044444a66a6605060a4030008260ba0060b642660c200200420020ba60546a0140c2660366660486a01e0c26a01e0c460460246660486a01e0c26a01e0c466604c6a0120886a01e0c26a01e0c4660946008a0226020a00a4426464646464646046660a2601e00e660a2603e032660a2602ea018660a26016a030660a26a01044666ae68cdc499b8200248008cdc1240000020be0cc660a26a0104426ae68cdc419b8200248008cdc1011000998289982899814982980c98298029982899827981d00c981d0029982899827981700c98170029982899827980e00c980e0029982899827980e80c980e802a99a980f80c88020a99a80202e031998289a9980f1a804111919191982d99b8400300133708004002660dc00400266e0808c008cdc099b8202200133704004044660ac60540329001112999ab9a3370e00a0042660760440020bc66048660446a00c0d26660560040026a6a6603c010660ac66605a6a0200960040029001111982c19b84002001330583370a0040020020d0660446a0200966660566a02c0d06a02c0d26a6603c660ac6054032900100438435014068350130663027002301b00135001063533553353500b22350022222222222223333500d206620662066233355306f070035235001225335330470020041306a00306800d2135001223500122223501222350022222222222223335530700762235002222253353303e01800413307a006005100507300a16162215335001133052300a00235002204a2216306a00137540144666aa60b80ba604a04c400266aa60b00ba46a00244446a0084466a0044a666ae68cdc78048008a999a80282d102d90a99a9981a0009a80803390a99a9999999aba40012325333573460e060ea0022646666aae7c00481848cccd55cf9aba2002253353039357420064260c82460020040c240c40d60d460e80020bc6ea8008817881788178817819c84cc140d4004800522010f4d7565736c69537761705f76322e320005c05b061206230273500705e13306822533500105922132533553353035303735003062215335007213304a00200105615335006205605c15335333049034350030613500922200113305e30073500306200110011001300400130313500505c30513500304025333535001203f16216215335330290013500505c21533533333335748002464a666ae68c194c1a80044c8cccd55cf800902b11999aab9f35744004464a66a6666666ae900048c94ccd5cd183598380008991999aab9f001205c23233335573e00240bc4646666aae7c00481808c8cccd55cf80090311191999aab9f001206423233335573e00240cc4646666aae7c00481a08c8cccd55cf800903511999aab9f35744004464a66aa66aa66aa66aa66aa66aa66aa66a6666666ae900048c94ccd5cd183f9842008008991999aab9f001207023233335573e00240e446666aae7cd5d10011299a98241aba1005213253353333333574800246464a666ae68c224040044cccd55cf984680801103c91999aab9f35744611c02006464a66a6666666ae900048c8c94ccd5cd18480080089999aab9f309301002207f23233335573e0024102024646666aae7c004820c048cccd55cf9aba200225335305a3574261320201042a66a60b66ae84018854cd4c170d5d0802909844009998410080180100084280842008418090420084680846009aba200208a0135744612802006110022a666ae68c23c040044cccd55cf984980801103f91999aab9f357446128020064a66a60aa6ae84c2540401084c20804c208040041fc82000422404220041f4c24c04004dd5001103e103e103e103e0428090983e983e80083d1aba1308f01004207a083010820115333573461140200226666aae7cc234040088c1e81e481e4208041dcc23404004dd5001103b103b103b103b03f90983b9983780180083a1aba1004072207307c07b357440040f26106020020da6ea800881b481b481b481b41d884c1b8c1bc0041ac854cd4c110d5d0808909837980100083603590a99a98221aba100f21306f300200106c06b21533530443574201a4260de60040020d80d642a66a60886ae8402c84c1bcc0080041b01ac854cd4c10cd5d080490983798010008360359099299a9999999aba4001232325333573461060200226666aae7cc218040088c1cc1e481c81ec54ccd5cd18410080089999aab9f30860100223073072207207b070308601001375400440de40de40de40de0f04260e060060020da6ae8401c1ac854cd4c10cd5d080290983798010008360359aba1011206b074073357440040e26ae880081bcd5d10010369aba200206b357440040d26ae8800819cd5d1001032983780082c9baa002205920592059205906221305a305c0010573574200640ae0c00be60d20020a66ea8008814c814c814c814c17084d4004800458588c8d4d4d401016c888818888d40048c894ccd54ccd4018854ccd4010854ccd402084c0140c44c0100c054ccd401484c0140c44c0100c011810c54ccd401c84c0100c04c00c0bc54ccd401084c0100c04c00c0bc11454ccd400c810811010454ccd400c854ccd401c84c0100c04c00c0bc54ccd401084c0100c04c00c0bc11410854ccd401884c00c0bc4c0080b854ccd400c84c00c0bc4c0080b811054cd400415016c16c15094ccd4008854ccd4018854ccd401084ccc0d00c400800458585810854ccd4014854ccd400c84ccc0cc0c0008004585858104100c100ccc198888c94ccd5cd19b87003371a002200426600866e0000d20023370066e080092080043371c002006a66a660d244a66a0020a64426a00444a666ae68cdc78012451c5817c34e5702473304f3cf676299176d3824e55b8c0bfa94830429fd001305900113006003353533533069221225333573466e2000520001615335002162215333573460d20062004266a600c0c400266e0400d200205c30323500605d00405e204321533500116221350022253350031002221616480012000350012233335001262626232533530303032001213212333001003002005350022043163330672225335002162213500222533533035002005100113300700300530303500405b0015333573460ba60c400226464642466002006004606c6ae84d5d11831801a999ab9a305e3063001132323232323232323232323232323232323232323232321233333333333300101801601401201000e00c009007005003002304e357426ae88008ccc121d710009aba10013574400466608c09040026ae84004d5d100119822bae357420026ae8800d4ccd5cd1836983900089919191909198008020012999ab9a307030750011330583304175a6ae84c1d0004c158d5d09aba230740011637546ae84d5d11839801a999ab9a306e30730011323212330010030023055357426ae88c1cc008cc0fdd69aba130720011637546ae84c1c400458dd51aba10013574400466607e0a6eb4d5d08009aba20023303e040357420026ae88008ccc0edd701d1aba100135744004666072eb80e0d5d08009aba200233038035357420026ae88008cc0d80c8d5d08009aba23063002330340303574260c40022c6ea8d5d098308008b1baa00133041300700430080043304030240033018003305d22533500104e2213303e33303d03c303f3040002500530040011303a303b001355333573460aa60b40022646090a666ae68c158c16c0044c8c8c8c8c8c8cccccccc134c10cd5d098300039bae3574200c6eb8d5d08029bae357420086eb8d5d08019bad3574200460846ae84004dd69aba1357440026ae88004d5d10009aba2001357440026ae88004d5d1182d0008b1baa3574260b20022c40026ea80048d40041408d4004814488d400888d400c88c8c8c8cc104cdc200100099b84003001330540010023370400a00666e0800c0048d4004888880c9200233035001043223355304204723500122330390023355304504a235001223303c0023335001370090003802337000029000000998028010009299a8008890008b11199aa9822022980680711a80091199aa9823824180800891a80091199a80091980ea400000203846603a0029000000998018010009119aa981f82211a800911981b001199a800919aa982182411a800911981d001181900080091199804018801000919aa982182411a800911981d0011806000800999801816001000911199aa981f02202119aa981f82211a800911981b0011817000999aa981f022111a80111299a999aa98238241981b91199805025801000980402511a8009119805001002803080189982300200182080099aa981f82211a800911981b0011982a11299a800898050019109a80111299a9980600100408911198010050020980300180200111980091299a80101f880081b909111800802111a801111a801911919a802919a80212999ab9a3371e004002006078407a466a008407a4a666ae68cdc780100080181e0a99a80190a99a8011099a801119a801119a801119a8011198190010009020119a801102011981900100091102011119a80210201112999ab9a3370e00c0062a666ae68cdc380280109980f00200082082081d0a99a800901d02011a800911110149111981e998170019981e9981700100081e01e1981511299a801108018800818911198251119a800a4000446a00444a666ae68cdc78010040998281119a800a4000446a00444a666ae68cdc78010068800898030018008980300180191a8009111111100311981411199a80181e0010009a80081d891980081101a91a80091111111111100511999999aba40012323253335734608200226666aae7cc11000880c08cccd55cf9aba2304500325335300835742608c008426066605e00206040620740722a666ae68c1000044cccd55cf9822001101811999aab9f35744608a0064a66a60106ae84c11801084c0ccc0cc0040c080c40e80e40b8c110004dd5001101690169016901681b11999999aba4001202c202c202c2302d375a004405806a46666666ae9000480ac80ac80ac80ac8c0b0dd700101a111a8009111111111111982691299a80081b9109a801112999ab9a3371e0040282607a0022600c006004930919999999800801912999ab9a3370e0040020302a666ae68cdc480100080a80b1109ab9a337100040024426ae68cdc480100091199ab9a3371200400205206000444a666ae68cdc480100088008801112999ab9a337120040022004200244666ae68cdc40010008138171109ab9a3370e00400246a0024444444400e44a666ae68cdc79a8010179a800817889ab9a3370e6a0040606a00206004646a0024466a004404a04a46a00244444444444401846a0024444008446464a666ae68c0d400403854ccd5cd181a0008980998021aba13037002153335734606600201e2c606e0026ea80048c94ccd5cd1818181a80089919091980080180118021aba135744606a00460126ae84c0d000458dd50009192999ab9a302f3034001132323232323232321233330010090070030023302375c6ae84d5d10022999ab9a3037001132122230020043574260720042a666ae68c0d80044c84888c004010dd71aba13039002153335734606a0020262c60720026ea8d5d08009aba200233300675c00a6ae84004d5d1181a001180b1aba1303300116375400266002eb9d69111981a111999aab9f0012027232330293301a30073037001300630360013004357440066ae840080a4dd58009119819111999aab9f001202523302630053574200460066ae8800809cdd6000919192999ab9a302f00113212222300400530043574260600042a666ae68c0b80044c848888c008014c054d5d098180010a999ab9a302d00113212222300100530053574260600042a666ae68c0b00044c848888c00c014dd71aba13030002163030001375400246464a666ae68cdc3a401800222444401c2a666ae68cdc3a4014002220522a666ae68cdc3a40100022646424444444660020120106eb4d5d09aba23030003375c6ae84c0bc00854ccd5cd18170008991909111111198010048041bae357426ae88c0c000cdd71aba1302f002153335734605a00226464244444446600c0120106eb8d5d09aba23030003301435742605e0042a666ae68c0b00044c848888888c01c020c050d5d098178010a999ab9a302b001132122222223005008301435742605e0042c605e0026ea80048c94ccd5cd181498170008991909198008018011bad357426ae88c0b8008c00cd5d098168008b1baa001232533357346050605a00226eb8d5d098160008b1baa0011122200111001222002110012220032122230030042213573466e3c0080048894cd4cc00c00800403c058894cd400840040348d400488cd40088004988d4004888888880208c94ccd5cd180e8008088a999ab9a301c00100a1630203754002464a666ae68c06cc0800044cc00cc018d5d0980f800998040021aba135744603e0022c6ea80048848cc00400c0088c8c94ccd5cd180d8008991998029bad35742603e0066eb4d5d08009bad357426ae88004d5d1180f0010a999ab9a301a0011300a300535742603c0042c603c0026ea8004888488ccc00401401000c8c8c94ccd5cd180c800898021bae3574260380042a666ae68c0600044c020dd71aba1301c00216301c001375400242446002006446464a666ae68c05c0044c01cc010d5d0980d8010a999ab9a301800100516301b0013754002200220184244600400644444444246666666600201201000e00c00a008006004424600200460264422444a66a00220044426600a004666aa600e01a00a0080026024442244a66a00200a44266012600800466aa600c016008002200220084424466002008006601c4422444a66a00226a006010442666a00a0126008004666aa600e01000a0080022400244004440026014444a666ae68c01c00440084cc00c004cdc30010009111111100291111110021b8148000dc3a40006e1d2002370e90021b874801955cf2ab9d23230010012233003300200200101"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const receive = Number(reserveIn) * Number(reserveOut) / (Number(reserveOut) - Number(swapOutAmount)) - Number(reserveIn);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    return BigInt(Math.floor(Number(receive) * (1 + poolFeePercent / 100)));
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const swapFee = (swapInAmount * BigInt(Math.floor(poolFeePercent * 100)) + BigInt(1e4) - 1n) / 10000n;
    const adjustedSwapInAmount = swapInAmount - swapFee;
    const estimatedReceive = Number(reserveOut) - Number(reserveIn) * Number(reserveOut) / (Number(reserveIn) + Number(adjustedSwapInAmount));
    return BigInt(Math.floor(estimatedReceive));
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const estimatedReceive = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
    const oldPrice = Number(reserveIn) / Number(reserveOut);
    const swapPrice = Number(swapInAmount) / Number(estimatedReceive);
    return (swapPrice - oldPrice) / oldPrice * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const matchMakerFee = this.swapOrderFees().find((fee) => fee.id === "matchmakerFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    if (!matchMakerFee || !deposit || !swapParameters["MinReceive" /* MinReceive */]) {
      return Promise.reject("Parameters for datum are not set.");
    }
    swapParameters = {
      ...swapParameters,
      ["TotalFees" /* TotalFees */]: matchMakerFee.value + deposit.value,
      ["AllowPartialFill" /* AllowPartialFill */]: 1
    };
    if (!swapParameters["SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */]) {
      swapParameters["MinReceive" /* MinReceive */] -= matchMakerFee.value;
    }
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default3).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: this.orderAddress,
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: matchMakerFee.value + deposit.value
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: false,
          spendUtxos
        }
      )
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      return utxo.address === this.orderAddress;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "matchmakerFee",
        title: "Matchmaker Fee",
        description: "Fee to cover costs for the order matchmakers.",
        value: 950000n,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.",
        value: 1700000n,
        isReturned: true
      }
    ];
  }
};
MuesliSwap.identifier = "MuesliSwap";

// src/dex/definitions/wingriders-v1/order.ts
var order_default4 = {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  bytes: "ReceiverPubKeyHash" /* ReceiverPubKeyHash */
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      constructor: 0,
                      fields: [
                        {
                          bytes: "ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
        },
        {
          int: "Expiration" /* Expiration */
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  bytes: "PoolAssetAPolicyId" /* PoolAssetAPolicyId */
                },
                {
                  bytes: "PoolAssetAAssetName" /* PoolAssetAAssetName */
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  bytes: "PoolAssetBPolicyId" /* PoolAssetBPolicyId */
                },
                {
                  bytes: "PoolAssetBAssetName" /* PoolAssetBAssetName */
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: "Action" /* Action */,
          fields: []
        },
        {
          int: "MinReceive" /* MinReceive */
        }
      ]
    }
  ]
};

// src/dex/wingriders.ts
var WingRiders = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.orderAddress = "addr1wxr2a8htmzuhj39y2gq7ftkpxv98y2g67tg8zezthgq4jkg0a4ul4";
    this.cancelDatum = "d87a80";
    this.orderScript = {
      type: "PlutusV1",
      script: "590370010000332332233322232323332223332223233223232323232332233222232322323225335301533225335301a00221333573466e3c02cdd7299a9a8101980924004a66a6a040660249000299a9a8101980924000a66a6a04066024900019a980b8900098099bac5335350203301248000d4d54054c0440088800858884008004588854cd4d4088004588854cd4d409000440088858588854cd4d4088004588854cd4d4090004588854cd4d409800440188858588854cd4d4088004588854cd4d409000440108858588854cd4d4088004400888580680644cc88d4c03400888d4c0440088888cc05cdd70019918139bac0015335350273301948000d4d54070c06001c88008588854cd4d40a4004588854cd4d40ac004588854cd4d40b4004588854cd4d40bc004588854cd4d40c4004588854cd4d40cc004588854cd4d40d400458884008cccd5cd19b8735573aa010900011980699191919191999ab9a3370e6aae75401120002333301535742a0086ae85400cd5d0a8011aba135744a004464c6a605266ae700900a80680644d5d1280089aba25001135573ca00226ea8004d5d0a8041aba135744a010464c6a604666ae7007809005004c004cccd5cd19b8750024800880688cccd5cd19b875003480008c8c074004dd69aba135573ca00a464c6a604466ae7007408c04c0480440044084584d55cea80089baa001135573ca00226ea80048848cc00400c0088004888848cccc00401401000c0088004c8004d540548894cd4d404c00440308854cd4c034ccd5cd19b8f00400200f00e100f13300500400125335350103300248000004588854cd4d4048004588854cd4d40500044cd54028010008885888c8d4d54018cd5401cd55cea80098021aab9e5001225335300b333573466e1c0140080340304004584dd5000990009aa809111999aab9f0012501223350113574200460066ae8800800d26112212330010030021120013200135500e2212253353500d0021622153353007333573466e1c00d2000009008100213353006120010013370200690010910010910009000909118010018910009000a490350543100320013550062233335573e0024a00c466a00a6eb8d5d080118019aba2002007112200212212233001004003120011200120011123230010012233003300200200148811ce6c90a5923713af5786963dee0fdffd830ca7e0c86a041d9e5833e910001"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const swapInNumerator = swapOutAmount * reserveIn * poolFeeMultiplier;
    const swapInDenominator = (reserveOut - swapOutAmount) * poolFeeModifier;
    return swapInNumerator / swapInDenominator;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * reserveOut * poolFeeModifier;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    return swapOutNumerator / swapOutDenominator;
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const swapOutTokenDecimals = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.tokenB.decimals ?? 0 : liquidityPool.tokenA === "lovelace" ? 6 : liquidityPool.tokenA.decimals ?? 0;
    const estimatedReceive = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
    const swapPrice = Number(swapInAmount) / 10 ** (swapInToken === "lovelace" ? 6 : swapInToken.decimals ?? 0) / (Number(estimatedReceive) / 10 ** swapOutTokenDecimals);
    const poolPrice = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.price : 1 / liquidityPool.price;
    return Math.abs(swapPrice - poolPrice) / ((swapPrice + poolPrice) / 2) * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const agentFee = this.swapOrderFees().find((fee) => fee.id === "agentFee");
    const oil = this.swapOrderFees().find((fee) => fee.id === "oil");
    if (!agentFee || !oil) {
      return Promise.reject("Parameters for datum are not set.");
    }
    const swapInToken = swapParameters.SwapInTokenPolicyId + swapParameters.SwapInTokenAssetName;
    const swapOutToken = swapParameters.SwapOutTokenPolicyId + swapParameters.SwapOutTokenAssetName;
    const swapDirection = [swapInToken, swapOutToken].sort((a, b) => {
      return a.localeCompare(b);
    })[0] === swapInToken ? 0 : 1;
    swapParameters = {
      ...swapParameters,
      ["Action" /* Action */]: swapDirection,
      ["Expiration" /* Expiration */]: (/* @__PURE__ */ new Date()).getTime() + 60 * 60 * 6 * 1e3,
      ["PoolAssetAPolicyId" /* PoolAssetAPolicyId */]: swapDirection === 0 ? swapParameters.SwapInTokenPolicyId : swapParameters.SwapOutTokenPolicyId,
      ["PoolAssetAAssetName" /* PoolAssetAAssetName */]: swapDirection === 0 ? swapParameters.SwapInTokenAssetName : swapParameters.SwapOutTokenAssetName,
      ["PoolAssetBPolicyId" /* PoolAssetBPolicyId */]: swapDirection === 0 ? swapParameters.SwapOutTokenPolicyId : swapParameters.SwapInTokenPolicyId,
      ["PoolAssetBAssetName" /* PoolAssetBAssetName */]: swapDirection === 0 ? swapParameters.SwapOutTokenAssetName : swapParameters.SwapInTokenAssetName
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default4).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: this.orderAddress,
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: agentFee.value + oil.value
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: false,
          spendUtxos
        }
      )
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      return utxo.address === this.orderAddress;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "agentFee",
        title: "Agent Fee",
        description: "WingRiders DEX employs decentralized Agents to ensure equal access, strict fulfillment ordering and protection to every party involved in exchange for a small fee.",
        value: 2000000n,
        isReturned: false
      },
      {
        id: "oil",
        title: "Oil",
        description: 'A small amount of ADA has to be bundled with all token transfers on the Cardano Blockchain. We call this "Oil ADA" and it is always returned to the owner when the request gets fulfilled. If the request expires and the funds are reclaimed, the Oil ADA is returned as well.',
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
WingRiders.identifier = "WingRiders";

// src/requests/swap-request.ts
var SwapRequest = class {
  constructor(dexter) {
    this._swapInAmount = 0n;
    this._slippagePercent = 1;
    this._withUtxos = [];
    this._metadata = "";
    this._dexter = dexter;
  }
  get liquidityPool() {
    return this._liquidityPool;
  }
  get swapInToken() {
    return this._swapInToken;
  }
  get swapOutToken() {
    return this._swapOutToken;
  }
  get swapInAmount() {
    return this._swapInAmount;
  }
  get slippagePercent() {
    return this._slippagePercent;
  }
  forLiquidityPool(liquidityPool) {
    if (!Object.keys(this._dexter.availableDexs).includes(liquidityPool.dex)) {
      throw new Error(`DEX ${liquidityPool.dex} provided with the liquidity pool is not available.`);
    }
    this._liquidityPool = liquidityPool;
    return this;
  }
  flip() {
    if (this._swapInToken) {
      [this._swapInToken, this._swapOutToken] = [this._swapOutToken, this._swapInToken];
      this.withSwapOutAmount(this._swapInAmount);
    }
    return this;
  }
  withMetadata(metadata) {
    this._metadata = metadata;
    return this;
  }
  withSwapInToken(swapInToken) {
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before providing an input token.");
    }
    if (tokensMatch(swapInToken, this._liquidityPool.tokenA)) {
      this._swapOutToken = this._liquidityPool.tokenB;
    } else if (tokensMatch(swapInToken, this._liquidityPool.tokenB)) {
      this._swapOutToken = this._liquidityPool.tokenA;
    } else {
      throw new Error("Input token doesn't exist in the set liquidity pool.");
    }
    this._swapInToken = swapInToken;
    return this;
  }
  withSwapOutToken(swapOutToken) {
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before providing an input token.");
    }
    if (tokensMatch(swapOutToken, this._liquidityPool.tokenA)) {
      this._swapInToken = this._liquidityPool.tokenB;
    } else if (tokensMatch(swapOutToken, this._liquidityPool.tokenB)) {
      this._swapInToken = this._liquidityPool.tokenA;
    } else {
      throw new Error("Output token doesn't exist in the set liquidity pool.");
    }
    this._swapOutToken = swapOutToken;
    return this;
  }
  withSwapInAmount(swapInAmount) {
    this._swapInAmount = swapInAmount > 0n ? swapInAmount : 0n;
    return this;
  }
  withSwapOutAmount(swapOutAmount) {
    if (swapOutAmount <= 0n) {
      this._swapInAmount = 0n;
    }
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before setting a swap out amount.");
    }
    this._swapInAmount = this._dexter.availableDexs[this._liquidityPool.dex].estimatedGive(
      this._liquidityPool,
      this._swapOutToken,
      swapOutAmount
    );
    return this;
  }
  withMinimumReceive(minReceive) {
    if (minReceive <= 0n) {
      this._swapInAmount = 0n;
    }
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before setting a swap out amount.");
    }
    this._swapInAmount = this._dexter.availableDexs[this._liquidityPool.dex].estimatedGive(
      this._liquidityPool,
      this._swapOutToken,
      BigInt(
        Math.ceil(Number(minReceive) * (1 + this._slippagePercent / 100))
      )
    );
    return this;
  }
  withSlippagePercent(slippagePercent) {
    if (slippagePercent < 0) {
      throw new Error("Slippage percent must be zero or above.");
    }
    this._slippagePercent = slippagePercent;
    return this;
  }
  withUtxos(utxos) {
    if (utxos.length === 0) {
      throw new Error("Must provide valid UTxOs to use in swap.");
    }
    this._withUtxos = utxos;
    return this;
  }
  getEstimatedReceive(liquidityPool) {
    const poolToCheck = liquidityPool ?? this._liquidityPool;
    if (!poolToCheck) {
      throw new Error("Liquidity pool must be set before calculating the estimated receive.");
    }
    if (!this._swapInToken) {
      throw new Error("Swap in token must be set before calculating the estimated receive.");
    }
    return this._dexter.availableDexs[this._liquidityPool.dex].estimatedReceive(
      poolToCheck,
      this._swapInToken,
      this._swapInAmount
    );
  }
  getMinimumReceive(liquidityPool) {
    return BigInt(
      Math.floor(Number(this.getEstimatedReceive(liquidityPool)) / (1 + this._slippagePercent / 100))
    );
  }
  getPriceImpactPercent() {
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before calculating the price impact.");
    }
    if (!this._swapInToken) {
      throw new Error("Swap in token must be set before calculating the price impact.");
    }
    return this._dexter.availableDexs[this._liquidityPool.dex].priceImpactPercent(
      this._liquidityPool,
      this._swapInToken,
      this._swapInAmount
    );
  }
  getSwapFees() {
    return this._dexter.availableDexs[this._liquidityPool.dex].swapOrderFees();
  }
  getPaymentsToAddresses() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a swap order.");
    }
    if (!this._dexter.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before submitting a swap order.");
    }
    if (!this._liquidityPool) {
      throw new Error("Liquidity pool must be set before submitting a swap order.");
    }
    if (!this._swapInToken) {
      throw new Error("Swap in token must be set before submitting a swap order.");
    }
    if (this._swapInAmount <= 0n) {
      throw new Error("Swap in amount must be set before submitting a swap order.");
    }
    const defaultSwapParameters = {
      ["Address" /* Address */]: this._dexter.walletProvider.address(),
      ["SenderPubKeyHash" /* SenderPubKeyHash */]: this._dexter.walletProvider.publicKeyHash(),
      ["SenderStakingKeyHash" /* SenderStakingKeyHash */]: this._dexter.walletProvider.stakingKeyHash(),
      ["ReceiverPubKeyHash" /* ReceiverPubKeyHash */]: this._dexter.walletProvider.publicKeyHash(),
      ["ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */]: this._dexter.walletProvider.stakingKeyHash(),
      ["PoolIdentifier" /* PoolIdentifier */]: this._liquidityPool.identifier,
      ["SwapInAmount" /* SwapInAmount */]: this._swapInAmount,
      ["MinReceive" /* MinReceive */]: this.getMinimumReceive(),
      ["SwapInTokenPolicyId" /* SwapInTokenPolicyId */]: this._swapInToken === "lovelace" ? "" : this._swapInToken.policyId,
      ["SwapInTokenAssetName" /* SwapInTokenAssetName */]: this._swapInToken === "lovelace" ? "" : this._swapInToken.nameHex,
      ["SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */]: this._swapOutToken === "lovelace" ? "" : this._swapOutToken.policyId,
      ["SwapOutTokenAssetName" /* SwapOutTokenAssetName */]: this._swapOutToken === "lovelace" ? "" : this._swapOutToken.nameHex
    };
    return this._dexter.availableDexs[this._liquidityPool.dex].buildSwapOrder(
      this._liquidityPool,
      defaultSwapParameters,
      this._withUtxos.map((utxo) => {
        return {
          utxo
        };
      })
    );
  }
  submit() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a swap order.");
    }
    if (!this._dexter.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before submitting a swap order.");
    }
    const swapTransaction = this._dexter.walletProvider.createTransaction();
    if (!this._dexter.config.shouldSubmitOrders) {
      return swapTransaction;
    }
    this.getPaymentsToAddresses().then((payToAddresses) => {
      this.sendSwapOrder(swapTransaction, payToAddresses);
    });
    return swapTransaction;
  }
  sendSwapOrder(swapTransaction, payToAddresses) {
    swapTransaction.status = 0 /* Building */;
    const swapInTokenName = this._swapInToken === "lovelace" ? "ADA" : this._swapInToken.readableTicker;
    const swapOutTokenName = this._swapOutToken === "lovelace" ? "ADA" : this._swapOutToken.readableTicker;
    swapTransaction.payToAddresses(payToAddresses).then(() => {
      swapTransaction.status = 1 /* Signing */;
      swapTransaction.sign().then(() => {
        swapTransaction.status = 2 /* Submitting */;
        swapTransaction.submit().then(() => {
          swapTransaction.status = 3 /* Submitted */;
        }).catch((error) => {
          swapTransaction.error = {
            step: 2 /* Submitting */,
            reason: "Failed submitting transaction.",
            reasonRaw: error
          };
          swapTransaction.status = 4 /* Errored */;
        });
      }).catch((error) => {
        swapTransaction.error = {
          step: 1 /* Signing */,
          reason: "Failed to sign transaction.",
          reasonRaw: error
        };
        swapTransaction.status = 4 /* Errored */;
      });
    }).catch((error) => {
      swapTransaction.error = {
        step: 0 /* Building */,
        reason: "Failed to build transaction.",
        reasonRaw: error
      };
      swapTransaction.status = 4 /* Errored */;
    });
  }
};

// src/requests/cancel-swap-request.ts
var CancelSwapRequest = class {
  constructor(dexter) {
    this._dexter = dexter;
  }
  forTransaction(txHash) {
    this._txHash = txHash;
    return this;
  }
  forDex(name) {
    this._dexName = name;
    return this;
  }
  getPaymentsToAddresses() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a swap order.");
    }
    const returnAddress = this._dexter.walletProvider.address();
    return this._dexter.dataProvider.transactionUtxos(this._txHash).then((utxos) => {
      return this._dexter.availableDexs[this._dexName].buildCancelSwapOrder(utxos, returnAddress);
    }).catch(() => {
      throw new Error("Unable to grab UTxOs for the provided Tx hash. Ensure the one provided is a valid Tx hash.");
    });
  }
  cancel() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a swap order.");
    }
    if (!this._txHash) {
      throw new Error("Tx hash must be provided before cancelling a swap order.");
    }
    if (!this._dexName) {
      throw new Error("DEX must be provided before cancelling a swap order.");
    }
    const cancelTransaction = this._dexter.walletProvider.createTransaction();
    this.getPaymentsToAddresses().then((payToAddresses) => {
      this.sendCancelOrder(cancelTransaction, payToAddresses);
    }).catch((error) => {
      throw new Error(`Unable to cancel swap order. ${error}`);
    });
    return cancelTransaction;
  }
  sendCancelOrder(cancelTransaction, payToAddresses) {
    cancelTransaction.status = 0 /* Building */;
    cancelTransaction.attachMetadata(674 /* Message */, {
      msg: [
        `[${this._dexter.config.metadataMsgBranding}] ${this._dexName} Cancel Swap`
      ]
    });
    cancelTransaction.payToAddresses(payToAddresses).then(() => {
      cancelTransaction.status = 1 /* Signing */;
      cancelTransaction.sign().then(() => {
        cancelTransaction.status = 2 /* Submitting */;
        cancelTransaction.submit().then(() => {
          cancelTransaction.status = 3 /* Submitted */;
        }).catch((error) => {
          cancelTransaction.error = {
            step: 2 /* Submitting */,
            reason: "Failed submitting transaction.",
            reasonRaw: error
          };
          cancelTransaction.status = 4 /* Errored */;
        });
      }).catch((error) => {
        cancelTransaction.error = {
          step: 1 /* Signing */,
          reason: "Failed to sign transaction.",
          reasonRaw: error
        };
        cancelTransaction.status = 4 /* Errored */;
      });
    }).catch((error) => {
      cancelTransaction.error = {
        step: 0 /* Building */,
        reason: "Failed to build transaction.",
        reasonRaw: error
      };
      cancelTransaction.status = 4 /* Errored */;
    });
  }
};

// src/dexter.ts
import axios from "axios";
import axiosRetry from "axios-retry";

// src/requests/split-swap-request.ts
var SplitSwapRequest = class {
  constructor(dexter) {
    this._swapRequests = [];
    this._slippagePercent = 1;
    this._metadata = "";
    this._dexter = dexter;
  }
  get liquidityPools() {
    return this._swapRequests.map((swapRequest) => swapRequest.liquidityPool);
  }
  get swapRequests() {
    return this._swapRequests;
  }
  get swapInToken() {
    return this._swapInToken;
  }
  get swapOutToken() {
    return this._swapOutToken;
  }
  get swapInAmount() {
    return this._swapRequests.reduce((totalSwapInAmount, swapRequest) => {
      return totalSwapInAmount + swapRequest.swapInAmount;
    }, 0n);
  }
  get slippagePercent() {
    return this._slippagePercent;
  }
  flip() {
    this._swapRequests.forEach((swapRequest) => {
      swapRequest.flip();
    });
    return this;
  }
  withMetadata(metadata) {
    this._metadata = metadata;
    return this;
  }
  withSwapInToken(swapInToken) {
    this._swapInToken = swapInToken;
    return this;
  }
  withSwapOutToken(swapOutToken) {
    this._swapOutToken = swapOutToken;
    return this;
  }
  withSwapInAmountMappings(mappings) {
    if (!this._swapInToken) {
      throw new Error("Swap-in token must be set before setting the pool mappings.");
    }
    this.isValidLiquidityPoolMappings(
      mappings.map((mapping) => mapping.liquidityPool)
    );
    this._swapRequests = mappings.map((mapping) => {
      return this._dexter.newSwapRequest().forLiquidityPool(mapping.liquidityPool).withSwapInToken(this._swapInToken).withSlippagePercent(this._slippagePercent).withSwapInAmount(mapping.swapInAmount);
    });
    return this;
  }
  withSwapOutAmountMappings(mappings) {
    if (!this._swapOutToken) {
      throw new Error("Swap-out token must be set before setting the pool mappings.");
    }
    this.isValidLiquidityPoolMappings(
      mappings.map((mapping) => mapping.liquidityPool)
    );
    this._swapRequests = mappings.map((mapping) => {
      return this._dexter.newSwapRequest().forLiquidityPool(mapping.liquidityPool).withSwapOutToken(this._swapOutToken).withSlippagePercent(this._slippagePercent).withSwapOutAmount(mapping.swapOutAmount);
    });
    return this;
  }
  withSlippagePercent(slippagePercent) {
    if (slippagePercent < 0) {
      throw new Error("Slippage percent must be zero or above.");
    }
    if (this._swapRequests.length > 0) {
      this._swapRequests.forEach((swapRequest) => {
        swapRequest.withSlippagePercent(slippagePercent);
      });
    }
    this._slippagePercent = slippagePercent;
    return this;
  }
  withUtxos(utxos) {
    if (utxos.length === 0) {
      throw new Error("Must provide valid UTxOs to use in swap.");
    }
    this._swapRequests.forEach((swapRequest) => {
      swapRequest.withUtxos(utxos);
    });
    return this;
  }
  getEstimatedReceive() {
    return this._swapRequests.reduce((totalEstimatedReceive, swapRequest) => {
      return totalEstimatedReceive + swapRequest.getEstimatedReceive();
    }, 0n);
  }
  getMinimumReceive() {
    return this._swapRequests.reduce((totalMinimumReceive, swapRequest) => {
      return totalMinimumReceive + swapRequest.getMinimumReceive();
    }, 0n);
  }
  getAvgPriceImpactPercent() {
    if (this._swapRequests.length === 0) return 0;
    const totalPriceImpactPercent = this._swapRequests.reduce((totalPriceImpactPercent2, swapRequest) => {
      return totalPriceImpactPercent2 + swapRequest.getPriceImpactPercent();
    }, 0);
    if (totalPriceImpactPercent === 0) return 0;
    return totalPriceImpactPercent / this._swapRequests.length;
  }
  getSwapFees() {
    return this._swapRequests.map((swapRequest) => {
      return this._dexter.availableDexs[swapRequest.liquidityPool.dex].swapOrderFees();
    }).flat();
  }
  submit() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a swap order.");
    }
    if (!this._dexter.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before submitting a swap order.");
    }
    if (this._swapRequests.length === 0) {
      throw new Error("Swap requests were never initialized.");
    }
    const swapTransaction = this._dexter.walletProvider.createTransaction();
    Promise.all(this._swapRequests.map((swapRequest) => swapRequest.getPaymentsToAddresses())).then((payToAddresses) => {
      this.sendSplitSwapOrder(swapTransaction, payToAddresses.flat());
    });
    return swapTransaction;
  }
  sendSplitSwapOrder(splitSwapTransaction, payToAddresses) {
    splitSwapTransaction.status = 0 /* Building */;
    const swapInTokenName = this._swapInToken === "lovelace" ? "ADA" : this._swapInToken.readableTicker;
    const swapOutTokenName = this._swapOutToken === "lovelace" ? "ADA" : this._swapOutToken.readableTicker;
    splitSwapTransaction.attachMetadata(674 /* Message */, {
      msg: [
        this._metadata !== "" ? this._metadata : `[${this._dexter.config.metadataMsgBranding}] Split ${swapInTokenName} -> ${swapOutTokenName} Swap`
      ]
    });
    splitSwapTransaction.payToAddresses(payToAddresses).then(() => {
      splitSwapTransaction.status = 1 /* Signing */;
      splitSwapTransaction.sign().then(() => {
        splitSwapTransaction.status = 2 /* Submitting */;
        splitSwapTransaction.submit().then(() => {
          splitSwapTransaction.status = 3 /* Submitted */;
        }).catch((error) => {
          splitSwapTransaction.error = {
            step: 2 /* Submitting */,
            reason: "Failed submitting transaction.",
            reasonRaw: error
          };
          splitSwapTransaction.status = 4 /* Errored */;
        });
      }).catch((error) => {
        splitSwapTransaction.error = {
          step: 1 /* Signing */,
          reason: "Failed to sign transaction.",
          reasonRaw: error
        };
        splitSwapTransaction.status = 4 /* Errored */;
      });
    }).catch((error) => {
      splitSwapTransaction.error = {
        step: 0 /* Building */,
        reason: "Failed to build transaction.",
        reasonRaw: error
      };
      splitSwapTransaction.status = 4 /* Errored */;
    });
  }
  isValidLiquidityPoolMappings(liquidityPools) {
    liquidityPools.map((pool) => pool.dex).forEach((dex) => {
      if (!Object.keys(this._dexter.availableDexs).includes(dex)) {
        throw new Error(`DEX ${dex} provided with the liquidity pool is not available.`);
      }
    });
  }
};

// src/requests/split-cancel-swap-request.ts
var SplitCancelSwapRequest = class {
  constructor(dexter) {
    this._cancelRequests = [];
    this._dexter = dexter;
  }
  forTransactions(mappings) {
    this._cancelRequests = mappings.map((mapping) => {
      return this._dexter.newCancelSwapRequest().forTransaction(mapping.txHash).forDex(mapping.dex);
    });
    return this;
  }
  submit() {
    if (!this._dexter.walletProvider) {
      throw new Error("Wallet provider must be set before submitting a cancel swap order.");
    }
    if (!this._dexter.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before submitting a cancel swap order.");
    }
    if (this._cancelRequests.length === 0) {
      throw new Error("Cancel requests were never initialized.");
    }
    const cancelTransaction = this._dexter.walletProvider.createTransaction();
    Promise.all(this._cancelRequests.map((cancelRequest) => cancelRequest.getPaymentsToAddresses())).then((payToAddresses) => {
      this.sendSplitCancelSwapOrder(cancelTransaction, payToAddresses.flat());
    });
    return cancelTransaction;
  }
  sendSplitCancelSwapOrder(cancelTransaction, payToAddresses) {
    cancelTransaction.status = 0 /* Building */;
    cancelTransaction.attachMetadata(674 /* Message */, {
      msg: [
        `[${this._dexter.config.metadataMsgBranding}] Split Cancel Swap`
      ]
    });
    cancelTransaction.payToAddresses(payToAddresses).then(() => {
      cancelTransaction.status = 1 /* Signing */;
      cancelTransaction.sign().then(() => {
        cancelTransaction.status = 2 /* Submitting */;
        cancelTransaction.submit().then(() => {
          cancelTransaction.status = 3 /* Submitted */;
        }).catch((error) => {
          cancelTransaction.error = {
            step: 2 /* Submitting */,
            reason: "Failed submitting transaction.",
            reasonRaw: error
          };
          cancelTransaction.status = 4 /* Errored */;
        });
      }).catch((error) => {
        cancelTransaction.error = {
          step: 1 /* Signing */,
          reason: "Failed to sign transaction.",
          reasonRaw: error
        };
        cancelTransaction.status = 4 /* Errored */;
      });
    }).catch((error) => {
      cancelTransaction.error = {
        step: 0 /* Building */,
        reason: "Failed to build transaction.",
        reasonRaw: error
      };
      cancelTransaction.status = 4 /* Errored */;
    });
  }
};

// src/dex/definitions/sundaeswap-v3/order.ts
var order_default5 = {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: "PoolIdentifier" /* PoolIdentifier */
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: "SenderStakingKeyHash" /* SenderStakingKeyHash */
        }
      ]
    },
    {
      int: "ProtocolFee" /* ProtocolFee */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      constructor: 0,
                      fields: [
                        {
                          bytes: "SenderStakingKeyHash" /* SenderStakingKeyHash */
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          constructor: 0,
          fields: []
        }
      ]
    },
    {
      constructor: 1,
      fields: [
        [
          {
            bytes: "SwapInTokenPolicyId" /* SwapInTokenPolicyId */
          },
          {
            bytes: "SwapInTokenAssetName" /* SwapInTokenAssetName */
          },
          {
            int: "SwapInAmount" /* SwapInAmount */
          }
        ],
        [
          {
            bytes: "SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */
          },
          {
            bytes: "SwapOutTokenAssetName" /* SwapOutTokenAssetName */
          },
          {
            int: "MinReceive" /* MinReceive */
          }
        ]
      ]
    },
    {
      bytes: "CancelDatum" /* CancelDatum */
    }
  ]
};

// src/dex/sundaeswap-v3.ts
var SundaeSwapV3 = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.cancelDatum = "d87a80";
    this.orderScriptHash = "fa6a58bbe2d0ff05534431c8e2f0ef2cbdc1602a8456e4b13c8f3077";
    this.orderScript = {
      type: "PlutusV2",
      script: "5909a201000033232323232323223222323232253330093232533300b3005300c375400e264646464646466664444646600200200a4464a6660306026002264646600200201044a66603c00229404c94ccc070cdc79bae302100200414a226600600600260420026eb8c074c068dd50010a99980c1809000899198008009bac301e301b375400644a66603a00229444c94ccc06ccc018018c0800084cc00c00c00452818100008a99980c1806800899198008009bac301e301b375400644a66603a00229404c94ccc06ccc018018c08000852889980180180098100008a99980c180600089919b89375a603c002646660020026eb0c07cc0800092000222533301f002100113330030033022002533301c33007007302100213370000290010800980d1baa00215333018300b00113232533301a3014301b3754002264a66603664a66603e603c0022a666038602c603a002294454ccc070c05cc0740045280b0b1baa300b301d37546016603a6ea80204cdc4800801899b88001003375a603e60386ea80045281807980d9baa3009301b375400c6eb4c074c068dd50010a99980c180500089919299980d180a180d9baa001132533301b32533301f301e0011533301c3016301d00114a22a666038602e603a00229405858dd51805980e9baa3011301d3754010266e2400c0044cdc40018009bad301f301c37540022940c03cc06cdd51807980d9baa006375a603a60346ea80084c8c8cc004004018894ccc078004528099299980e19baf004301d302100214a2266006006002604200266e9520003301c3374a90011980e180e980d1baa0024bd7025eb80c060dd5000980098099baa00e3758602c602e602e602e602e602e602e602e602e60266ea8c01cc04cdd5004980b180b980b980b980b980b980b980b98099baa3007301337540126eacc020c04cdd5180398099baa009230163017001323232325333013300e301437540202646464646464646464646464a666044604a00426464646493192999811980f000899192999814181580109924c64a66604c604200226464a666056605c0042930b1bae302c001302837540042a66604c604000226464a666056605c0042930b1bae302c001302837540042c604c6ea800458c0a4004c094dd50038a999811980e800899191919299981518168010991924c6464646464a66606060660042930b1bad30310013031002375c605e002605e0066eb8c0b4008c8c8c8c8c94ccc0bcc0c800852616375a606000260600046eb8c0b8004c0b8010dd718160018b1bac302b001302b00237586052002604a6ea801c54ccc08cc0600044c8c94ccc0a0c0ac0084c926323232323232323253330303033002149858dd6981880098188011bae302f001302f003375c605a0046464646464a66605e60640042930b1bad30300013030002375c605c002605c0066eb8c0b0008dd618140011bac302600116325333028302b302b0011337606054002605460560022c6eb0c0a4004c094dd50038a999811980b800899192999814181580109924c6464646464a66605a60600042930b1bad302e001302e002375c605800260580046eb8c0a800458dd6181480098129baa007153330233016001132325333028302b002132498c8c8c8c8c8c8c8c94ccc0c0c0cc00852616375a606200260620046eb8c0bc004c0bc00cdd718168011919191919299981798190010a4c2c6eb4c0c0004c0c0008dd7181700098170019bae302c002375860500046eb0c09800458c94ccc0a0c0acc0ac0044cdd81815000981518158008b1bac30290013025375400e2a666046602a00226464a666050605600426493191bae3028002375c604c0022c64a66605060566056002266ec0c0a8004c0a8c0ac00458dd6181480098129baa007163023375400c64a666044603a002264646464a6660526058004264649319299981418118008a99981598151baa00314985854ccc0a0c0880044c8c94ccc0b4c0c000852616375c605c00260546ea800c54ccc0a0c0740044c8c94ccc0b4c0c000852616302e001302a37540062c60506ea80094ccc098c084c09cdd5001899191919299981698180010991924c64a666058604e00226464a666062606800426493192999817981500089919299981a181b80109924c60440022c606a00260626ea800854ccc0bcc0a40044c8c8c8c8c8c94ccc0e0c0ec00852616375a607200260720046eb4c0dc004c0dc008dd6981a80098189baa00216302f37540022c6064002605c6ea800c54ccc0b0c09800454ccc0bcc0b8dd50018a4c2c2c60586ea8008c06c00c58c0b8004c0b8008c0b0004c0a0dd50018b0b18150009815001181400098121baa00815333022301c00115333025302437540102930b0b18111baa007300e00a325333020301b0011323253330253028002149858dd7181300098111baa00c15333020301a00115333023302237540182930b0b18101baa00b163023001302300230210013021002301f001301f002375a603a002603a004603600260360046032002602a6ea804058c00400488c94ccc050c03c0044c8c94ccc064c07000852616375c6034002602c6ea800854ccc050c0380044c8c94ccc064c0700084c926330060012330060060011637586034002602c6ea800854ccc050c0240044c8c94ccc064c0700084c926330060012330060060011637586034002602c6ea800854ccc050c0200044c8c8c8c94ccc06cc0780084c92633008001233008008001163758603800260380046eb4c068004c058dd50010a99980a180380089919299980c980e0010a4c2c6eb4c068004c058dd50010a99980a180300089919299980c980e0010a4c2c6eb4c068004c058dd50010a99980a19b87480300044c8c94ccc064c07000852616375c6034002602c6ea800858c050dd500091191980080080191299980b8008a4c26466006006603600460066032002464a666022601800226464a66602c60320042930b1bae3017001301337540042a666022601600226464a66602c60320042930b1bae3017001301337540042c60226ea8004dc3a40146e1d2008370e90031b87480104c8ccc004004dd5980198071baa3002300e37540089408894ccc04400840044c8ccc010010c05400ccc88c94ccc048c034c04cdd500189929998099806980a1baa001132533301400714a2266e3c004048dd7180c180a9baa001002301730143754006002200860200026eb4c044004c04c0088c0400048c03cc040c040c040c040c040c0400045261365632533300830030011533300b300a37540082930b0a99980418010008a99980598051baa00414985858c020dd50019b8748008dc3a40006eb80055cd2ab9d5573caae7d5d02ba1574498011e581c99e5aacf401fed0eb0e2993d72d423947f42342e8f848353d03efe610001"
    };
    this.protocolFeeDefault = 1280000n;
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const receive = reserveIn * reserveOut / (reserveOut - swapOutAmount) - reserveIn;
    const swapFee = (receive * BigInt(Math.floor(poolFeePercent * 100)) + BigInt(1e4) - 1n) / 10000n;
    return receive + swapFee;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const swapFee = (swapInAmount * BigInt(Math.floor(poolFeePercent * 100)) + BigInt(1e4) - 1n) / 10000n;
    return reserveOut - reserveIn * reserveOut / (reserveIn + swapInAmount - swapFee);
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const reserveIn = tokensMatch(swapInToken, liquidityPool.tokenA) ? liquidityPool.state.reserveA : liquidityPool.state.reserveB;
    return (1 - Number(reserveIn) / Number(reserveIn + swapInAmount)) * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const protocolFee = this.swapOrderFees().find((fee) => fee.id === "protocolFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    if (!protocolFee || !deposit) {
      return Promise.reject("Parameters for datum are not set.");
    }
    swapParameters = {
      ...swapParameters,
      ["ProtocolFee" /* ProtocolFee */]: protocolFee.value,
      ["CancelDatum" /* CancelDatum */]: this.cancelDatum
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default5).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(swapParameters, {
        address: lucidUtils.credentialToAddress(
          {
            type: "Script",
            hash: this.orderScriptHash
          },
          {
            type: "Key",
            hash: swapParameters.SenderStakingKeyHash
          }
        ),
        addressType: 0 /* Contract */,
        assetBalances: [
          {
            asset: "lovelace",
            quantity: this.protocolFeeDefault + deposit.value
          }
        ],
        datum: datumBuilder.getCbor(),
        isInlineDatum: true,
        spendUtxos
      })
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      const addressDetails = lucidUtils.getAddressDetails(utxo.address);
      return (addressDetails.paymentCredential?.hash ?? "") === this.orderScriptHash;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: true,
        spendUtxos: [
          {
            utxo: relevantUtxo,
            redeemer: this.cancelDatum,
            validator: this.orderScript,
            signer: returnAddress
          }
        ]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "protocolFee",
        title: "Sundae Protocol Fee",
        description: "Sundae Protocol Fee",
        value: this.protocolFeeDefault,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "A small ADA deposit that you will get back when your order is processed or cancelled.",
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
SundaeSwapV3.identifier = "SundaeSwapV3";

// src/dex/definitions/minswap-v2/order.ts
var order_default6 = {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "SenderStakingKeyHash" /* SenderStakingKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: 0,
      fields: []
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "ReceiverPubKeyHash" /* ReceiverPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: "ReceiverDatumType" /* ReceiverDatumType */,
      // none | inline | hash, none = 0, inline = 1, hash = 2
      fields: [
        // none = empty array
        // hash or inline = hash of incoming datum as first field in the array
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: "LpTokenPolicyId" /* LpTokenPolicyId */
        },
        {
          bytes: "LpTokenAssetName" /* LpTokenAssetName */
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: "Direction" /* Direction */,
          fields: []
        },
        {
          constructor: 0,
          fields: [
            {
              int: "SwapInAmount" /* SwapInAmount */
            }
          ]
        },
        {
          int: "MinReceive" /* MinReceive */
        },
        {
          constructor: 0,
          fields: []
        }
      ]
    },
    {
      int: "BatcherFee" /* BatcherFee */
    },
    {
      constructor: 1,
      fields: []
    }
  ]
};

// src/dex/minswap-v2.ts
var MinswapV2 = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.orderScriptHash = "c3e28c36c3447315ba5a56f33da6a6ddc1770a876a8d9f0cb3a97c4c";
    this.cancelDatum = "d87a80";
    this.orderScript = {
      type: "PlutusV2",
      script: "590a600100003332323232323232323222222533300832323232533300c3370e900118058008991919299980799b87480000084cc004dd5980a180a980a980a980a980a980a98068030060a99980799b87480080084c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c94ccc080cdc3a4000002264646600200200e44a66604c00229404c8c94ccc094cdc78010028a51133004004001302a002375c60500026eb8c094c07800854ccc080cdc3a40040022646464646600200202844a66605000229404c8c94ccc09ccdd798161812981618129816181698128010028a51133004004001302c002302a0013374a9001198131ba90014bd701bae3026001301e002153330203370e900200089980900419ba548000cc090cdd2a400466048604a603c00497ae04bd70099981019b87375a6044604a66446464a66604866e1d200200114bd6f7b63009bab302930220023022001323300100100322533302700114c103d87a800013232323253330283371e00e004266e9520003302c374c00297ae0133006006003375660520066eb8c09c008c0ac008c0a4004c8cc004004030894ccc09400452f5bded8c0264646464a66604c66e3d22100002100313302a337606ea4008dd3000998030030019bab3027003375c604a0046052004604e0026eb8c094c07800920004a0944c078004c08c004c06c060c8c8c8c8c8c8c94ccc08ccdc3a40000022646464646464646464646464646464646464a6660706076004264646464646464649319299981e99b87480000044c8c94ccc108c1140084c92632375a60840046eb4c10000458c8cdd81822000982218228009bac3043001303b0091533303d3370e90010008a999820181d8048a4c2c2c607601064a66607866e1d2000001132323232323232325333047304a002132498c09401458cdc3a400460886ea8c120004c120008dd6982300098230011822000982200119b8748008c0f8dd51821000981d0060a99981e19b87480080044c8c8c8c8c8c94ccc114c1200084c926302300316375a608c002608c0046088002608800466e1d2002303e3754608400260740182a66607866e1d2004001132323232323232325333047304a002132498c09401458dd6982400098240011bad30460013046002304400130440023370e9001181f1baa3042001303a00c1533303c3370e9003000899191919191919192999823982500109924c604a00a2c66e1d200230443754609000260900046eb4c118004c118008c110004c110008cdc3a4004607c6ea8c108004c0e803054ccc0f0cdc3a40100022646464646464a66608a60900042649319299982199b87480000044c8c8c8c94ccc128c13400852616375a609600260960046eb4c124004c10401854ccc10ccdc3a4004002264646464a666094609a0042930b1bad304b001304b002375a6092002608200c2c608200a2c66e1d200230423754608c002608c0046eb4c110004c110008c108004c0e803054ccc0f0cdc3a401400226464646464646464a66608e60940042649318130038b19b8748008c110dd5182400098240011bad30460013046002375a60880026088004608400260740182a66607866e1d200c001132323232323232325333047304a002132498c09801458cdc3a400460886ea8c120004c120008dd6982300098230011822000982200119b8748008c0f8dd51821000981d0060a99981e19b87480380044c8c8c8c8c8c8c8c8c8c8c8c8c8c94ccc134c14000852616375a609c002609c0046eb4c130004c130008dd6982500098250011bad30480013048002375a608c002608c0046eb4c110004c110008cdc3a4004607c6ea8c108004c0e803054ccc0f0cdc3a4020002264646464646464646464a66609260980042649318140048b19b8748008c118dd5182500098250011bad30480013048002375a608c002608c0046eb4c110004c110008c108004c0e803054ccc0f0cdc3a40240022646464646464a66608a60900042646493181200219198008008031129998238008a4c2646600600660960046464a66608c66e1d2000001132323232533304d3050002132498c0b400c58cdc3a400460946ea8c138004c138008c130004c11000858c110004c12400458dd698230009823001182200098220011bac3042001303a00c1533303c3370e900a0008a99981f981d0060a4c2c2c6074016603a018603001a603001c602c01e602c02064a66606c66e1d200000113232533303b303e002149858dd7181e000981a0090a99981b19b87480080044c8c94ccc0ecc0f800852616375c607800260680242a66606c66e1d200400113232533303b303e002149858dd7181e000981a0090a99981b19b87480180044c8c94ccc0ecc0f800852616375c607800260680242c60680222c607200260720046eb4c0dc004c0dc008c0d4004c0d4008c0cc004c0cc008c0c4004c0c4008c0bc004c0bc008c0b4004c0b4008c0ac004c0ac008c0a4004c08407858c0840748c94ccc08ccdc3a40000022a66604c60420042930b0a99981199b87480080044c8c94ccc0a0c0ac00852616375c605200260420042a66604666e1d2004001132325333028302b002149858dd7181480098108010b1810800919299981119b87480000044c8c8c8c94ccc0a4c0b00084c8c9263253330283370e9000000899192999816981800109924c64a66605666e1d20000011323253330303033002132498c04400458c0c4004c0a400854ccc0accdc3a40040022646464646464a666068606e0042930b1bad30350013035002375a606600260660046eb4c0c4004c0a400858c0a400458c0b8004c09800c54ccc0a0cdc3a40040022a666056604c0062930b0b181300118050018b18150009815001181400098100010b1810000919299981099b87480000044c8c94ccc098c0a400852616375a604e002603e0042a66604266e1d20020011323253330263029002149858dd69813800980f8010b180f800919299981019b87480000044c8c94ccc094c0a000852616375a604c002603c0042a66604066e1d20020011323253330253028002149858dd69813000980f0010b180f000919299980f99b87480000044c8c8c8c94ccc098c0a400852616375c604e002604e0046eb8c094004c07400858c0740048c94ccc078cdc3a400000226464a666046604c0042930b1bae3024001301c0021533301e3370e900100089919299981198130010a4c2c6eb8c090004c07000858c070004dd618100009810000980f8011bab301d001301d001301c00237566034002603400260320026030002602e0046eb0c054004c0340184cc004dd5980a180a980a980a980a980a980a980680300591191980080080191299980a8008a50132323253330153375e00c00229444cc014014008c054008c064008c05c004c03001cc94ccc034cdc3a40000022a666020601600e2930b0a99980699b874800800454ccc040c02c01c526161533300d3370e90020008a99980818058038a4c2c2c601600c2c60200026020004601c002600c00229309b2b118029baa001230033754002ae6955ceaab9e5573eae815d0aba24c126d8799fd87a9f581c1eae96baf29e27682ea3f815aba361a0c6059d45e4bfbe95bbd2f44affff004c0126d8799fd87a9f581cc8b0cc61374d409ff9c8512317003e7196a3e4d48553398c656cc124ffff0001"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const swapInNumerator = swapOutAmount * reserveIn * poolFeeMultiplier;
    const swapInDenominator = (reserveOut - swapOutAmount) * poolFeeModifier;
    return swapInNumerator / swapInDenominator + 1n;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * reserveOut * poolFeeModifier;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    return swapOutNumerator / swapOutDenominator;
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * poolFeeModifier * reserveOut;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    const priceImpactNumerator = reserveOut * swapInAmount * swapOutDenominator * poolFeeModifier - swapOutNumerator * reserveIn * poolFeeMultiplier;
    const priceImpactDenominator = reserveOut * swapInAmount * swapOutDenominator * poolFeeMultiplier;
    return Number(priceImpactNumerator * 100n) / Number(priceImpactDenominator);
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    if (!liquidityPool.lpToken) return Promise.reject("Unknown LP token");
    const networkFee = this.swapOrderFees().find((fee) => fee.id === "networkFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    if (!networkFee || !deposit) {
      return Promise.reject("Parameters for datum are not set.");
    }
    const swapInToken = swapParameters.SwapInTokenPolicyId + swapParameters.SwapInTokenAssetName;
    const swapOutToken = swapParameters.SwapOutTokenPolicyId + swapParameters.SwapOutTokenAssetName;
    const swapDirection = [swapInToken, swapOutToken].sort((a, b) => {
      return a.localeCompare(b);
    })[0] === swapInToken ? 1 : 0;
    const swapDatum = typeof swapParameters["ReceiverDatum" /* ReceiverDatum */] === "string" && swapParameters["ReceiverDatumType" /* ReceiverDatumType */] === "inline" ? lucidUtils.datumToHash(swapParameters["ReceiverDatum" /* ReceiverDatum */]) : swapParameters["ReceiverDatum" /* ReceiverDatum */];
    swapParameters = {
      ...swapParameters,
      ["BatcherFee" /* BatcherFee */]: 700000n,
      ["LpTokenPolicyId" /* LpTokenPolicyId */]: liquidityPool.lpToken.policyId,
      ["LpTokenAssetName" /* LpTokenAssetName */]: liquidityPool.lpToken.nameHex,
      ["Direction" /* Direction */]: swapDirection,
      ["ReceiverDatum" /* ReceiverDatum */]: swapDatum
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default6).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    let additionalDatumPayment = [];
    if (typeof swapParameters["ReceiverDatum" /* ReceiverDatum */] === "string" && swapParameters["ReceiverDatumType" /* ReceiverDatumType */] === "inline") {
      additionalDatumPayment = [
        {
          address: swapParameters.SenderPubKeyHash,
          addressType: determineAddressType(swapParameters.SenderPubKeyHash),
          assetBalances: [
            {
              asset: "lovelace",
              quantity: 2000000n
            }
          ],
          isInlineDatum: true,
          datum: swapParameters["ReceiverDatum" /* ReceiverDatum */]
        }
      ];
    }
    let additionalAdaOnOrder = 0n;
    if (typeof swapParameters["SwapAdditionalAdaOnOrder" /* SwapAdditionalAdaOnOrder */] === "bigint") {
      additionalAdaOnOrder = BigInt(swapParameters["SwapAdditionalAdaOnOrder" /* SwapAdditionalAdaOnOrder */]);
    }
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: lucidUtils.credentialToAddress(
            {
              type: "Script",
              hash: this.orderScriptHash
            },
            {
              type: "Key",
              hash: swapParameters.SenderStakingKeyHash
            }
          ),
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: networkFee.value + deposit.value + additionalAdaOnOrder
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: false,
          spendUtxos
        }
      ),
      ...additionalDatumPayment
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      const addressDetails = lucidUtils.getAddressDetails(utxo.address);
      return (addressDetails.paymentCredential?.hash ?? "") === this.orderScriptHash;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "networkFee",
        title: "Network Fee",
        description: "The fee paid to the Cardano network to process a transaction.",
        value: 700000n,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.",
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
MinswapV2.identifier = "MinswapV2";

// src/dex/definitions/wingriders-v2/order.ts
var order_default7 = {
  constructor: 0,
  fields: [
    {
      int: "DepositFee" /* DepositFee */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "ReceiverPubKeyHash" /* ReceiverPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "ReceiverPubKeyHash" /* ReceiverPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: "ReceiverStakingKeyHash" /* ReceiverStakingKeyHash */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    [],
    {
      constructor: 0,
      fields: []
    },
    {
      int: "Expiration" /* Expiration */
    },
    {
      bytes: "PoolAssetAPolicyId" /* PoolAssetAPolicyId */
    },
    {
      bytes: "PoolAssetAAssetName" /* PoolAssetAAssetName */
    },
    {
      bytes: "PoolAssetBPolicyId" /* PoolAssetBPolicyId */
    },
    {
      bytes: "PoolAssetBAssetName" /* PoolAssetBAssetName */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: "Action" /* Action */,
          fields: []
        },
        {
          int: "MinReceive" /* MinReceive */
        }
      ]
    },
    {
      int: "AScale" /* AScale */
    },
    {
      int: "BScale" /* BScale */
    }
  ]
};

// src/dex/wingriders-v2.ts
var WingRidersV2 = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.orderAddress = "addr1w8qnfkpe5e99m7umz4vxnmelxs5qw5dxytmfjk964rla98q605wte";
    this.cancelDatum = "d87a80";
    this.orderScript = {
      type: "PlutusV2",
      script: "59019e010000323232323232323232222325333008001149858c8c8c94ccc028cdc3a40040042664601444a666aae7c0045280a99980699baf301000100314a226004601c00264646464a66601c66e1d20000021301100116301100230110013754601c601a002601a6010601800c646eb0c038c8c034c034c034c034c034c034c028004c034004c034c0300104ccc888cdc79919191bae301300132323253330123370e90000010b0800980a801180a8009baa3012301100132301230110013011300f301000133300c222533301033712900500109980199b8100248028c044c044c044c044c04400454ccc040cdc3801240002602600226644a66602466e20009200016133301122253330153370e00490000980c00089980199b8100248008c058004008004cdc0801240046022002004646eb0c044c040004c040c03c00400cdd70039bad300d001004300d002300d00137540046ea52211caf97793b8702f381976cec83e303e9ce17781458c73c4bb16fe02b83002300430040012323002233002002001230022330020020015734ae888c00cdd5000aba15573caae741"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    const swapInNumerator = swapOutAmount * reserveIn * poolFeeMultiplier;
    const swapInDenominator = (reserveOut - swapOutAmount) * poolFeeModifier;
    return swapInNumerator / swapInDenominator;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0n;
    const poolFeeMultiplier = 10000n;
    const poolFeePercent = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
    const poolFeeModifier = poolFeeMultiplier - BigInt(Math.round(poolFeePercent / 100 * Number(poolFeeMultiplier)));
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    const swapOutNumerator = swapInAmount * reserveOut * poolFeeModifier;
    const swapOutDenominator = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;
    return swapOutNumerator / swapOutDenominator;
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    const swapOutTokenDecimals = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.tokenB.decimals ?? 0 : liquidityPool.tokenA === "lovelace" ? 6 : liquidityPool.tokenA.decimals ?? 0;
    const estimatedReceive = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
    const swapPrice = Number(swapInAmount) / 10 ** (swapInToken === "lovelace" ? 6 : swapInToken.decimals ?? 0) / (Number(estimatedReceive) / 10 ** swapOutTokenDecimals);
    const poolPrice = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.price : 1 / liquidityPool.price;
    return Math.abs(swapPrice - poolPrice) / ((swapPrice + poolPrice) / 2) * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const agentFee = this.swapOrderFees().find((fee) => fee.id === "agentFee");
    const oil = this.swapOrderFees().find((fee) => fee.id === "oil");
    if (!agentFee || !oil) {
      return Promise.reject("Parameters for datum are not set.");
    }
    const swapInToken = swapParameters.SwapInTokenPolicyId + swapParameters.SwapInTokenAssetName;
    const swapOutToken = swapParameters.SwapOutTokenPolicyId + swapParameters.SwapOutTokenAssetName;
    const swapDirection = [swapInToken, swapOutToken].sort((a, b) => {
      return a.localeCompare(b);
    })[0] === swapInToken ? 0 : 1;
    swapParameters = {
      ...swapParameters,
      ["Action" /* Action */]: swapDirection,
      ["DepositFee" /* DepositFee */]: 2000000n,
      ["Expiration" /* Expiration */]: (/* @__PURE__ */ new Date()).getTime() + 60 * 60 * 6 * 1e3,
      ["AScale" /* AScale */]: 1,
      ["BScale" /* BScale */]: 1,
      ["PoolAssetAPolicyId" /* PoolAssetAPolicyId */]: swapDirection === 0 ? swapParameters.SwapInTokenPolicyId : swapParameters.SwapOutTokenPolicyId,
      ["PoolAssetAAssetName" /* PoolAssetAAssetName */]: swapDirection === 0 ? swapParameters.SwapInTokenAssetName : swapParameters.SwapOutTokenAssetName,
      ["PoolAssetBPolicyId" /* PoolAssetBPolicyId */]: swapDirection === 0 ? swapParameters.SwapOutTokenPolicyId : swapParameters.SwapInTokenPolicyId,
      ["PoolAssetBAssetName" /* PoolAssetBAssetName */]: swapDirection === 0 ? swapParameters.SwapOutTokenAssetName : swapParameters.SwapInTokenAssetName
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default7).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(
        swapParameters,
        {
          address: this.orderAddress,
          addressType: 0 /* Contract */,
          assetBalances: [
            {
              asset: "lovelace",
              quantity: agentFee.value + oil.value
            }
          ],
          datum: datumBuilder.getCbor(),
          isInlineDatum: true,
          spendUtxos
        }
      )
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      return utxo.address === this.orderAddress;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "agentFee",
        title: "Agent Fee",
        description: "WingRiders DEX employs decentralized Agents to ensure equal access, strict fulfillment ordering and protection to every party involved in exchange for a small fee.",
        value: 2000000n,
        isReturned: false
      },
      {
        id: "oil",
        title: "Oil",
        description: 'A small amount of ADA has to be bundled with all token transfers on the Cardano Blockchain. We call this "Oil ADA" and it is always returned to the owner when the request gets fulfilled. If the request expires and the funds are reclaimed, the Oil ADA is returned as well.',
        value: 2000000n,
        isReturned: true
      }
    ];
  }
};
WingRidersV2.identifier = "WingRidersV2";

// src/dex/definitions/splash/order.ts
var order_default8 = {
  constructor: 0,
  fields: [
    {
      bytes: "Action" /* Action */
    },
    {
      bytes: "Beacon" /* Beacon */
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: "SwapInTokenPolicyId" /* SwapInTokenPolicyId */
        },
        {
          bytes: "SwapInTokenAssetName" /* SwapInTokenAssetName */
        }
      ]
    },
    {
      int: "SwapInAmount" /* SwapInAmount */
    },
    {
      int: "BaseFee" /* BaseFee */
    },
    {
      int: "MinReceive" /* MinReceive */
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: "SwapOutTokenPolicyId" /* SwapOutTokenPolicyId */
        },
        {
          bytes: "SwapOutTokenAssetName" /* SwapOutTokenAssetName */
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          int: "LpFeeNumerator" /* LpFeeNumerator */
        },
        {
          int: "LpFeeDenominator" /* LpFeeDenominator */
        }
      ]
    },
    {
      int: "ExecutionFee" /* ExecutionFee */
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
            }
          ]
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                (field, parameters, shouldExtract = true) => {
                  if (!shouldExtract) {
                    const stakeKeyHash = parameters["SenderStakingKeyHash" /* SenderStakingKeyHash */] ?? null;
                    if (!stakeKeyHash) return;
                    return {
                      constructor: 0,
                      fields: [
                        {
                          bytes: stakeKeyHash
                        }
                      ]
                    };
                  }
                  if ("fields" in field) {
                    if (field.constructor === 1) return;
                    if (field.fields.length > 0 && "bytes" in field.fields[0]) {
                      parameters["SenderStakingKeyHash" /* SenderStakingKeyHash */] = field.fields[0].bytes;
                    }
                  }
                  return;
                }
              ]
            }
          ]
        }
      ]
    },
    {
      bytes: "SenderPubKeyHash" /* SenderPubKeyHash */
    },
    [
      {
        bytes: "Batcher" /* Batcher */
      }
    ]
  ]
};

// src/dex/splash.ts
import { Uint64BE } from "int64-buffer";
import blake2b from "blake2b";
import { Asset as Asset2 } from "@indigo-labs/iris-sdk";
var EXECUTOR_FEE = 1000000n;
var WORST_ORDER_STEP_COST = 1000000n;
var Splash = class extends BaseDex {
  constructor() {
    super(...arguments);
    /**
     * On-Chain constants.
     */
    this.cancelDatum = "d87980";
    this.orderScriptHash = "464eeee89f05aff787d40045af2a40a83fd96c513197d32fbc54ff02";
    this.batcherKey = "5cb2c968e5d1c7197a6ce7615967310a375545d9bc65063a964335b2";
    this.orderScript = {
      type: "PlutusV2",
      script: "59042d01000033232323232323222323232232253330093232533300b0041323300100137566022602460246024602460246024601c6ea8008894ccc040004528099299980719baf00d300f301300214a226600600600260260022646464a66601c6014601e6ea80044c94ccc03cc030c040dd5000899191929998090038a99980900108008a5014a066ebcc020c04cdd5001180b180b980b980b980b980b980b980b980b980b98099baa00f3375e600860246ea8c010c048dd5180a98091baa00230043012375400260286eb0c050c054c054c044dd50028b1991191980080080191299980a8008a60103d87a80001323253330143375e6016602c6ea80080144cdd2a40006603000497ae0133004004001301900230170013758600a60206ea8010c04cc040dd50008b180098079baa0052301230130013322323300100100322533301200114a0264a66602066e3cdd7180a8010020a5113300300300130150013758602060226022602260226022602260226022601a6ea8004dd71808180898089808980898089808980898089808980898069baa0093001300c37540044601e00229309b2b19299980598050008a999804180218048008a51153330083005300900114a02c2c6ea8004c8c94ccc01cc010c020dd50028991919191919191919191919191919191919191919191919299981118128010991919191924c646600200200c44a6660500022930991980180198160011bae302a0015333022301f30233754010264646464a666052605800426464931929998141812800899192999816981800109924c64a666056605000226464a66606060660042649318140008b181880098169baa0021533302b3027001132323232323253330343037002149858dd6981a800981a8011bad30330013033002375a6062002605a6ea800858c0acdd50008b181700098151baa0031533302830240011533302b302a37540062930b0b18141baa002302100316302a001302a0023028001302437540102ca666042603c60446ea802c4c8c8c8c94ccc0a0c0ac00852616375a605200260520046eb4c09c004c08cdd50058b180d006180c8098b1bac30230013023002375c60420026042004603e002603e0046eb4c074004c074008c06c004c06c008c064004c064008dd6980b800980b8011bad30150013015002375a60260026026004602200260220046eb8c03c004c03c008dd7180680098049baa0051625333007300430083754002264646464a66601c60220042930b1bae300f001300f002375c601a00260126ea8004588c94ccc01cc0100044c8c94ccc030c03c00852616375c601a00260126ea800854ccc01cc00c0044c8c94ccc030c03c00852616375c601a00260126ea800858c01cdd50009b8748008dc3a4000ae6955ceaab9e5573eae815d0aba24c0126d8799fd87a9f581c96f5c1bee23481335ff4aece32fe1dfa1aa40a944a66d2d6edc9a9a5ffff0001"
    };
  }
  estimatedGive(liquidityPool, swapOutToken, swapOutAmount) {
    const [reserveOut, reserveIn] = correspondingReserves(liquidityPool, swapOutToken);
    return reserveIn * reserveOut / (reserveOut - swapOutAmount) - reserveIn;
  }
  estimatedReceive(liquidityPool, swapInToken, swapInAmount) {
    const [reserveIn, reserveOut] = correspondingReserves(liquidityPool, swapInToken);
    return reserveOut - reserveIn * reserveOut / (reserveIn + swapInAmount);
  }
  priceImpactPercent(liquidityPool, swapInToken, swapInAmount) {
    if (!liquidityPool.state) return 0;
    const reserveIn = tokensMatch(swapInToken, liquidityPool.tokenA) ? liquidityPool.state.reserveA : liquidityPool.state.reserveB;
    return (1 - Number(reserveIn) / Number(reserveIn + swapInAmount)) * 100;
  }
  async buildSwapOrder(liquidityPool, swapParameters, spendUtxos = []) {
    const batcherFee = this.swapOrderFees().find((fee) => fee.id === "batcherFee");
    const deposit = this.swapOrderFees().find((fee) => fee.id === "deposit");
    const minReceive = swapParameters.MinReceive;
    if (!batcherFee || !deposit || !minReceive) {
      return Promise.reject("Parameters for datum are not set.");
    }
    if (!this.dexter.dataProvider) {
      return Promise.reject("Data provider is required.");
    }
    const walletUtxos = await this.dexter.dataProvider.utxos(
      swapParameters["Address" /* Address */],
      swapParameters["SwapInTokenPolicyId" /* SwapInTokenPolicyId */] !== "" ? new Asset2(swapParameters.SwapInTokenPolicyId, swapParameters.SwapInTokenAssetName) : void 0
    );
    const firstUtxo = walletUtxos[0];
    const decimalToFractionalImproved = (decimalValue) => {
      const [whole, decimals = ""] = decimalValue.toString()?.split(".");
      let truncatedDecimals = decimals.slice(0, 15);
      const denominator2 = BigInt(10 ** truncatedDecimals.length);
      const numerator2 = BigInt(whole) * denominator2 + BigInt(decimals);
      return [numerator2, denominator2];
    };
    const swapOutToken = swapParameters.SwapOutTokenPolicyId === "lovelace" ? "lovelace" : new Asset2(swapParameters.SwapOutTokenPolicyId, swapParameters.SwapOutTokenAssetName);
    const price = formatDigits(liquidityPool.price, 8);
    const outDecimals = swapOutToken === "lovelace" ? 6 : tokensMatch(swapOutToken, liquidityPool.tokenA) ? liquidityPool.tokenA.decimals ?? 0 : liquidityPool.tokenB.decimals ?? 0;
    const [numerator, denominator] = decimalToFractionalImproved(price);
    swapParameters = {
      ...swapParameters,
      ["Action" /* Action */]: "00",
      ["BaseFee" /* BaseFee */]: WORST_ORDER_STEP_COST,
      ["ExecutionFee" /* ExecutionFee */]: EXECUTOR_FEE,
      ["LpFeeNumerator" /* LpFeeNumerator */]: numerator,
      ["LpFeeDenominator" /* LpFeeDenominator */]: denominator,
      ["Beacon" /* Beacon */]: bytesToHex(Uint8Array.from(new Array(28).fill(0))),
      ["Batcher" /* Batcher */]: this.batcherKey
    };
    const datumBuilder = new DefinitionBuilder();
    await datumBuilder.loadDefinition(order_default8).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    const hash = blake2b(28).update(hexToBytes(datumBuilder.getCbor())).digest("hex");
    swapParameters.Beacon = this.getBeacon(firstUtxo, hash);
    await datumBuilder.loadDefinition(order_default8).then((builder) => {
      builder.pushParameters(swapParameters);
    });
    return [
      this.buildSwapOrderPayment(swapParameters, {
        address: lucidUtils.credentialToAddress(
          {
            type: "Script",
            hash: this.orderScriptHash
          },
          {
            type: "Key",
            hash: swapParameters.SenderStakingKeyHash
          }
        ),
        addressType: 0 /* Contract */,
        assetBalances: [
          {
            asset: "lovelace",
            quantity: 1500000n + batcherFee?.value + deposit.value
          }
        ],
        datum: datumBuilder.getCbor(),
        isInlineDatum: true,
        spendUtxos: spendUtxos.concat({ utxo: firstUtxo })
      })
    ];
  }
  async buildCancelSwapOrder(txOutputs, returnAddress) {
    const relevantUtxo = txOutputs.find((utxo) => {
      const addressDetails = lucidUtils.getAddressDetails(utxo.address);
      return (addressDetails.paymentCredential?.hash ?? "") === this.orderScriptHash;
    });
    if (!relevantUtxo) {
      return Promise.reject("Unable to find relevant UTxO for cancelling the swap order.");
    }
    return [
      {
        address: returnAddress,
        addressType: 1 /* Base */,
        assetBalances: relevantUtxo.assetBalances,
        isInlineDatum: false,
        spendUtxos: [{
          utxo: relevantUtxo,
          redeemer: this.cancelDatum,
          validator: this.orderScript,
          signer: returnAddress
        }]
      }
    ];
  }
  swapOrderFees() {
    return [
      {
        id: "batcherFee",
        title: "Batcher Fee",
        description: "Fee paid for the service of off-chain batcher to process transactions.",
        value: EXECUTOR_FEE,
        isReturned: false
      },
      {
        id: "deposit",
        title: "Deposit",
        description: "This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.",
        value: 2000000n,
        isReturned: true
      }
    ];
  }
  getBeacon(utxo, datumHash) {
    return blake2b(28).update(
      Uint8Array.from([
        ...hexToBytes(utxo.txHash),
        ...new Uint64BE(Number(utxo.outputIndex)).toArray(),
        ...new Uint64BE(0).toArray(),
        ...hexToBytes(datumHash)
      ])
    ).digest("hex");
  }
};
Splash.identifier = "Splash";

// src/dexter.ts
var Dexter = class {
  constructor(config = {}, requestConfig = {}) {
    this.config = Object.assign(
      {},
      {
        shouldFetchMetadata: true,
        shouldFallbackToApi: true,
        shouldSubmitOrders: false,
        metadataMsgBranding: "Dexter"
      },
      config
    );
    this.requestConfig = Object.assign(
      {},
      {
        timeout: 5e3,
        proxyUrl: "",
        retries: 3
      },
      requestConfig
    );
    axiosRetry(axios, { retries: this.requestConfig.retries });
    axios.defaults.timeout = this.requestConfig.timeout;
    this.availableDexs = {
      [Minswap.identifier]: new Minswap(this),
      [SundaeSwap.identifier]: new SundaeSwap(this),
      [SundaeSwapV3.identifier]: new SundaeSwapV3(this),
      [MinswapV2.identifier]: new MinswapV2(this),
      [MuesliSwap.identifier]: new MuesliSwap(this),
      [WingRiders.identifier]: new WingRiders(this),
      [WingRidersV2.identifier]: new WingRidersV2(this),
      [Splash.identifier]: new Splash(this)
    };
  }
  /**
   * Retrieve DEX instance from unique name.
   */
  dexByName(name) {
    return this.availableDexs[name];
  }
  /**
   * Switch to a new data provider.
   */
  withDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    return this;
  }
  /**
   * Switch to a new wallet provider.
   */
  withWalletProvider(walletProvider) {
    this.walletProvider = walletProvider;
    return this;
  }
  /**
   * New request for a swap order.
   */
  newSwapRequest() {
    return new SwapRequest(this);
  }
  /**
   * New request for a split swap order.
   */
  newSplitSwapRequest() {
    return new SplitSwapRequest(this);
  }
  /**
   * New request for cancelling a swap order.
   */
  newCancelSwapRequest() {
    if (!this.walletProvider) {
      throw new Error("Wallet provider must be set before requesting a cancel order.");
    }
    if (!this.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before requesting a cancel order.");
    }
    return new CancelSwapRequest(this);
  }
  /**
   * New request for a split cancel swap order.
   */
  newSplitCancelSwapRequest() {
    if (!this.walletProvider) {
      throw new Error("Wallet provider must be set before requesting a split cancel order.");
    }
    if (!this.walletProvider.isWalletLoaded) {
      throw new Error("Wallet must be loaded before requesting a split cancel order.");
    }
    return new SplitCancelSwapRequest(this);
  }
};

// src/providers/wallet/base-wallet-provider.ts
var BaseWalletProvider = class {
};

// src/dex/models/dex-transaction.ts
var DexTransaction = class {
  constructor(walletProvider) {
    this.providerData = {};
    this.error = void 0;
    this._isSigned = false;
    this._payments = [];
    this._currentStatus = 0 /* Building */;
    this._listeners = [];
    this._walletProvider = walletProvider;
  }
  get hash() {
    return this._hash;
  }
  get isSigned() {
    return this._isSigned;
  }
  get payments() {
    return this._payments;
  }
  get status() {
    return this._currentStatus;
  }
  set status(status) {
    this._currentStatus = status;
    this._listeners.forEach((callback) => {
      callback(this);
    });
  }
  attachMetadata(key, json) {
    return this._walletProvider.attachMetadata(this, key, json);
  }
  payToAddresses(payToAddresses) {
    return this._walletProvider.paymentsForTransaction(this, payToAddresses).then(() => {
      this._payments = payToAddresses;
      return this;
    });
  }
  sign() {
    if (this._isSigned) {
      throw new Error("Transaction was already signed.");
    }
    return this._walletProvider.signTransaction(this).then(() => {
      this._isSigned = true;
      return this;
    });
  }
  submit() {
    if (!this._isSigned) {
      throw new Error("Must sign transaction before submitting.");
    }
    if (this._hash) {
      throw new Error("Transaction was already submitted.");
    }
    return this._walletProvider.submitTransaction(this).then((txHash) => {
      this._hash = txHash;
      return this;
    });
  }
  onBuilding(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 0 /* Building */) {
        callback(transaction);
      }
    });
    return this;
  }
  onSigning(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 1 /* Signing */) {
        callback(transaction);
      }
    });
    return this;
  }
  onSubmitting(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 2 /* Submitting */) {
        callback(transaction);
      }
    });
    return this;
  }
  onSubmitted(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 3 /* Submitted */) {
        callback(transaction);
      }
    });
    return this;
  }
  onError(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 4 /* Errored */) {
        callback(transaction);
      }
    });
    return this;
  }
  onFinally(callback) {
    this.addListener((transaction) => {
      if (transaction.status === 3 /* Submitted */ || transaction.status === 4 /* Errored */) {
        callback(transaction);
      }
    });
    return this;
  }
  addListener(callback) {
    this._listeners.push(callback);
  }
};

// src/providers/wallet/mock-wallet-provider.ts
var MockWalletProvider = class extends BaseWalletProvider {
  constructor() {
    super();
    this.isWalletLoaded = false;
    this._usableAddress = "addr1test";
    this._paymentCredential = "ed56";
    this._stakingCredential = "bac6";
  }
  address() {
    return this._usableAddress;
  }
  publicKeyHash() {
    return this._paymentCredential;
  }
  stakingKeyHash() {
    return this._stakingCredential;
  }
  loadWallet(walletApi) {
    this.isWalletLoaded = true;
    return Promise.resolve(this);
  }
  loadWalletFromSeedPhrase(seed, options = {}) {
    this.isWalletLoaded = true;
    return Promise.resolve(this);
  }
  createTransaction() {
    return new DexTransaction(this);
  }
  attachMetadata(transaction, key, json) {
    return transaction;
  }
  paymentsForTransaction(transaction, payToAddresses) {
    return Promise.resolve(transaction);
  }
  signTransaction(transaction) {
    return Promise.resolve(transaction);
  }
  submitTransaction(transaction) {
    return Promise.resolve("hashtest");
  }
};

// src/providers/wallet/lucid-provider.ts
import {
  Blockfrost,
  Kupmios,
  Lucid as Lucid2
} from "lucid-cardano";
var LucidProvider = class extends BaseWalletProvider {
  constructor() {
    super(...arguments);
    this.isWalletLoaded = false;
    this._network = "Mainnet";
  }
  address() {
    return this._usableAddress;
  }
  publicKeyHash() {
    return this._paymentCredential;
  }
  stakingKeyHash() {
    return this._stakingCredential ?? "";
  }
  loadWallet(walletApi, config) {
    return this.loadLucid(config).then((lucid) => {
      this._api = lucid;
      this._api.selectWallet(walletApi);
      return this.loadWalletInformation();
    });
  }
  loadWalletFromSeedPhrase(seed, options = {}, config) {
    return this.loadLucid(config).then((lucid) => {
      this._api = lucid;
      const addressType = options.addressType === 2 /* Enterprise */ ? "Enterprise" : "Base";
      this._api.selectWalletFromSeed(
        seed.join(" "),
        {
          addressType,
          accountIndex: options.accountIndex ?? 0
        }
      );
      return this.loadWalletInformation();
    });
  }
  createTransaction() {
    const transaction = new DexTransaction(this);
    transaction.providerData.tx = this._api.newTx();
    return transaction;
  }
  attachMetadata(transaction, key, json) {
    if (!transaction.providerData.tx) {
      return transaction;
    }
    return transaction;
  }
  async paymentsForTransaction(transaction, payToAddresses) {
    payToAddresses.forEach((payToAddress) => {
      const payment = this.paymentFromAssets(payToAddress.assetBalances);
      if (payToAddress.spendUtxos && payToAddress.spendUtxos.length > 0) {
        payToAddress.spendUtxos.forEach((spendUtxo) => {
          transaction.providerData.tx.collectFrom([
            {
              txHash: spendUtxo.utxo.txHash,
              outputIndex: spendUtxo.utxo.outputIndex,
              address: spendUtxo.utxo.address,
              datumHash: spendUtxo.utxo.datum ? null : spendUtxo.utxo.datumHash,
              datum: spendUtxo.utxo.datum,
              assets: this.paymentFromAssets(spendUtxo.utxo.assetBalances)
            }
          ], spendUtxo.redeemer);
          if (spendUtxo.validator) {
            transaction.providerData.tx.attachSpendingValidator(spendUtxo.validator);
          }
          if (spendUtxo.signer) {
            transaction.providerData.tx.addSigner(spendUtxo.signer);
          }
        });
      }
      switch (payToAddress.addressType) {
        case 0 /* Contract */:
          transaction.providerData.tx.payToContract(
            payToAddress.address,
            payToAddress.isInlineDatum ? {
              inline: payToAddress.datum
            } : payToAddress.datum,
            payment
          );
          break;
        case 1 /* Base */:
        case 2 /* Enterprise */:
          transaction.providerData.tx.payToAddress(
            payToAddress.address,
            payment
          );
          break;
        default:
          throw new Error("Encountered unknown address type.");
      }
    });
    return transaction.providerData.tx.complete().then((tx) => {
      transaction.providerData.tx = tx;
      return transaction;
    });
  }
  signTransaction(transaction) {
    if (!this.isWalletLoaded) {
      throw new Error("Must load wallet before signing transaction.");
    }
    return transaction.providerData.tx.sign().complete().then((signedTx) => {
      transaction.providerData.tx = signedTx;
      return transaction;
    });
  }
  submitTransaction(transaction) {
    return transaction.providerData.tx.submit().then((txHash) => {
      return txHash;
    });
  }
  setNetwork(network) {
    this._network = network;
  }
  paymentFromAssets(assetBalances) {
    return assetBalances.reduce((payment, assetBalance) => {
      payment[assetBalance.asset === "lovelace" ? "lovelace" : assetBalance.asset.identifier()] = assetBalance.quantity;
      return payment;
    }, {});
  }
  loadWalletInformation() {
    return this._api.wallet.address().then((address) => {
      const details = this._api.utils.getAddressDetails(
        address
      );
      this._usableAddress = address;
      this._paymentCredential = details.paymentCredential?.hash ?? "";
      this._stakingCredential = details.stakeCredential?.hash ?? "";
      this.isWalletLoaded = true;
      return this;
    });
  }
  loadLucid(config) {
    return Lucid2.new(
      "kupoUrl" in config ? new Kupmios(
        config.kupoUrl,
        config.ogmiosUrl
      ) : new Blockfrost(
        config.url,
        config.projectId
      ),
      this._network
    );
  }
};

// src/providers/data/base-data-provider.ts
var BaseDataProvider = class {
};

// src/providers/data/blockfrost-provider.ts
import axios2 from "axios";
import Bottleneck from "bottleneck";
import { Asset as Asset3 } from "@indigo-labs/iris-sdk";
var API_BURST_SIZE = 500;
var API_COOLDOWN_SIZE = 10;
var API_COOLDOWN_MS = 1e3;
var BlockfrostProvider = class extends BaseDataProvider {
  /**
   * https://docs.blockfrost.io/
   */
  constructor(config, requestConfig = {}) {
    super();
    this._requestConfig = Object.assign(
      {},
      {
        timeout: 5e3,
        proxyUrl: ""
      },
      requestConfig
    );
    this._api = axios2.create({
      baseURL: appendSlash(requestConfig.proxyUrl) + config.url,
      timeout: this._requestConfig.timeout,
      headers: {
        "Content-Type": "application/json",
        project_id: config.projectId
      }
    });
    this._limiter = new Bottleneck({
      reservoir: API_BURST_SIZE,
      reservoirIncreaseAmount: API_COOLDOWN_SIZE,
      reservoirIncreaseInterval: API_COOLDOWN_MS,
      reservoirIncreaseMaximum: API_BURST_SIZE
    });
  }
  /**
   * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos/get
   * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos~1%7Basset%7D/get
   */
  async utxos(address, asset) {
    return this.sendPaginatedRequest(`/addresses/${address}/utxos/${asset ? asset.identifier() : ""}`).then((results) => {
      return results.map((utxo) => {
        return {
          txHash: utxo.tx_hash,
          address: utxo.address,
          datumHash: utxo.data_hash,
          outputIndex: utxo.output_index,
          assetBalances: utxo.amount.reduce((assets, amount) => {
            assets.push({
              asset: amount.unit === "lovelace" ? amount.unit : Asset3.fromIdentifier(amount.unit),
              quantity: BigInt(amount.quantity)
            });
            return assets;
          }, [])
        };
      });
    });
  }
  /**
   * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
   */
  async transactionUtxos(txHash) {
    return this._limiter.schedule(() => this._api.get(`/txs/${txHash}/utxos`)).then((response) => {
      return response.data.outputs.map((utxo) => {
        return {
          txHash: response.data.hash,
          address: utxo.address,
          datumHash: utxo.data_hash,
          datum: utxo.inline_datum,
          outputIndex: utxo.output_index,
          assetBalances: utxo.amount.reduce((assets, amount) => {
            assets.push({
              asset: amount.unit === "lovelace" ? amount.unit : Asset3.fromIdentifier(amount.unit),
              quantity: BigInt(amount.quantity)
            });
            return assets;
          }, [])
        };
      });
    });
  }
  /**
   * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
   */
  async assetTransactions(asset) {
    return this.sendPaginatedRequest(`/assets/${asset.identifier()}/transactions`).then((results) => {
      return results.map((tx) => {
        return {
          hash: tx.tx_hash
        };
      });
    });
  }
  /**
   * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
   */
  async assetAddresses(asset) {
    return this.sendPaginatedRequest(`/assets/${asset.identifier()}/addresses`).then((results) => {
      return results.map((result) => {
        return {
          address: result.address,
          quantity: BigInt(result.quantity)
        };
      });
    });
  }
  /**
   * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
   */
  async datumValue(datumHash) {
    return this._limiter.schedule(() => this._api.get(`/scripts/datum/${datumHash}`)).then((response) => {
      return response.data.json_value;
    });
  }
  /**
   * https://docs.blockfrost.io/#section/Concepts
   */
  sendPaginatedRequest(url, page = 1, results = []) {
    return this._limiter.schedule(
      () => this._api.get(url, {
        params: {
          page
        }
      })
    ).then((response) => {
      results = results.concat(response.data);
      page++;
      if (response.data.length === 100) {
        return this.sendPaginatedRequest(url, page, results);
      }
      return results;
    });
  }
};

// src/providers/data/kupo-provider.ts
import axios3 from "axios";
import { Data } from "lucid-cardano";
import { Asset as Asset4 } from "@indigo-labs/iris-sdk";
var KupoProvider = class extends BaseDataProvider {
  constructor(config, requestConfig = {}) {
    super();
    this._requestConfig = Object.assign(
      {},
      {
        timeout: 5e3,
        proxyUrl: ""
      },
      requestConfig
    );
    this._config = config;
    this._kupoApi = axios3.create({
      baseURL: appendSlash(requestConfig.proxyUrl) + config.url,
      timeout: this._requestConfig.timeout,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  async utxos(address, asset) {
    const url = asset ? `/matches/${address}?policy_id=${asset.policyId}&asset_name=${asset.nameHex}&unspent` : `/matches/${address}?unspent`;
    return this._kupoApi.get(url).then((results) => {
      return this.toUtxos(results.data);
    });
  }
  async transactionUtxos(txHash) {
    return this._kupoApi.get(`/matches/*@${txHash}`).then((results) => {
      return this.toUtxos(results.data);
    });
  }
  async datumValue(datumHash) {
    return this._kupoApi.get(`/datums/${datumHash}`).then((result) => {
      if (!result.data.datum) {
        throw new Error("Datum hash not found.");
      }
      return this.toDefinitionDatum(Data.from(result.data.datum));
    });
  }
  async assetTransactions(asset) {
    return this._kupoApi.get(`/matches/${asset.identifier(".")}`).then((results) => {
      return results.data.map((result) => {
        return {
          hash: result.transaction_id
        };
      });
    });
  }
  async assetAddresses(asset) {
    return this._kupoApi.get(`/matches/${asset.identifier(".")}?unspent`).then((results) => {
      return results.data.map((result) => {
        return {
          address: result.address,
          quantity: BigInt(result.value.assets[asset.identifier(".")])
        };
      });
    });
  }
  toUtxos(results) {
    return results.map((utxo) => {
      return {
        txHash: utxo.transaction_id,
        address: utxo.address,
        datumHash: utxo.datum_hash,
        outputIndex: utxo.output_index,
        assetBalances: (() => {
          const balances = [
            {
              asset: "lovelace",
              quantity: BigInt(utxo.value.coins)
            }
          ];
          Object.keys(utxo.value.assets).forEach((unit) => {
            balances.push({
              asset: Asset4.fromIdentifier(unit),
              quantity: BigInt(utxo.value.assets[unit])
            });
          });
          return balances;
        })()
      };
    });
  }
  toDefinitionDatum(unconstructedField) {
    if (unconstructedField?.fields) {
      return {
        constructor: unconstructedField.index,
        fields: unconstructedField.fields.map((field) => this.toDefinitionDatum(field))
      };
    }
    if (typeof unconstructedField === "bigint") {
      return {
        int: Number(unconstructedField)
      };
    }
    if (typeof unconstructedField === "string") {
      return {
        bytes: unconstructedField
      };
    }
    return unconstructedField;
  }
};
export {
  AddressType,
  BaseDex,
  BaseWalletProvider,
  BlockfrostProvider,
  CancelSwapRequest,
  DatumParameterKey,
  DefinitionBuilder,
  DexTransaction,
  Dexter,
  KupoProvider,
  LucidProvider,
  MetadataKey,
  Minswap,
  MinswapV2,
  MockWalletProvider,
  MuesliSwap,
  Splash,
  SplitCancelSwapRequest,
  SplitSwapRequest,
  SundaeSwap,
  SundaeSwapV3,
  SwapRequest,
  TransactionStatus,
  WingRiders,
  WingRidersV2,
  appendSlash,
  bytesToHex,
  correspondingReserves,
  datumJsonToCbor,
  determineAddressType,
  formatDigits,
  hexToBytes,
  lucidUtils,
  tokensMatch
};
