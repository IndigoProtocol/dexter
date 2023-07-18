# Changelog

All notable changes to Dexter will be documented in this file.

## [v3.0.0]

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
