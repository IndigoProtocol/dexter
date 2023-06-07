<div align="center">
    <h1 align="center">Dexter</h1>
    <p align="center">Customizable Typescript SDK for interacting with Cardano DEXs.</p>
    <img src="./src/dex/logo/sundaeswap.png" width="30" />
    <img src="./src/dex/logo/minswap.png" width="30" /> 
    <img src="./src/dex/logo/muesliswap.png" width="30" />
    <img src="./src/dex/logo/wingriders.png" width="30" />
    <img src="./src/dex/logo/vyfinance.png" width="30" />
</div>

### What You Can Do
- Pull Liquidity Pools from DEX APIs or On-chain using [Blockfrost](https://blockfrost.io/) / [Kupo](https://github.com/CardanoSolutions/kupo)
- Submit and cancel swap orders
- Build your own data, wallet, or asset metadata providers to plug into Dexter
- Build swap datums given specific parameters using Dexters _Definition Builder_
- Load wallets using a seedphrase or CIP-30 interface using [Lucid](https://github.com/spacebudz/lucid)

### Install

##### NPM
```
npm install https://github.com/Sluder/dexter
```

##### Yarn
```
yarn add https://github.com/Sluder/dexter
```

### Quick Start

```js
const dexterConfig: DexterConfig = {
    shouldFetchMetadata: true,      // Whether to fetch asset metadata (Best to leave this `true` for accurate pool info)
    shouldFallbackToApi: true,      // Only use when using Blockfrost or Kupo as data providers. On failure, fallback to the DEX API to grab necessary data
    shouldSubmitOrders: false,      // Allow Dexter to submit orders from swap requests. Useful during development
    metadataMsgBranding: 'Dexter',  // Prepend branding name in Tx message
};
const requestConfig: RequestConfig = {
    timeout: 5000,  // How long outside network requests have to reply
    proxyUrl: '',   // URL to prepend to all outside URLs. Useful when dealing with CORs
};

const dexter: Dexter = new Dexter(dexterConfig, requestConfig);

// Basic fetch example
dexter.newFetchRequest()
    .forAllDexs()
    .getLiquidityPools()
    .then((pools: LiquidityPool[]) => {
        console.log(pools);
    });

// Example loading wallet to be used in a swap
const lucidProvider: BaseWalletProvider = new LucidProvider();

lucidProvider
    .loadWallet(cip30Interface, {
        url: 'https://cardano-mainnet.blockfrost.io/api/v0',
        projectId: '<blockfrost-project-id>'
    })
    .then((walletProvider: BaseWalletProvider) => {
        dexter.withWalletProvider(walletProvider)
            .newFetchRequest()
            ...
    });
```

### Dexter API
All providers outlined below are modular, so you can extend the 'base' of the specific provider you want to supply, and provide it
to Dexter with one of the methods below.

<details>
<summary><code>dexByName(string): BaseDex | undefined</code> Grab a DEX instance by name.</summary>

##### Using

```js
dexter.dexByName(Minswap.name)
    ...
```
</details>

<br>

<details>
<summary><code>withDataProvider(BaseDataProvider): Dexter</code> Set where Dexter should grab liquidity pool data.</summary>

By default, Dexter will use the DEX APIs to grab information. However, you can use [Blockfrost](./docs/providers/data.md) or [Kupo](./docs/providers/data.md) to supply your own data.

##### Using

```js
const provider: BaseDataProvider = new BlockfrostProvider(
    {
        url: 'https://cardano-mainnet.blockfrost.io/api/v0',
        projectId: '<blockfrost-project-id>',
    }
);

dexter.withDataProvider(provider)
    ...
```
</details>

<br>

<details>
<summary><code>withWalletProvider(BaseWalletProvider): Dexter</code> Set who Dexter sends wallet requests to.</summary>

At this time, Dexter only supplies a Mock wallet provider & a [Lucid provider](./docs/providers/wallet.md). Behind the scenes,
the lucid provider leverages [Lucid](https://github.com/spacebudz/lucid) to manage your wallet & create transactions.

##### Using

```js
const provider: BaseWalletProvider = new LucidProvider();
const seedphrase: string[] = ['...'];
const blockfrostConfig: BlockfrostConfig = {
    url: 'https://cardano-mainnet.blockfrost.io/api/v0',
    projectId: '<blockfrost-project-id>',
};

provider.loadWalletFromSeedPhrase(seedphrase, blockfrostConfig)
    .then((walletProvider: BaseWalletProvider) => {
        dexter.withWalletProvider(walletProvider)
            ...
    });
```
</details>

<br>

<details>
<summary><code>withMetadataProvider(BaseMetadataProvider): Dexter</code> Set where Dexter grabs necessary asset metadata.</summary>

By default, Dexter will use the [Cardano Token Registry](https://github.com/cardano-foundation/cardano-token-registry) for grabbing
asset metadata. You can extend the `BaseMetadataProvider` interface to provide your own metadata.

##### Using

```js
const provider: BaseMetadataProvider = new TokenRegistryProvider();

dexter.withMetadataProvider(provider)
    ...
```
</details>

<br>

<details>
<summary><code>newFetchRequest(): FetchRequest</code> Create new request for liquidity pool data.</summary>

For available methods on the `FetchRequest` instance, please see those specific [docs](./docs/requests/fetch-request.md).

##### Using

```js
dexter.newFetchRequest()
    ...
```
</details>

<br>

<details>
<summary><code>newSwapRequest(): SwapRequest</code> Create new request for a swap order.</summary>

For available methods on the `SwapRequest` instance, please see those specific [docs](./docs/requests/swap-request.md).

##### Using

```js
dexter.newSwapRequest()
    ...
```
</details>

<br>

<details>
<summary><code>newCancelSwapRequest(): CancelSwapRequest</code> Create new request for cancelling a swap order.</summary>

For available methods on the `CancelSwapRequest` instance, please see those specific [docs](./docs/requests/cancel-swap-request.md).

##### Using

```js
dexter.newCancelSwapRequest()
    ...
```
</details>

### More Docs
- [Data Providers](./docs/providers/data.md)
- [Wallet Providers](./docs/providers/wallet.md)
- [Creating a Fetch Request](./docs/requests/fetch-request.md)
- [Creating a Swap Request](./docs/requests/swap-request.md)
- [Creating a Cancel Swap Request](./docs/requests/cancel-swap-request.md)
- [Listening for transaction events](./docs/dex-transaction.md)
- [Commonly returned models](./docs/models.md)