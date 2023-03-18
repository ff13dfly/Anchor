#![cfg_attr(rustfmt, rustfmt_skip)]
#![allow(unused_parens)]
#![allow(unused_imports)]

use frame_support::{traits::Get, weights::{Weight, constants::RocksDbWeight}};
use sp_std::marker::PhantomData;

/// Weight functions needed for pallet_example_basic.
pub trait WeightInfo {
	fn set_anchor(x: u32,) -> Weight;
	fn set_sell() -> Weight;
	fn set_unsell() -> Weight;
	fn buy_anchor() -> Weight;
}

/// Weights for pallet_example_basic using the Substrate node and recommended hardware.
pub struct SubstrateWeight<T>(PhantomData<T>);
impl<T: frame_system::Config> WeightInfo for SubstrateWeight<T> {

	fn set_anchor(x: u32, ) -> Weight {
		Weight::from_parts(10_000, 12000)
			.saturating_add(Weight::from_ref_time(1_000_000_u64).saturating_mul(x as u64))
	}

	fn set_sell() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(T::DbWeight::get().writes(1_u64))
	}

	fn set_unsell() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(T::DbWeight::get().writes(1_u64))
	}

	fn buy_anchor() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(T::DbWeight::get().writes(1_u64))
	}
}

// For backwards compatibility and tests
impl WeightInfo for () {
	fn set_anchor(x: u32, ) -> Weight {
		Weight::from_parts(10_000, 12000)
			.saturating_add(Weight::from_ref_time(1_000_000_000_u64).saturating_mul(x as u64))
	}

	fn set_sell() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(RocksDbWeight::get().writes(1_u64))
	}

	fn set_unsell() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(RocksDbWeight::get().writes(1_u64))
	}

	fn buy_anchor() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(RocksDbWeight::get().writes(1_u64))
	}
}
