<p align="center">
  <h1 align="center">Data Providers</h1>
</p>

### Mock

```js
const mockProvider: BaseDataProvider = new MockDataProvider();
```

### Blockfrost
```js
const blockfrostProvider: BaseDataProvider = new BlockfrostProvider(
    {
        url: 'https://cardano-mainnet.blockfrost.io/api/v0',
        projectId: '<blockfrost-project-id>',
    }
);
```

### Kupo

Requires either a full chain sync, or specific patterns so each DEX can grab the necessary data. The latter
will be optimized, and will be published here once available.

```js
const kupoProvider: BaseDataProvider = new KupoProvider(
    {
        url: 'http://localhost:1442',
    }
);
```