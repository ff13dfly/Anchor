// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//Anchor的实现逻辑
//1.用个人账号存储到，是可以通过stat.call进行访问的
//2.外部cache程序调用 chain.getBlockHash 和 chain.getBlock进行数据获取
//3.外部cache程序分析数据，形成可调用的缓存数据


//调试方法
//1.在anchor目录下运行cargo test，可以进行单元测试，保障代码没有问题
//2.到根目录下运行 cargo run --bin substrate  --  --dev  -d ~/Desktop/www/sub3 --offchain-worker --execution=NativeElseWasm
//进行完整的测试，有可能会报错

//方法暴露的实现
//1.使用预定义的宏来实现
//#[pallet::storage]
//#[pallet::getter(fn get_anchor)]
//pub(super) type GetAnchor<T: Config> = StorageValue<_, T::Balance>;

//引用区域，调用外部的包，如果有没有使用的，编译器会提示
use frame_support::{
	dispatch::DispatchResult,
	weights::{ClassifyDispatch, DispatchClass, Pays, PaysFee, WeighData, Weight},
};
use frame_system::ensure_signed;
use sp_runtime::traits::{SaturatedConversion};
use sp_std::prelude::*;
pub use pallet::*;

// use codec::{Decode, Encode};
// use frame_support::{
// 	dispatch::DispatchResult,
// 	traits::IsSubType,
// 	weights::{ClassifyDispatch, DispatchClass, Pays, PaysFee, WeighData, Weight},
// };
// use frame_system::ensure_signed;
// use log::info;
// use sp_runtime::{
// 	traits::{Bounded, DispatchInfoOf, SaturatedConversion, Saturating, SignedExtension},
// 	transaction_validity::{
// 		InvalidTransaction, TransactionValidity, TransactionValidityError, ValidTransaction,
// 	},
// };
// use sp_std::{marker::PhantomData, prelude::*};

#[cfg(test)]

mod tests;
mod benchmarking;

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
		fn on_finalize(_n: T::BlockNumber){}
		fn offchain_worker(_n: T::BlockNumber){}
	}

	//这里是可以执行的交易，数据放到了链上
	//可以通过RPC进行调用的，就能把数据存到链上了，需要返回blocknumber，供缓存用
	//最终的请求逻辑为： vExplorer --> vCache --> vChain
	#[pallet::call]
	impl<T: Config> Pallet<T>{
		//anchor的设定，type为1的时候，可以直接用key进行访问
		//@param key		string		//正常值为sha256,vbw通过前缀加密获得sha256(prefix_x_y_world),x,y,world存入到metadata里
		//@param raw		Vec<u8>		//数据值，cache需要进行缓存，根据type进行，1和2存到redis，其他的存为文件
		//@param protocol	Vec<u8>	 	//json格式数据，用于支持各种应用 {md5:0xaaa...bbb}
		//@param way		u16			//数据类型，[1.anchor类型;2.string类型；3.其他的类型，文件类型等]

		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_anchor((raw.len()).saturated_into())
		)]
		pub fn set_anchor(origin: OriginFor<T>, key:Vec<u8>,raw:Vec<u8>,protocol:Vec<u8>,way:u16) -> DispatchResult {
			let _sender = ensure_signed(origin)?;
			//1.判断各个值的尺寸大小
			//1.1.判断key的长度，<40 或者为 64（私有的状态）
			ensure!(key.len() < 40 || key.len()==64, Error::<T>::LenghtOverload);

			//1.2.限制raw的长度，必须小于10M
			ensure!(raw.len() < 10000000, Error::<T>::LenghtOverload);
			
			//1.3.限制protocal的长度，必须小于256字节
			ensure!(protocol.len() < 256, Error::<T>::LenghtOverload);
			// let plen=ensure!(raw.len() < 10000000, Error::<T>::LenghtOverload);.len();
			// if(plen>256){

			// }

			//2.根据是否为公有进行数据处理
			if way==1 {
				Self::deposit_event(Event::AnchorSet(1));		//这个值也会被保存到链上
			}else{
				Self::deposit_event(Event::AnchorSet(0));		//这个值也会被保存到链上
			}

			//3.判断_data的长度，并根据长度计算费用
			Ok(())
		}

		//anchor的管理操作，可以考虑用托管的方式，压coin在里面
		// #[pallet::weight(
		// 	<T as pallet::Config>::WeightInfo::block_anchor()
		// )]
		// pub fn block_anchor(origin: OriginFor<T>, _key:Vec<u8>){
		// 	let _sender = ensure_signed(origin)?;

		// 	Ok(())
		// }
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Anchor key length over load.
		LenghtOverload,
	}

	//回调时间，不知道怎么调用的～～
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		AnchorSet(u32),
	}

	// The genesis config type.
	#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub fee: T::Balance,
		//pub bar: Vec<(T::AccountId, T::Balance)>,
		//pub foo: T::Balance,
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
		fn build(&self) {
			//<Dummy<T>>::put(&self.dummy);
			//for (a, b) in &self.bar {
			//	<Bar<T>>::insert(a, b);
			//}
			//<Foo<T>>::put(&self.foo);
		}
	}

}