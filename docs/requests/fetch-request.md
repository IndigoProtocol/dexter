<p align="center">
  <h1 align="center">Fetch Request</h1>
</p>

### Obtaining
```js
dexter.newFetchRequest()
    ...
```

### FetchRequest API

<details>
<summary><code>forDexs(string | string[]): FetchRequest</code> Set which DEXs to grab information for.</summary>

##### Using

```js
dexter.newFetchRequest()
    .forDexs(WingRiders.name)
    ...
```
or
```js
dexter.newFetchRequest()
    .forDexs([WingRiders.name, SundaeSwap.name])
    ...
```
</details>

<br>

<details>
<summary><code>forAllDexs(): FetchRequest</code> Grab information from <i>all</i> available DEXs.</summary>

##### Using

```js
dexter.newFetchRequest()
    .forAllDexs()
    ...
```
</details>

<br>

<details>
<summary><code>getLiquidityPools(Token, Token?): Promise&lt;LiquidityPool[]&gt;</code> Fetch liquidity pools from your set DEXs</summary>

Providing the first or first & second parameters will filter the returned pools by the assets you provide.

##### Using

```js
dexter.newFetchRequest()
    .forAllDexs()
    .getLiquidityPools('lovelace')
    .then((pools: LiquidityPool[]) => {
        console.log(pools);
    });
```
or
```js
const indyAsset: Asset = new Asset('533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0', '494e4459', 6);

dexter.newFetchRequest()
    .forAllDexs()
    .getLiquidityPools('lovelace', indyAsset)
    .then((pools: LiquidityPool[]) => {
        console.log(pools);
    });
```
</details>

<br>

<details>
<summary><code>getLiquidityPoolState(LiquidityPool): Promise&lt;LiquidityPool&gt;</code> Fetch latest state for a liquidity pool</summary>

##### Using

```js
dexter.newFetchRequest()
    .getLiquidityPoolState(liquidityPool)
    .then((pool: LiquidityPool) => {
        console.log(pool);
    });
```
</details>
