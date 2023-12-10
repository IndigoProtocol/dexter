<p align="center">
  <h1 align="center">Data Providers</h1>
</p>

### Mock

```js
const mockProvider: BaseDataProvider = new MockDataProvider();
```

### Blockfrost
Dexter requires a lot of requests when pulling liquidity pools, so it is advised to either [host your own Blockfrost backend](https://github.com/blockfrost/blockfrost-backend-ryo), 
or use an API plan sufficient to handle enough requests.
```js
const blockfrostProvider: BaseDataProvider = new BlockfrostProvider(
    {
        url: 'https://cardano-mainnet.blockfrost.io/api/v0',
        projectId: '<blockfrost-project-id>',
    }
);
```

### Kupo

```js
const kupoProvider: BaseDataProvider = new KupoProvider(
    {
        url: 'http://localhost:1442',
    }
);
```

For the best results, the matching patterns below give the minimum required for DEX addresses
to resolve within Dexter :
```
--match "de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.4d7565736c69537761705f414d4d"
--match "026a18d04a0c642759bb3d83b12e3344894e5c1c7b2aeb1a2113a570.4c"
--match "13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f.4d494e53574150" 
--match "addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu"
--match "{ Your Address }"
```

An example of a full Kupo run command given these patterns :
```
kupo \
--host 0.0.0.0 \
--port 1442 \
--node-socket path/to/node/socket \
--node-config path/to/node/config \
--since origin \
--defer-db-indexes \
--workdir path/to/db/directory \
--prune-utxo \
--match "de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.4d7565736c69537761705f414d4d" \
--match "026a18d04a0c642759bb3d83b12e3344894e5c1c7b2aeb1a2113a570.4c" \
--match "13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f.4d494e53574150" \
--match "addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu"
--match "ffcdbb9155da0602280c04d8b36efde35e3416567f9241aff0955269.4d7565736c69537761705f414d4d" \
--match "{ Your Address }"
```
