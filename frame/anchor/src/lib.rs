// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! # Anchor Pallet
//! Anchor is an On-chain Linked List system base on substrate. 
//! On another hand, Anchor can alse be treated as Name Service or On-chain Key-value Storage.
//!
//! ## Overview
//! There are two main parts storage and market of Anchor pallet. 
//! 1.Storage part: set_anchor.
//! 2.Market part: sell_anchor,unsell_anchor,buy_anchor.
//!
//! ### Terminology
//! - Anchor: The unique key which store data on chain.
//! - Raw : 4M bytes max string storage, UTF8 support.
//! - Protocol: 256 bytes max string, customize protocol.
//! - Pre: block number linked to previous anchor storage.
//! 
//! ## Interface
//! * set_anchor, one method to update and init storage.
//! * sell_anchor, sell anchor freely or to target account
//! * unsell_anchor, revoke selling status
//! * buy_anchor, buy a selling anchor
//! 

// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	dispatch::{DispatchResult},
	traits::{Currency,ExistenceRequirement},
	weights::Weight,
};
use frame_system::ensure_signed;
use sp_runtime::{
	traits::{SaturatedConversion,StaticLookup},
};
use sp_std::{convert::TryInto, prelude::*};
pub use pallet::*;

mod benchmarking;
#[cfg(test)]
mod mock;
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
	//#[pallet::generate_store(pub(super) trait Store)]
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
		PriceValueLimited,

		///Anchor exists already, can not be created.
		AnchorExistsAlready,

		///Anchor do not exist, can not change status.
		AnchorNotExists,

		///unknown anchor owner data in storage.
		UnexceptDataError,

		///Anchor do not belong to the account
		AnchorNotBelogToAccount,

		///Anchor is not in the sell list.
		AnchorNotInSellList,

		///Not enough balance
		InsufficientBalance,

		///Transfer error.
		TransferFailed,

		///User can not buy the anchor owned by himself
		CanNotBuyYourOwnAnchor,

		///Anchor was set to sell to target buyer
		OnlySellToTargetBuyer,
	}


	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// An anchor is set to selling status.
		AnchorToSell(T::AccountId,u32,T::AccountId),	//(owner, price , target)
	}

	/// Hashmap to record anchor status, Anchor => ( Owner, last block )
	#[pallet::storage]
	#[pallet::getter(fn owner)]
	pub(super) type AnchorOwner<T: Config> = StorageMap<_, Twox64Concat, Vec<u8>, (T::AccountId,T::BlockNumber)>;

	/// Selling anchor status, Anchor => ( Owner, Price, Target customer )
	#[pallet::storage]
	#[pallet::getter(fn selling)]
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
		/// set a new anchor or update an exist anchor
		#[pallet::call_index(0)]
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

				<AnchorOwner<T>>::try_mutate(&nkey, |status| -> DispatchResult {
					let d = status.as_mut().ok_or(Error::<T>::UnexceptDataError)?;
					d.1 = current_block_number;
					Ok(())
				})?;
			}

			Ok(())
		}

		/// Set anchor to sell status and added to sell list
		#[pallet::call_index(1)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_sell()
		)]
		pub fn sell_anchor(
			origin: OriginFor<T>, 
			key: Vec<u8>, 
			price: u32, 
			target:<T::Lookup as StaticLookup>::Source		//select from exist accounts.
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			let target = T::Lookup::lookup(target)?;

			//1.param check		
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited); 	//1.1.check key length, <40
			ensure!(price > 0, Error::<T>::PriceValueLimited); 

			//1.1.lowercase fix
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();

			//2.check owner
			let owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;
			ensure!(sender==owner.0, <Error<T>>::AnchorNotBelogToAccount);

			//4.put in sell list
			<SellList<T>>::insert(nkey, (&sender, price, &target)); 			
			Self::deposit_event(Event::AnchorToSell(sender,price,target));
			Ok(())
		}

		/// buy an anchor on-sell.
		#[pallet::call_index(2)]
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
			let _owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;

			//1.transfer specail amout to seller
			let amount= anchor.1;
			let basic:u128=1000000000000;
			let tx=basic.saturating_mul(amount.into());

			//1.1.check balance
			ensure!(T::Currency::free_balance(&sender) >= tx.saturated_into(), Error::<T>::InsufficientBalance);

			//1.2.do transfer
			let res=T::Currency::transfer(
				&sender,		//transfer from
				&anchor.0,		//transfer to
				tx.saturated_into(),		//transfer amount
				ExistenceRequirement::AllowDeath
			);
			ensure!(res.is_ok(), Error::<T>::TransferFailed);

			//2.change the owner of anchor 
			<AnchorOwner<T>>::try_mutate(&nkey, |status| -> DispatchResult {
				let d = status.as_mut().ok_or(Error::<T>::UnexceptDataError)?;
				d.0 = sender;

				//3.remove the anchor from sell list
				<SellList<T>>::remove(&nkey);
				Ok(())
			})?;
			Ok(())
		}

		/// Revoke anchor from selling status
		#[pallet::call_index(3)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::set_unsell()
		)]
		pub fn unsell_anchor(
			origin: OriginFor<T>, 
			key: Vec<u8>, 
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;
			
			//1.param check
			//1.1.check key length, <40
			ensure!(key.len() < 40, Error::<T>::KeyMaxLimited);

			//1.2.lowercase check
			let mut nkey:Vec<u8>;
			nkey=key.clone().as_mut_slice().to_vec();
			nkey.make_ascii_lowercase();

			//1.3.check sell list
			<SellList<T>>::get(&key).ok_or(Error::<T>::AnchorNotInSellList)?;

			//2.check owner
			let owner=<AnchorOwner<T>>::get(&nkey).ok_or(Error::<T>::AnchorNotExists)?;
			ensure!(sender==owner.0, <Error<T>>::AnchorNotBelogToAccount);

			//3.remove from sell list		
			<SellList<T>>::remove(nkey);
			Ok(())
		}
	}
}
