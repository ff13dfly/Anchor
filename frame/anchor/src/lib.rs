// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

//use codec::{Encode};
use frame_support::{
	dispatch::{DispatchResult},
	traits::{Currency,ExistenceRequirement},
	weights::Weight,
};
use frame_system::ensure_signed;
//use scale_info::TypeInfo;
use sp_runtime::{
	traits::{SaturatedConversion,StaticLookup},
	// transaction_validity::{
	// 	InvalidTransaction, TransactionValidity, TransactionValidityError, ValidTransaction,
	// },
};
use sp_std::{convert::TryInto, prelude::*};
pub use pallet::*;

mod benchmarking;
#[cfg(test)]
mod tests;

pub mod weights;
pub use weights::*;


#[frame_support::pallet]
pub mod pallet {
	use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::config]
	pub trait Config: pallet_balances::Config + frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type WeightInfo: WeightInfo;
		type Currency: Currency<Self::AccountId>;
	}

	#[pallet::pallet]
	#[pallet::without_storage_info]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);
	
	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_initialize(_n: T::BlockNumber) -> Weight {
			Weight::zero()
		}
		fn on_finalize(_n: T::BlockNumber) {}
		fn offchain_worker(_n: T::BlockNumber) {}
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Anchor key length over load.
		LengthMaxLimited,

		///Anchor name max length.
		KeyMaxLimited,

		///Anchor raw data max limit.
		Base64MaxLimited,

		///Anchor protocola max length
		ProtocolMaxLimited,

		///Pre number errror
		PreAnchorFailed,

		///Anchor sell value error.
		CostValueLimited,

		///Anchor exists already, can not be created.
		AnchorExistsAlready,

		///Anchor do not exist, can not change status.
		AnchorNotExists,

		///Anchor do not belong to the account
		AnchorNotBelogToAccount,

		///Anchor is not in the sell list.
		AnchorNotInSellList,

		///Transfer error.
		TransferFailed,

		///User can not buy the anchor owned by himself
		CanNotBuyYourOwnAnchor,

		///Anchor was set to sell to target buyer
		OnlySellToTargetBuyer,
	}

	//这里的数据将写到chain上

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		AnchorToSell(T::AccountId,u32,T::AccountId),	//( owner, cost , target account , preview block )
	}

	#[pallet::storage]
	#[pallet::getter(fn anchor)]

	pub(super) type AnchorOwner<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, (T::AccountId,T::BlockNumber)>;

	#[pallet::storage]
	#[pallet::getter(fn sale)]
	pub(super) type SellList<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, (T::AccountId, u32,T::AccountId)>;

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
		//set a new anchor or update an exist anchor
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_anchor((raw.len()).saturated_into())
		)]
		pub fn set_anchor(
			origin: OriginFor<T>,
			key: Vec<u8>,
			raw: Vec<u8>,
			protocol: Vec<u8>,
			pre:T::BlockNumber
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			//0.check is on sell

			//1.param check
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited);				//1.1.check key length, <40
			ensure!(raw.len() < 4*1024*1024, Error::<T>::Base64MaxLimited);	//1.2.check raw(base64) length，<4M
			ensure!(protocol.len() < 256, Error::<T>::ProtocolMaxLimited);	//1.3.check protocal length, <256

			//1.1.convert key to lowcase
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();

			let data = <AnchorOwner<T>>::get(&nkey); 		//check anchor status
			let current_block_number = <frame_system::Pallet<T>>::block_number();

			//2.check anchor to determine add or update
			if data.is_none() {
				let val:u64=0;
				let zero :T::BlockNumber = val.saturated_into();
				ensure!(pre == zero, Error::<T>::PreAnchorFailed);

				//2.1.create new anchor
				<AnchorOwner<T>>::insert(nkey, (&sender,current_block_number));

			}else{
				//2.2.update exists anchor
				let owner=data.ok_or(Error::<T>::AnchorNotExists)?;
				ensure!(sender == owner.0, Error::<T>::AnchorNotBelogToAccount);
				ensure!(pre == owner.1, Error::<T>::PreAnchorFailed);

				<AnchorOwner<T>>::remove(&nkey);
				<AnchorOwner<T>>::insert(nkey, (&sender,current_block_number));
			}
			
			Ok(())
		}

		//put an anchor to sell list
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_sell()
		)]
		pub fn sell_anchor(
			origin: OriginFor<T>, 
			key: Vec<u8>, 
			cost: u32, 
			target:<T::Lookup as StaticLookup>::Source		//select from exist accounts.
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			let target = T::Lookup::lookup(target)?;

			//1.param check		
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited); 			//1.1.check key length, <40
			ensure!(cost > 0 || cost == 0, Error::<T>::CostValueLimited); 	//1.2.check cost, >0

			//1.1.lowercase fix
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();

			//2.check owner
			let owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;
			ensure!(sender==owner.0, <Error<T>>::AnchorNotBelogToAccount);

			//4.put in sell list
			<SellList<T>>::insert(nkey, (&sender, cost, &target)); 			
			Self::deposit_event(Event::AnchorToSell(sender,cost,target));
			Ok(())
		}

		//buy an anchor from sell list.
		#[pallet::weight(
			<T as pallet::Config >::WeightInfo::buy_anchor()
		)]
		pub fn buy_anchor(
			origin: OriginFor<T>, 
			key: Vec<u8>
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited);

			//lowercase check
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();
			
			let anchor=<SellList<T>>::get(&key).ok_or(Error::<T>::AnchorNotInSellList)?;

			//0.check anchor sell status
			//0.1.confirm the anchor is not owned by sender
			ensure!(sender != anchor.0, <Error<T>>::CanNotBuyYourOwnAnchor);

			//0.2.check the anchor sell target
			if anchor.0 != anchor.2 {
				ensure!(sender == anchor.2, <Error<T>>::OnlySellToTargetBuyer);
			}

			//0.3.check anchor owner
			let owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;

			//1.transfer specail amout to seller
			let amount= anchor.1;

			let basic:u128=1000000000000;
			let tx=basic.saturating_mul(amount.into());
			let res=T::Currency::transfer(
				&sender,		//transfer from
				&anchor.0,		//transfer to
				tx.saturated_into(),		//transfer amount
				ExistenceRequirement::AllowDeath
			);
			ensure!(res.is_ok(), Error::<T>::TransferFailed);

			//2.change the owner of anchor 
			<AnchorOwner<T>>::remove(&nkey);
			<AnchorOwner<T>>::insert(&nkey, (&sender,owner.1));

			//3.remove the anchor from sell list
			<SellList<T>>::remove(nkey);

			Ok(())
		}

		//remove anchor from sell list
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_unsell()
		)]
		pub fn unsell_anchor(
			origin: OriginFor<T>, 
			key: Vec<u8>, 
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			
			//1.param check		
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited); 			//1.1.check key length, <40

			//1.1.lowercase check
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();

			//2.check owner
			let owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;
			ensure!(sender==owner.0, <Error<T>>::AnchorNotBelogToAccount);

			//3.remove from sell list		
			<SellList<T>>::remove(nkey);
			Ok(())
		}
	}

}
