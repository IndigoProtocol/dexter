<p align="center">
  <h1 align="center">Fetch Request</h1>
</p>

### Obtaining
```js
dexter.newFetchRequest()
    ...
```

### FetchRequest API
Omitting the `forTokens()` & `forTokenPairs()` when constructing your request will result in all possible pools.

Omitting the `forDexs()` & `forAllDexs()` when constructing your request will result in all available DEXs to be used
when fetching pools. 

<details>
<summary><code>onDexs(string | string[]): FetchRequest</code> Set which DEXs to grab information for.</summary>

##### Using

```js
dexter.newFetchRequest()
    .onDexs(WingRiders.identifier)
    ...
```
or
```js
dexter.newFetchRequest()
    .onDexs([WingRiders.identifier, SundaeSwap.identifier])
    ...
```
</details>

<br>

<details>
<summary><code>onAllDexs(): FetchRequest</code> Grab information from <i>all</i> available DEXs.</summary>

##### Using

```js
dexter.newFetchRequest()
    .onAllDexs()
    ...
```
</details>

<br>

<details>
<summary><code>setDataProviderForDex(string, BaseDataProvider): FetchRequest</code> Force a data provider for a DEX.</summary>

##### Using

```js
dexter.newFetchRequest()
    .onAllDexs()
    ...
```
</details>

<br>

<details>
<summary><code>forTokens(Token[]): FetchRequest</code> Set filtering tokens when fetching liquidity pools</summary>

##### Using

```js
const indyAsset: Asset = new Asset('533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0', '494e4459', 6);

// Will only fetch pools containing the INDY token
dexter.newFetchRequest()
    .forTokens([indyAsset])
    ...
```
</details>

<br>

<details>
<summary><code>forTokenPairs(Token[][]): FetchRequest</code> Set filtering token pairs when fetching liquidity pools</summary>

##### Using

```js
const indyAsset: Asset = new Asset('533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a0', '494e4459', 6);

// Will only fetch pools containing ADA & INDY assets
dexter.newFetchRequest()
    .forTokenPairs([
        ['lovelace', indyAsset],
    ])
    ...
```
</details>

<br>

<details>
<summary><code>getLiquidityPools(): Promise&lt;LiquidityPool[]&gt;</code> Fetch liquidity pools from your set DEXs</summary>

Providing the first or first & second parameters will filter the returned pools by the assets you provide.

##### Using

```js
dexter.newFetchRequest()
    .onAllDexs()
    .getLiquidityPools()
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
