
# Dexter


### Instantiation
```js
const dexter: Dexter = new Dexter(
    new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', '{project-id}')
);
```

### Dexter Requests
#### Liquidity Pools
```js
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
    .then((response: DexterResponse) => {
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
            [DatumParameterKeys.PubKeyHash]: '9c8cc3ac2810e440ae1d0d41c4d7cbf79b860b5f315f8d4ed8350d81',
            [DatumParameterKeys.StakingKeyHash]: '9c68111e7899b27497c7d97964488aaa9fe55370d2c5f2d68093e338',
            [DatumParameterKeys.SwapOutTokenPolicyId]: 'f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880',
            [DatumParameterKeys.SwapOutTokenAssetName]: '69555344',
            [DatumParameterKeys.MinReceive]: 123456,
            [DatumParameterKeys.BatcherFee]: 200000,
            [DatumParameterKeys.DepositFee]: 200000,
        });

        // Get the CBOR
        builder.getCbor()
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