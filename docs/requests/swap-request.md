<p align="center">
  <h1 align="center">Swap Request</h1>
</p>

All calculations for your swap parameters are DEX specific. For example, the estimated receive might be different on one DEX
vs another given the same values due to DEXs using different formulas for their calculations.

### Obtaining
```js
dexter.newSwapRequest()
    ...
```

### SwapRequest API

<details>
<summary><code>forLiquidityPool(LiquidityPool): SwapRequest</code> Set which Liquidity Pool to swap from.</summary>

##### Using

```js
dexter.newSwapRequest()
    .forLiquidityPool(new LiquidityPool(...))
    ...
```
</details>

<br>

<details>
<summary><code>withSwapInToken(Token): SwapRequest</code> Set which Token in the pool you are swapping in.</summary>

##### Using

```js
dexter.newSwapRequest()
    .withSwapInToken('lovelace')
    ...
```
</details>

<br>

<details>
<summary><code>withSwapOutToken(Token): SwapRequest</code> Set which Token in the pool you are swapping out.</summary>

##### Using

```js
dexter.newSwapRequest()
    .withSwapOutToken('lovelace')
    ...
```
</details>

<br>

<details>
<summary><code>withSwapInAmount(bigint): SwapRequest</code> Set how much you are swapping in.</summary>

##### Using

```js
dexter.newSwapRequest()
    .withSwapInAmount(10_000000n)
    ...
```
</details>

<br>

<details>
<summary><code>withSwapOutAmount(bigint): SwapRequest</code> Set how much you are swapping out.</summary>

##### Using

```js
dexter.newSwapRequest()
    .withSwapOutAmount(10_000000n)
    ...
```
</details>

<br>

<details>
<summary><code>withMinimumReceive(bigint): SwapRequest</code> Set the minimum you want to receive.</summary>

##### Using

```js
dexter.newSwapRequest()
    .withMinimumReceive(10_000000n)
    ...
```
</details>

<br>

<details>
<summary><code>withSlippagePercent(number): SwapRequest</code> Set how much slippage you will tolerate. (Default: 1.0%)</summary>

##### Using

```js
dexter.newSwapRequest()
    .withSlippagePercent(0.5)
    ...
```
</details>

<br>

<details>
<summary><code>flip(): SwapRequest</code> Flip your swap in and swap out token.</summary>

Flipping will only affect the swap in & swap out token if the swap in token was set beforehand.

##### Using

```js
dexter.newSwapRequest()
    .flip()
    ...
```
</details>

<br>

<details>
<summary><code>getEstimatedReceive(LiquidityPool?): bigint</code> Get the <i>estimated</i> receive for your swap.</summary>

Supplying a liquidity pool will run against the provided pool. This is useful when getting the estimated receive for pools with the 
same tokens, but on different DEXs.

##### Using

```js
dexter.newSwapRequest()
    .getEstimatedReceive()
```
</details>

<br>

<details>
<summary><code>getMinimumReceive(LiquidityPool?): bigint</code> Get the <i>minimum</i> receive for your swap.</summary>

Supplying a liquidity pool will run against the provided pool. This is useful when getting the minimum receive for pools with the 
same tokens, but on different DEXs.

##### Using

```js
dexter.newSwapRequest()
    .getMinimumReceive()
```
</details>

<br>

<details>
<summary><code>getPriceImpactPercent(): number</code> Get the price impact percentage for your swap.</summary>

Supplying a liquidity pool will run against the provided pool. This is useful when getting the minimum receive for pools with the 
same tokens, but on different DEXs.

##### Using

```js
dexter.newSwapRequest()
    .getPriceImpactPercent()
```
</details>

<br>

<details>
<summary><code>getSwapFees(): SwapFee[]</code> Get the DEX specific fees for your swap.</summary>

##### Using

```js
dexter.newSwapRequest()
    .getSwapFees()
```
</details>

<br>

<details>
<summary><code>submit(): DexTransaction</code> Finally submit your swap on-chain.</summary>

##### Using

```js
dexter.newSwapRequest()
    ...
    .submit()
```
</details>
