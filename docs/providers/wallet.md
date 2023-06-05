<p align="center">
  <h1 align="center">Wallet Providers</h1>
</p>

### Mock
```js
const mockProvider: BaseWalletProvider = new MockWalletProvider();
```

### Lucid
```js
const lucidProvider: BaseWalletProvider = new LucidProvider();
```

##### Lucid Blockfrost
```js
lucidProvider.loadWallet(walletApi, {
    url: 'https://cardano-mainnet.blockfrost.io/api/v0',
    projectId: '<blockfrost-project-id>',
})
```
or
```js
lucidProvider.loadWalletFromSeedPhrase(['...'], {}, {
    url: 'https://cardano-mainnet.blockfrost.io/api/v0',
    projectId: '<blockfrost-project-id>',
})
```

##### Lucid Kupmios
```js
lucidProvider.loadWallet(walletApi, {}, {
    kupoUrl: 'http://localhost:1442',
    ogmiosUrl: 'ws://localhost:1337',
})
```
or
```js
lucidProvider.loadWalletFromSeedPhrase(['...'], {}, {
    kupoUrl: 'http://localhost:1442',
    ogmiosUrl: 'ws://localhost:1337',
})
```