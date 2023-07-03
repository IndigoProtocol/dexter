# Changelog

All notable changes to Dexter will be documented in this file.

## [UNRELEASED]

- Adjust Kupo & Blockfrost data providers to accept an optional `RequestConfig`.
- Cleanup around asset filtering when using `FetchRequest.getLiquidityPools()`.
- Add `FetchRequest.getLiquidityPoolState()` helper to get the latest state for a liquidity pool.
- Liquidity pool fee fix for SundaeSwap when constructing pools from on-chain data. 
- Add `SwapRequest.withSwapOutAmount(bigint)` to calculate the estimated swap in amount.
