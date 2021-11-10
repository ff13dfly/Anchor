// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	dispatch::DispatchResult,
	weights::{ClassifyDispatch, DispatchClass, Pays, PaysFee, WeighData, Weight},
	traits::{Currency,ExistenceRequirement},
};
use frame_system::ensure_signed;
pub use pallet::*;
use sp_runtime::traits::SaturatedConversion;
use sp_std::prelude::*;

mod benchmarking;
#[cfg(test)]
mod tests;

pub mod weights;
pub use weights::*;

/// A type alias for the balance type from this pallet's point of view.
type BalanceOf<T> = <T as pallet_balances::Config>::Balance;
//type BalanceOf<T> =
//	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
const MILLICENTS: u32 = 1_000_000_000;

struct WeightForSetDummy<T: pallet_balances::Config>(BalanceOf<T>);

impl<T: pallet_balances::Config> WeighData<(&BalanceOf<T>,)> for WeightForSetDummy<T> {
	fn weigh_data(&self, target: (&BalanceOf<T>,)) -> Weight {
		let multiplier = self.0;
		// *target.0 is the amount passed into the extrinsic
		let cents = *target.0 / <BalanceOf<T>>::from(MILLICENTS);
		(cents * multiplier).saturated_into::<Weight>()
	}
}

impl<T: pallet_balances::Config> ClassifyDispatch<(&BalanceOf<T>,)> for WeightForSetDummy<T> {
	fn classify_dispatch(&self, target: (&BalanceOf<T>,)) -> DispatchClass {
		if *target.0 > <BalanceOf<T>>::from(1000u32) {
			DispatchClass::Operational
		} else {
			DispatchClass::Normal
		}
	}
}

impl<T: pallet_balances::Config> PaysFee<(&BalanceOf<T>,)> for WeightForSetDummy<T> {
	fn pays_fee(&self, _target: (&BalanceOf<T>,)) -> Pays {
		Pays::Yes
	}
}

#[frame_support::pallet]
pub mod pallet {
	// Import various types used to declare pallet in scope.
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	
	#[pallet::config]
	pub trait Config: pallet_balances::Config + frame_system::Config {
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
		type WeightInfo: WeightInfo;
		type Currency: Currency<Self::AccountId>;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_initialize(_n: T::BlockNumber) -> Weight {
			0
		}
		fn on_finalize(_n: T::BlockNumber) {}
		fn offchain_worker(_n: T::BlockNumber) {}
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Anchor key length over load.
		LenghtMaxLimited,

		///Anchor exists already, can not be created.
		AnchorExistsAlready,

		///Anchor do not exist, can not change status.
		AnchorNotExists,

		///Anchor is not in the sell list.
		AnchorNotInSellList,
	}

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		AnchorSet(T::AccountId),
		AnchorToSell(T::AccountId),
		AnchorSold(u32),
	}

	#[pallet::storage]
	#[pallet::getter(fn anchor)]
	pub(super) type AnchorOwner<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, T::AccountId>;

	#[pallet::storage]
	#[pallet::getter(fn sale)]
	pub(super) type SellList<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, (T::AccountId, u32)>;

	//The genesis config type.
	#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub fee: T::Balance,
	}

	//The default value for the genesis config type.
	#[cfg(feature = "std")]
	impl<T: Config> Default for GenesisConfig<T> {
		fn default() -> Self {
			Self { fee: Default::default() }
		}
	}

	// The build of genesis for the pallet.
	#[pallet::genesis_build]
	impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
		fn build(&self) {}
	}

	
	#[pallet::call]
	impl<T: Config> Pallet<T> {

		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_anchor((raw.len()).saturated_into())
		)]
		pub fn set_anchor(
			origin: OriginFor<T>,
			key: Vec<u8>,
			raw: Vec<u8>,
			protocol: Vec<u8>,
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;

			//1.判断各个值的尺寸大小
			ensure!(key.len() < 40, Error::<T>::LenghtMaxLimited);			//1.1.判断key的长度，<40 或者为 64（私有的状态）
			ensure!(raw.len() < 104857600, Error::<T>::LenghtMaxLimited);	//1.2.限制raw的长度，必须小于10M
			ensure!(protocol.len() < 256, Error::<T>::LenghtMaxLimited);	//1.3.限制protocal的长度，必须小于256字节

			let owner = <AnchorOwner<T>>::get(&key); 		//check anchor status

			if owner.is_none() {

			}
			//ensure!(owner.is_none(), Error::<T>::AnchorExistsAlready);

			<AnchorOwner<T>>::insert(key, &sender); 		//create anchor owner
			Self::deposit_event(Event::AnchorSet(sender));	//deposit the owner

			Ok(())
		}

		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_sell()
		)]
		pub fn sell_anchor(origin: OriginFor<T>, key: Vec<u8>, cost: u32) -> DispatchResult {
			let sender = ensure_signed(origin)?;

			ensure!(key.len() < 40, Error::<T>::LenghtMaxLimited); //anchor的字段长度
			ensure!(cost > 0 || cost == 0, Error::<T>::LenghtMaxLimited); //转让费用不能为负数

			let owner = <AnchorOwner<T>>::get(&key); //判断是否已经存在anchor
			ensure!(!owner.is_none(), Error::<T>::AnchorNotExists);

			<SellList<T>>::insert(key, (&sender, cost)); //创建待售列表，可供交易的anchor
			Self::deposit_event(Event::AnchorToSell(sender)); //这个值也会被保存到链上
			Ok(())
		}

		#[pallet::weight(70_000_000)]
		pub fn buy_anchor(origin: OriginFor<T>, key: Vec<u8>) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			ensure!(key.len() < 40, Error::<T>::LenghtMaxLimited);
			
			let anchor=<SellList<T>>::get(&key).ok_or(Error::<T>::AnchorNotInSellList)?;
			//let amount = 6_000_000 as Weight;
			let amount = &anchor.1.into();

			//1.transfer specail amout to seller
			let _res=T::Currency::transfer(&sender,&anchor.0,*amount,ExistenceRequirement::AllowDeath);

			//2.change the owner of anchor 
			<AnchorOwner<T>>::remove(&key);
			<AnchorOwner<T>>::insert(&key, &sender);

			//3.remove the anchor from sell list
			<SellList<T>>::remove(&key);

			Self::deposit_event(Event::AnchorSold(anchor.1));
			Ok(())
		}
	}

}
