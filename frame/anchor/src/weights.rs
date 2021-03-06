// This file is part of Substrate.

// Copyright (C) 2021 Parity Technologies (UK) Ltd.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Autogenerated weights for pallet_example
//!
//! THIS FILE WAS AUTO-GENERATED USING THE SUBSTRATE BENCHMARK CLI VERSION 3.0.0
//! DATE: 2021-03-15, STEPS: `[100, ]`, REPEAT: 10, LOW RANGE: `[]`, HIGH RANGE: `[]`
//! EXECUTION: Some(Wasm), WASM-EXECUTION: Compiled, CHAIN: Some("dev"), DB CACHE: 128

// Executed Command:
// ./target/release/substrate
// benchmark
// --chain
// dev
// --execution
// wasm
// --wasm-execution
// compiled
// --pallet
// pallet_example
// --extrinsic
// *
// --steps
// 100
// --repeat
// 10
// --raw
// --output
// ./
// --template
// ./.maintain/frame-weight-template.hbs


#![cfg_attr(rustfmt, rustfmt_skip)]
#![allow(unused_parens)]
#![allow(unused_imports)]

use frame_support::{traits::Get, weights::{Weight, constants::RocksDbWeight}};
use sp_std::marker::PhantomData;

/// Weight functions needed for pallet_example.
pub trait WeightInfo {
	fn set_anchor(x: u32,) -> Weight;
	fn set_sell() -> Weight;
	fn buy_anchor() -> Weight;
}

/// Weights for pallet_example using the Substrate node and recommended hardware.
pub struct SubstrateWeight<T>(PhantomData<T>);
impl<T: frame_system::Config> WeightInfo for SubstrateWeight<T> {
	// fn set_anchor(x: u32, ) -> Weight {
	// 	(1_000_000_000_000 as Weight)
	// 		.saturating_add((100_000 as Weight).saturating_mul(x as Weight))
	// }
	fn set_anchor(x: u32, ) -> Weight {
		(1_000_000_000 as Weight)
			.saturating_add((10_000 as Weight).saturating_mul(x as Weight))
	}

	fn set_sell() -> Weight {
		(1_000_000_000 as Weight)
	}

	fn buy_anchor() -> Weight {
		(1_000_000_000 as Weight)
	}
}

// For backwards compatibility and tests
impl WeightInfo for () {
	fn set_anchor(x: u32, ) -> Weight {
		(1_000_000_000_000 as Weight)
			.saturating_add((100_000 as Weight).saturating_mul(x as Weight))
	}

	fn set_sell() -> Weight {
		(1_000_000_000 as Weight)
	}

	fn buy_anchor() -> Weight {
		(1_000_000_000 as Weight)
	}
}
