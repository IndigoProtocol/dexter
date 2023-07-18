<p align="center">
  <h1 align="center">DEX Transactions</h1>
</p>

You should never have to create DEX transactions yourself. However, the documentation below gives a rundown
on how you can obtain information for your swap transactions, as well as listen for specific events through the Tx lifecycle.

### Getters

<details>
<summary><code>hash(): string</code> Get the Tx hash if available</summary>

##### Using

```js
console.log(transaction.hash);
```
</details>

<br>

<details>
<summary><code>isSigned(): boolean</code> Get whether the Tx has been signed</summary>

##### Using

```js
console.log(transaction.isSigned);
```
</details>

<br>

<details>
<summary><code>payments(): PayToAddress[]</code> Get the address payments made for the Tx</summary>

##### Using

```js
console.log(transaction.payments);
```
</details>

<br>

<details>
<summary><code>status(): TransactionStatus</code> Get the current status of the transaction</summary>

##### Using

```js
console.log(transaction.status);
```
</details>

### Listen for Events

<details>
<summary><code>onBuilding(TransactionCallback): DexTransaction</code> Tx is in building status</summary>

##### Using

```js
transaction.onBuilding(() => {
    console.log('Tx building');
});
```
</details>

<br>

<details>
<summary><code>onSigning(TransactionCallback): DexTransaction</code> Tx is in signing status</summary>

##### Using

```js
transaction.onSigning(() => {
    console.log('Tx signing');
});
```
</details>

<br>

<details>
<summary><code>onSubmitting(TransactionCallback): DexTransaction</code> Tx is in submitting status</summary>

##### Using

```js
transaction.onSubmitting(() => {
    console.log('Tx submitting to chain');
});
```
</details>

<br>

<details>
<summary><code>onSubmitted(TransactionCallback): DexTransaction</code> Tx has been submitted on-chain</summary>

##### Using

```js
transaction.onSubmitted(() => {
    console.log('Tx submitted');
});
```
</details>

<br>

<details>
<summary><code>onError(TransactionCallback): DexTransaction</code> Error has occurred with the transaction</summary>

##### Using

```js
transaction.onError(() => {
    console.log('Something went wrong');
});
```
</details>

<br>

<details>
<summary><code>onFinally(TransactionCallback): DexTransaction</code> Everything went OK or error has occurred</summary>

##### Using

```js
transaction.onFinally(() => {
    console.log('All complete or has errored');
});
```
</details>