<p align="center">
  <h1 align="center">Return Models</h1>
</p>

Below are commonly returned models & types for your requests, along with example data.

### Asset
```js
{
    policyId: string     // '533bb94a8850ee3c...'
    nameHex: Token       // '494e4459'
    decimals: Token      // 6
}
```

### LiquidityPool
```js
{
    dex: string                 // Minswap
    assetA: Token               // Asset || 'lovelace'
    assetB: Token               // Asset || 'lovelace'
    reserveA: bigint            // 1234_000000n
    reserveB: bigint            // 5678_000000n
    address: string             // 'addr1LiquidityPoolAddress...'
    marketOrderAddress: string  // 'addr1...'
    limitOrderAddress: string   // 'addr1...'
}

```
### SwapFee
```js
{
    id: string           // 'batcherFee'
    title: string        // 'Batcher Fee'
    description: string  // 'Fee paid for the service of off-chain Laminar batcher to process transactions.'
    value: bigint        // 2_000000n
    isReturned: boolean  // false
}
```

### DexTransaction
See [doc](dex-transaction.md) for more information
