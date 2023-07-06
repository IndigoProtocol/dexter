# Changelog

All notable changes to Dexter will be documented in this file.

## [UNRELEASED]

- Adjust Kupo & Blockfrost data providers to accept an optional `RequestConfig`.
- Cleanup around asset filtering when using `FetchRequest.getLiquidityPools()`.
- Add `FetchRequest.getLiquidityPoolState()` helper to get the latest state for a liquidity pool.
- Liquidity pool fee fix for SundaeSwap when constructing pools from on-chain data. 
- Add handling for Blockfrost API limit cooldown. 
- Add `SwapRequest.withSwapOutAmount(bigint)` to calculate the estimated swap in amount.
- Add `SwapRequest.withSwapOutToken(Token)` to allow crafting a SwapRequest given the swap out token.
- Update `FetchRequest.forDexs()` to `FetchRequest.onDexs()`.
- Update `FetchRequest.forAllDexs()` to `FetchRequest.onAllDexs()`.
- Add `FetchRequest.forTokens()` & `FetchRequest.forTokenPairs()` for filtering pools containing tokens/token pairs.