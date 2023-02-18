// This file is part of Substrate.

// Copyright (C) 2019-2022 Parity Technologies (UK) Ltd.
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

//! Tests for pallet-example-basic.

use crate::*;
use frame_support::{
	assert_ok,
	assert_noop,
	//dispatch::{DispatchInfo},
	parameter_types,
	traits::{ConstU64},
	//assert_noop, 
	//error::BadOrigin
};
use sp_core::H256;
// The testing primitives are very useful for avoiding having to work with signatures
// or public keys. `u64` is used as the `AccountId` and no `Signature`s are required.
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
	//BuildStorage,
};
//use sp_runtime::print;

use sp_std::convert::{TryFrom, TryInto};

// Reexport crate as its pallet name for construct_runtime.
use crate as pallet_anchor;

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;

// For testing the pallet, we construct a mock runtime.
frame_support::construct_runtime!(
	pub enum Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
		Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
		Anchor: pallet_anchor::{Pallet, Call, Storage, Config<T>, Event<T>},
	}
);

parameter_types! {
	pub BlockWeights: frame_system::limits::BlockWeights =
		frame_system::limits::BlockWeights::simple_max(frame_support::weights::Weight::from_ref_time(1024));
}
impl frame_system::Config for Test {
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockWeights = ();
	type BlockLength = ();
	type DbWeight = ();
	type RuntimeOrigin = RuntimeOrigin;
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type RuntimeCall = RuntimeCall;
	type Hashing = BlakeTwo256;
	type AccountId = u64;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type RuntimeEvent = RuntimeEvent;
	type BlockHashCount = ConstU64<250>;
	type Version = ();
	type PalletInfo = PalletInfo;
	type AccountData = pallet_balances::AccountData<u64>;
	type OnNewAccount = ();
	type OnKilledAccount = ();
	type SystemWeightInfo = ();
	type SS58Prefix = ();
	type OnSetCode = ();
	type MaxConsumers = frame_support::traits::ConstU32<16>;
}

impl pallet_balances::Config for Test {
	type MaxLocks = ();
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
	type Balance = u64;
	type DustRemoval = ();
	type RuntimeEvent = RuntimeEvent;
	type ExistentialDeposit = ConstU64<1>;
	type AccountStore = System;
	type WeightInfo = ();
}

impl Config for Test {
	//type MagicNumber = ConstU64<1_000_000_000>;
	type Currency = Balances;
	type RuntimeEvent = RuntimeEvent;
	type WeightInfo = ();
}

// This function basically just builds a genesis storage key/value store according to
// our desired mockup.
pub fn new_test_ext() -> sp_io::TestExternalities {
	let t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	let mut ext = sp_io::TestExternalities::new(t);
	ext.execute_with(|| System::set_block_number(1));
	ext
}

//substrate document
//https://docs.substrate.io/test/unit-testing/

/****************************************/
/***********basic function test**********/
/****************************************/

#[test]
fn set_anchor() {
    new_test_ext().execute_with(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block.clone()); 	//need to start

		// set_anchor data.
		let key=vec![72,105];						//anchor name : Hi
		let raw=vec![84,101,115,116,46,46,46];		//raw data : Test...
		let protocol=vec![78,111,110,101];			//protocol data : None
		let account_a=RuntimeOrigin::signed(11);	//test account A
		let account_b=RuntimeOrigin::signed(22);	//test account B
		
		//Logical part of set_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor( account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(key.clone()), Some((11,start_block.clone())));

		//2.set anchor with wrong pre block
		assert_noop!(
			Anchor::set_anchor( account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0),
			Error::<Test>::PreAnchorFailed,
		);

		//3.set anchor with right pre block number
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),start_block.clone()),
		);

		//4.set anchor by another account who do not own the anchor
		assert_noop!(
			Anchor::set_anchor(account_b.clone(),key.clone(),raw.clone(),protocol.clone(),start_block.clone()),
			Error::<Test>::AnchorNotBelogToAccount,
		);

		System::set_block_number(System::block_number() + step.clone());
    });
}

