// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//Anchor的实现逻辑
//1.用个人账号存储到，是可以通过stat.call进行访问的
//2.外部cache程序调用 chain.getBlockHash 和 chain.getBlock进行数据获取
//3.外部cache程序分析数据，形成可调用的缓存数据

//调试方法
//1.在anchor目录下运行cargo test，可以进行单元测试，保障代码没有问题
//2.到根目录下运行 cargo run --bin substrate  --  --dev  -d ~/Desktop/www/sub3 --offchain-worker --execution=NativeElseWasm

use frame_support::{
	dispatch::DispatchResult,
	weights::{ClassifyDispatch, DispatchClass, Pays, PaysFee, WeighData, Weight},
	//traits::{Currency,ExistenceRequirement},
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
const MILLICENTS: u32 = 1_000_000_000;
//let BkNumber:u64;

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

	//写入时增加最后写入的block number，前端调用的时候，就可以判断是否为最新的数据了
	//pub(super) type AnchorOwner<T: Config> = StorageMap<_, Twox64Concat,Vec<u8>, (T::AccountId,blocknumber)>;

	#[pallet::storage]
	#[pallet::getter(fn sale)]
	pub(super) type SellList<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, (T::AccountId, u32)>;

	#[pallet::call]
	//impl<T: Config<I>, I: 'static> Pallet<T, I>{
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

			let owner = <AnchorOwner<T>>::get(&key); 		//判断是否已经存在anchor

			if owner.is_none() {

			}
			//ensure!(owner.is_none(), Error::<T>::AnchorExistsAlready);

			<AnchorOwner<T>>::insert(key, &sender); //创建所有者
			Self::deposit_event(Event::AnchorSet(sender)); //这个值也会被保存到链上

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
			let _sender = ensure_signed(origin)?;
			ensure!(key.len() < 40, Error::<T>::LenghtMaxLimited);
			
			//let anchor=<SellList<T>>::get(&key);
			//ensure!(!anchor.is_none(), Error::<T>::AnchorNotInSellList);
			let _anchor=<SellList<T>>::take(&key).ok_or(Error::<T>::AnchorNotInSellList)?;

			//T::Currency::transfer(&sender,&anchor.0,anchor.1,ExistenceRequirement::AllowDeath);

			// <Self as Currency<_>>::transfer(
			// 	&sender,
			// 	&anchor.0,
			// 	anchor.1,
			// 	ExistenceRequirement::AllowDeath,
			// )?;
			Self::deposit_event(Event::AnchorSold(_anchor.1));
			Ok(())
		}
	}

	// The genesis config type.
	#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub fee: T::Balance,
	}

	// The default value for the genesis config type.
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
}
