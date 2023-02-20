// This file is part of Substrate.
use super::*;
use crate::mock::*;
use frame_support::{
	assert_noop, 
	assert_ok, 
	//error::BadOrigin
};
//use frame_system::{EventRecord, Phase};

//substrate document
//https://docs.substrate.io/test/unit-testing/
//https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html

//Grant program details
//https://github.com/w3f/Grants-Program/pull/1528 

//useful code
//AnchorOwner::<Test>::insert(key,(account_id, start_block));

//no-working code
//log::info!("current_block_number is {:?}", System::block_number());

#[test]
fn sample() {
    new_test_ext().execute_with(|| {
		let start_block = 100;		//set the start block number
		System::set_block_number(start_block.clone()); 	//need to start

		let key:Vec<u8> = b"Hi".iter().cloned().collect();
		let raw:Vec<u8> = b"Test...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Nothing".iter().cloned().collect();
		let id_a=11;
		let account_a=RuntimeOrigin::signed(id_a.clone());

		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		//AnchorOwner::<Test>::insert(&key,(id_a, start_block));
		assert_eq!(Anchor::owner(key), Some((id_a+1,start_block)));
    });
}

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
		let key:Vec<u8> = b"Hi".iter().cloned().collect();
		let raw:Vec<u8> = b"Test...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Nothing".iter().cloned().collect();
		let account_a=RuntimeOrigin::signed(11);	//test account A
		let account_b=RuntimeOrigin::signed(22);	//test account B
		
		//Logical part of set_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((11,start_block.clone())));
		System::set_block_number(System::block_number() + step.clone());

		//2.set anchor with wrong pre block
		assert_noop!(
			Anchor::set_anchor( account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0),
			Error::<Test>::PreAnchorFailed,
		);
		//AnchorOwner::<Test>::insert(key,(account_id, start_block));
		assert_eq!(Anchor::owner(&key), Some((11,start_block.clone())));
		//AnchorOwner::<Test>::insert(&key,(13, start_block.clone()));
		//assert_eq!(AnchorOwner::<Test>::take(&key), Some((11,start_block.clone())));

		//3.set anchor with right previous block number
		System::set_block_number(System::block_number() + step.clone());
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
		
	});
}


#[test]
fn buy_anchor() {
    new_test_ext().execute_with(|| {
		
	});
}

/****************************************/
/**********complex logical test**********/
/****************************************/

#[test]
fn complex() {
    new_test_ext().execute_with(|| {

	});
}