#[test]
fn sell_anchor() {
    new_test_ext().execute_with(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		//let step = 20;			//the step for the block number
		System::set_block_number(start_block.clone()); 	//need to start

		// set_anchor data.
		let key=vec![72,105];						//anchor name : Hi
		let raw=vec![84,101,115,116,46,46,46];		//raw data : Test...
		let protocol=vec![78,111,110,101];			//protocol data : None
		let id_a=11;
		let id_b=22;
		let id_c=33;
		let account_a=RuntimeOrigin::signed(id_a.clone());	//test account A
		let account_b=RuntimeOrigin::signed(id_b.clone());	//test account B
		//let account_c=RuntimeOrigin::signed(id_c.clone());	//test account C
		let price=499;								//sell price

		//Logical part of sell_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);

		//2. sell it by another account
		assert_noop!(
			Anchor::sell_anchor(account_b.clone(),key.clone(),price.clone(),id_b),
			Error::<Test>::AnchorNotBelogToAccount,
		);
		assert_noop!(
			Anchor::sell_anchor(account_b.clone(),key.clone(),price.clone(),id_c),
			Error::<Test>::AnchorNotBelogToAccount,
		);

		//3. sell it freely
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price.clone(),id_a),
		);

		//4. sell it to target account
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price.clone(),id_c),
		);
	});
}

#[test]
fn unsell_anchor() {
    new_test_ext().execute_with(|| {	
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		//let step = 20;			//the step for the block number
		System::set_block_number(start_block.clone()); 	//need to start

		// set_anchor data.
		let key=vec![72,105];						//anchor name : Hi
		let raw=vec![84,101,115,116,46,46,46];		//raw data : Test...
		let protocol=vec![78,111,110,101];			//protocol data : None
		let id_a=11;
		let id_b=22;
		let account_a=RuntimeOrigin::signed(id_a.clone());	//test account A
		let account_b=RuntimeOrigin::signed(id_b.clone());	//test account B
		//let account_c=RuntimeOrigin::signed(id_c.clone());	//test account C
		let price=499;								//sell price

		//Logical part of sell_anchor
		//1.set a new anchor and sell the anchor freely
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);

		//2.unsell a normal anchor
		assert_noop!(
			Anchor::unsell_anchor(account_b.clone(),key.clone()),
			Error::<Test>::AnchorNotInSellList,
		);

		// assert_ok!(
		// 	Anchor::sell_anchor(account_a.clone(),key.clone(),price.clone(),id_a),
		// );

		// assert_ok!(
		// 	Anchor::unsell_anchor(account_a.clone(),key.clone()),
		// );

		//2.unsell the anchor
		// assert_noop!(
		// 	Anchor::unsell_anchor(account_b.clone(),key.clone()),
		// 	Error::<Test>::AnchorNotBelogToAccount,
		// );
	});
}

/*
#[test]
fn buy_anchor() {
    new_test_ext().build_and_execute(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		//let step = 20;			//the step for the block number
		System::set_block_number(start_block.clone()); 	//need to start

		// set_anchor data.
		let key=vec![72,105];						//anchor name : Hi
		let raw=vec![84,101,115,116,46,46,46];		//raw data : Test...
		let protocol=vec![78,111,110,101];			//protocol data : None
		let id_a=11;
		let id_b=22;
		let account_a=RuntimeOrigin::signed(id_a.clone());	//test account A
		let account_b=RuntimeOrigin::signed(id_b.clone());	//test account B
		//let account_c=RuntimeOrigin::signed(id_c.clone());	//test account C
		let price=499;								//sell price

		//Logical part of sell_anchor
		//1.set a new anchor and sell the anchor freely
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price.clone(),id_a),
		);

		//2.buy the on-sell anchor
		assert_ok!(
			Anchor::buy_anchor(account_b.clone(),key.clone())
		);
	});
}
*/

/****************************************/
/**********complex logical test**********/
/****************************************/

#[test]
fn complex() {
    new_test_ext().execute_with(|| {
		let start_block = 100;
		//let price = 399;
		let account_a=11;
		let account_b=33;
		System::set_block_number(start_block); //need to start
		
		//1.set a new anchor
		assert_ok!(Anchor::set_anchor(RuntimeOrigin::signed(account_a.clone()),vec![48,69],vec![23,23,23,33,33,33],vec![12,23,34,45],0));

	});
}