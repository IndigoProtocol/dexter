
# Dexter

### Dexter Requests
#### Liquidity Pools
```js
const dexter: Dexter = new Dexter(
    new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', '{project-id}')
);

// For a specific DEX
dexter.newRequest()
    .for(Minswap.name)
    ...

// For some available DEXs
dexter.newRequest()
    .for([Minswap.name, SundaeSwap.name])
    ...

// For all available DEXs
dexter.newRequest()
    .forAll()
    ...

// Full request
dexter.newRequest()
    .forAll()
    .getLiquidityPools(
        new Asset('533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0', '494e4459')
    )
    .then((response: LiquidityPoolGroups) => {
        console.log(response)
    });
```

#### Liquidity Pool History
```js
const lp: LiquidityPool = new LiquidityPool(...);

dexter.newRequest()
    .getLiquidityPoolHistory(lp)
    .then((pools: LiquidityPool[]) => {
        console.log(pools)
    });
```

### DatumBuilder
#### Using a definition template
```js
const builder: DatumBuilder = new DefinitionBuilder();

// Load Datum definition template
builder.loadDefinition('minswap/swap.js')
    .then((builder: DefinitionBuilder) => {
        // Push on your parameters
        builder.pushParameters({
            [DatumParameterKey.PubKeyHash]: '9c8cc3ac2810e440ae1d0d41c4d7cbf79b860b5f315f8d4ed8350d81',
            [DatumParameterKey.StakingKeyHash]: '9c68111e7899b27497c7d97964488aaa9fe55370d2c5f2d68093e338',
            [DatumParameterKey.SwapOutTokenPolicyId]: 'f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880',
            [DatumParameterKey.SwapOutTokenAssetName]: '69555344',
            [DatumParameterKey.MinReceive]: 123456,
            [DatumParameterKey.BatcherFee]: 200000,
            [DatumParameterKey.DepositFee]: 200000,
        });

        // Get the CBOR
        builder.getCbor();
    });
```

#### Pulling parameters from a constructed datum
```js
// Load Datum definition template
builder.loadDefinition('minswap/swap.js')
    .then((builder: DefinitionBuilder) => {
        // Pull parameters providing a datum JSON
        const parameters: DatumParameters[] = builder.pullParameters(
            { constructor: 0, fields: [ ... ] }
        );

        console.log(parameters);
    });
```

### Models
#### Asset
```js
Asset {
    policyId: '533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0',
    assetNameHex: '494e4459',
    decimals: 0
}
```

#### Liquidity Pool
```js
Liquidity Pool {
    totalLpTokens: 271937140896n,
    identifier: 'b003',
    poolFee: 0.003,
    dex: 'SundaeSwap',
    address: 'addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu',
    assetA: 'lovelace',
    assetB: Asset {
      policyId: '533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0',
      assetNameHex: '494e4459',
      decimals: 0
    },
    reserveA: 560644434405n,
    reserveB: 135657174555n,
    lpToken: Asset {
      policyId: '0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b913',
      assetNameHex: '6c7020b003',
      decimals: 0
    }
}
```