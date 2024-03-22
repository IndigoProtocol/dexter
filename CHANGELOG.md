# Changelog

All notable changes to Dexter will be documented in this file.

## [v5.2.0]
- Add `withMinimumReceive(minReceive: bigint)` to SwapRequest

## [v5.1.0]
- Fix cancelling orders for each DEX
- Add new split cancel order request

## [v5.0.0]
- TeddySwap integration
- Spectrum integration

## [v4.2.0]
- Fix WR price impact formula for 0 decimals
- Rename Asset identifier function
- Include '/' helper function for proxy URLs
- Add export for SplitSwapRequest
- Add tests for DexTransaction events
- Fix `withSwapOutAmountMappings` for split swap requests
- Add fetching for total LP tokens for liquidity pools

## [v4.1.0]
- Support for multi-dex swap requests.

## [v4.0.2]
- Fix pool identifiers & LP token for Minswap.

## [v4.0.1]
- Remove total LP tokens from fetched data. This data is not needed for swapping, and wastes a lot of network requests.
- Add `setProviderForDex()` to use different data providers for each DEX.

## [v3.0.3]
- Fix for Minswap calculations with pool fee percents to round before casting.

## [v3.0.2]
- Update DEX template definitions to use a copy of the template, rather than altering the original.
- Fix for WingRiders API.

## [v3.0.1]

- Fix for WingRiders price impact calculation when using a non ADA swap in token.
- Expose address payments in `DexTransaction` instance.
- Update DEX `name` variable to `identifier` to resolve browser related issue with reserved words.

## [v2.0.0]

- Adjust Kupo & Blockfrost data providers to accept an optional `RequestConfig`.
- Cleanup around asset filtering when using `FetchRequest.getLiquidityPools()`.
- Add `FetchRequest.getLiquidityPoolState()` helper to get the latest state for a liquidity pool.
- Liquidity pool fee fix for SundaeSwap when constructing pools from on-chain data. 
- Add ability to retry API requests in the `RequestConfig` options. 
- Add handling for Blockfrost API limit cooldown. 
- Add `SwapRequest.withSwapOutAmount(bigint)` to calculate the estimated swap in amount.
- Add `SwapRequest.withSwapOutToken(Token)` to allow crafting a SwapRequest given the swap out token.
- Update `FetchRequest.forDexs()` to `FetchRequest.onDexs()`.
- Update `FetchRequest.forAllDexs()` to `FetchRequest.onAllDexs()`.
- Add `FetchRequest.forTokens()` & `FetchRequest.forTokenPairs()` for filtering pools containing tokens/token pairs.
- Fix for encrypted Minswap API responses (API still has hard call limits). 
