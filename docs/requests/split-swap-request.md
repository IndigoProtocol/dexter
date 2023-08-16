<p align="center">
  <h1 align="center">Split Swap Request</h1>
</p>

Request a split order request in order to split your swap order into chunks on different DEXs.

### Obtaining
```js
dexter.newSplitSwapRequest()
    ...
```

### SwapRequest API

<details>
<summary><code>withSwapInToken(Token): SplitSwapRequest</code> Set which Token in the pool you are swapping in.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .withSwapInToken('lovelace')
    ...
```
</details>

<br>

<details>
<summary><code>withSwapOutToken(Token): SplitSwapRequest</code> Set which Token in the pool you are swapping out.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .withSwapOutToken('lovelace')
    ...
```
</details>

<br>

<details>
<summary><code>withSwapInAmountMappings(SwapInAmountMapping[]): SplitSwapRequest</code> Set how much you are swapping in for each DEX.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .withSwapInAmountMappings([
        {
            swapInAmount: 2_000000n,
            liquidityPool: new LiquidityPool(Minswap.identifier, ...)
        },
        {
            swapInAmount: 5_000000n,
            liquidityPool: new LiquidityPool(WingRiders.identifier, ...)
        },
    ])
    ...
```
</details>

<br>

<details>
<summary><code>withSwapOutAmountMappings(SwapOutAmountMapping[]): SplitSwapRequest</code> Set how much you are swapping out for each DEX.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .withSwapOutAmountMappings([
        {
            swapInAmount: 2_000000n,
            liquidityPool: new LiquidityPool(Minswap.identifier, ...)
        },
        {
            swapInAmount: 5_000000n,
            liquidityPool: new LiquidityPool(WingRiders.identifier, ...)
        },
    ])
```
</details>

<br>

<details>
<summary><code>flip(): SplitSwapRequest</code> Flip your swap in and swap out token.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .flip()
    ...
```
</details>

<br>

<details>
<summary><code>withSlippagePercent(number): SplitSwapRequest</code> Set how much slippage you will tolerate. (Default: 1.0%)</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    .withSlippagePercent(0.5)
    ...
```
</details>

<br>

<details>
<summary><code>getEstimatedReceive(): bigint</code> Get the total <i>estimated</i> receive for your swap.</summary>

Will return a sum of the estimated receive for each DEX mapping.

##### Using

```js
dexter.newSplitSwapRequest()
    .getEstimatedReceive()
```
</details>

<br>

<details>
<summary><code>getMinimumReceive(): bigint</code> Get the total <i>minimum</i> receive for your swap.</summary>

Will return a sum of the minimum receive for each DEX mapping.

##### Using

```js
dexter.newSplitSwapRequest()
    .getMinimumReceive()
```
</details>

<br>

<details>
<summary><code>getAvgPriceImpactPercent(): number</code> Get the average price impact percentage for your swap.</summary>

Will return the average price impact for each swap on each DEX.

##### Using

```js
dexter.newSplitSwapRequest()
    .getAvgPriceImpactPercent()
```
</details>

<br>

<details>
<summary><code>getSwapFees(): SwapFee[]</code> Get the DEX specific fees for your swap.</summary>

Will return all swap fees associated with each DEX in the swap.

##### Using

```js
dexter.newSplitSwapRequest()
    .getSwapFees()
```
</details>

<br>

<details>
<summary><code>submit(): DexTransaction</code> Finally submit your split swap on-chain.</summary>

##### Using

```js
dexter.newSplitSwapRequest()
    ...
    .submit()
```
</details>
