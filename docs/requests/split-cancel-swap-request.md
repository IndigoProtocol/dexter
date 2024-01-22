<p align="center">
  <h1 align="center">Split Cancel Swap Request</h1>
</p>

Request a split cancel order request in order to split your cancel order into chunks on different DEXs.

### Obtaining
```js
dexter.newSplitCancelSwapRequest()
    ...
```

### SwapRequest API

<details>
<summary><code>forTransactions(SplitCancelSwapMapping[]): SplitSwapRequest</code> Set which transactions to cancel.</summary>

##### Using

```js
dexter.newSplitCancelSwapRequest()
    .forTransactions([{ txHash: '{Tx Hash}', dex: 'Minswap' }])
    ...
```
</details>

<br>

<details>
<summary><code>submit(): DexTransaction</code> Finally submit your split cancel orders on-chain.</summary>

##### Using

```js
dexter.newSplitCancelSwapRequest()
    ...
    .submit()
```
</details>
