<p align="center">
  <h1 align="center">Cancel Swap Request</h1>
</p>

### Obtaining
```js
dexter.newCancelSwapRequest()
    ...
```

### CancelSwapRequest API

<details>
<summary><code>forTransaction(string): CancelSwapRequest</code> Set which transaction to cancel from, given the Tx hash.</summary>

##### Using

```js
dexter.newCancelSwapRequest()
    .forTransaction('abc...')
    ...
```
</details>

<br>

<details>
<summary><code>forDex(string): CancelSwapRequest</code> Set which DEX the transaction came from.</summary>

##### Using

```js
dexter.newCancelSwapRequest()
    .forDex(VyFinance.identifier)
    ...
```
</details>

<br>

<details>
<summary><code>cancel(): DexTransaction</code> Submit the transaction to cancel your order.</summary>

Transaction & DEX must be set beforehand.

##### Using

```js
dexter.newCancelSwapRequest()
    ...
    .cancel()
```
</details>