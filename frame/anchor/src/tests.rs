// This file is part of Substrate.
use super::*;
use crate::mock::*;
use frame_support::{
	assert_noop, 
	assert_ok, 
	//error::BadOrigin
};

//substrate document
//https://docs.substrate.io/test/unit-testing/
//https://paritytech.github.io/substrate/master/frame_support/storage/trait.StorageMap.html

//Grant program details
//https://github.com/w3f/Grants-Program/pull/1528
//https://github.com/w3f/Grant-Milestone-Delivery

#[test]
fn sample() {
    new_test_ext().execute_with(|| {
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block); 	//need to start

		let key:Vec<u8> = b"hello".iter().cloned().collect();
		let raw:Vec<u8> = b"Test...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Nothing".iter().cloned().collect();
		let id_a=11;
		let account_a=RuntimeOrigin::signed(id_a.clone());

		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		AnchorOwner::<Test>::insert(&key,(123, 3345));
		assert_eq!(Anchor::owner(&key), Some((123,3345)));

		System::set_block_number(System::block_number() + step);

		assert_eq!(Balances::free_balance(11), 1999000000000000);
		assert_eq!(Balances::free_balance(22), 2999000000000000);
		assert_eq!(Balances::free_balance(33), 3999000000000000);
		assert_eq!(Balances::free_balance(44), 199000000000000);
    });
}

#[test]
fn set_anchor() {
    new_test_ext().execute_with(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block); 	//need to start

		// set_anchor data.
		let key:Vec<u8> = b"hello".iter().cloned().collect();
		let raw:Vec<u8> = b"Test...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Nothing".iter().cloned().collect();

		let (id_a,id_b)=(11,22);
		let account_a=RuntimeOrigin::signed(id_a);	//test account A
		let account_b=RuntimeOrigin::signed(id_b);	//test account B
		
		//Logical part of set_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));
		System::set_block_number(System::block_number() + step);		//inc block number

		//2.set anchor with wrong pre block
		assert_noop!(
			Anchor::set_anchor( account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0),
			Error::<Test>::PreAnchorFailed,
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//3.set anchor with right previous block number
		System::set_block_number(System::block_number() + step);		//inc block number
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),start_block),
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block+step+step)));

		//4.set anchor by another account who do not own the anchor
		assert_noop!(
			Anchor::set_anchor(account_b.clone(),key.clone(),raw.clone(),protocol.clone(),start_block),
			Error::<Test>::AnchorNotBelogToAccount,
		);
		System::set_block_number(System::block_number() + step);
    });
}

#[test]
fn sell_anchor() {
    new_test_ext().execute_with(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block); 	//need to start

		// set_anchor data.
		let key:Vec<u8> = b"selling_anchor".iter().cloned().collect();
		let raw:Vec<u8> = b"Test more...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Protocol".iter().cloned().collect();

		let (id_a,id_b,id_c)=(11,22,33);
		let account_a=RuntimeOrigin::signed(id_a);	//test account A
		let account_b=RuntimeOrigin::signed(id_b);	//test account B
		let price=499;

		//Logical part of sell_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//2. sell it by another account
		assert_noop!(
			Anchor::sell_anchor(account_b.clone(),key.clone(),price,id_b),
			Error::<Test>::AnchorNotBelogToAccount,
		);
		assert_noop!(
			Anchor::sell_anchor(account_b.clone(),key.clone(),price,id_c),
			Error::<Test>::AnchorNotBelogToAccount,
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//3. sell it freely
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price,id_a),
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price,id_a)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//4. sell it to target account and change price
		System::set_block_number(System::block_number() + step);
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price+300,id_c),
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price+300,id_c)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));
	});
}

#[test]
fn unsell_anchor() {
    new_test_ext().execute_with(|| {	
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block); 	//need to start

		// set_anchor data.
		let key:Vec<u8> = b"selling_anchor".iter().cloned().collect();
		let raw:Vec<u8> = b"Test more...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Protocol".iter().cloned().collect();

		let (id_a,id_b)=(11,22);
		let account_a=RuntimeOrigin::signed(id_a);	//test account A
		let account_b=RuntimeOrigin::signed(id_b);	//test account B
		let price=399;

		//Logical part of unsell_anchor

		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//2.unsell the normal anchor
		assert_noop!(
			Anchor::unsell_anchor(account_a.clone(),key.clone()),
			Error::<Test>::AnchorNotInSellList,
		);
		assert_eq!(Anchor::selling(&key), None);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//3.set the anchor to selling status
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price,id_a)
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price,id_a)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//4.unsell the anchor by another account
		assert_noop!(
			Anchor::unsell_anchor(account_b.clone(),key.clone()),
			Error::<Test>::AnchorNotBelogToAccount,
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price,id_a)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//5.unsell the anchor by owner
		System::set_block_number(System::block_number() + step);
		assert_ok!(
			Anchor::unsell_anchor(account_a.clone(),key.clone())
		);
		assert_eq!(Anchor::selling(&key), None);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));
	});
}


#[test]
fn buy_anchor() {
    new_test_ext().execute_with(|| {
		//Basic params
		// set start block to start_block
		let start_block = 100;		//set the start block number
		let step = 20;				//the step for the block number
		System::set_block_number(start_block); 	//need to start

		// set_anchor data.
		let key:Vec<u8> = b"selling_anchor".iter().cloned().collect();
		let raw:Vec<u8> = b"Test more...".iter().cloned().collect();
		let protocol:Vec<u8> = b"Protocol".iter().cloned().collect();

		let (id_a,id_b,id_c,id_d)=(11,22,33,44);
		let account_a=RuntimeOrigin::signed(id_a);	//test account A
		let account_b=RuntimeOrigin::signed(id_b);	//test account B
		let account_c=RuntimeOrigin::signed(id_c);	//test account C
		let account_d=RuntimeOrigin::signed(id_d);	//test account D
		let price=299;

		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor(account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//2.buy a unselling anchor
		assert_eq!(Anchor::selling(&key), None);
		assert_noop!(
			Anchor::buy_anchor(account_b.clone(),key.clone()),
			Error::<Test>::AnchorNotInSellList,
		);
		
		//3. sell it freely
		System::set_block_number(System::block_number() + step);
		assert_ok!(
			Anchor::sell_anchor(account_a.clone(),key.clone(),price,id_a),
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price,id_a)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//4. buy anchor without enought balance
		assert_eq!(Balances::free_balance(id_d), 199000000000000);
		assert_noop!(
			Anchor::buy_anchor(account_d.clone(),key.clone()),
			Error::<Test>::InsufficientBalance,
		);
		assert_eq!(Anchor::selling(&key), Some((id_a,price,id_a)));
		assert_eq!(Anchor::owner(&key), Some((id_a,start_block)));

		//5. buy the anchor yourself
		assert_noop!(
			Anchor::buy_anchor(account_a.clone(),key.clone()),
			Error::<Test>::CanNotBuyYourOwnAnchor,
		);

		//6. buy by a free account
		assert_eq!(Balances::free_balance(id_c), 3999000000000000);
		assert_ok!(
			Anchor::buy_anchor(account_c.clone(),key.clone())
		);
		assert_eq!(Balances::free_balance(id_c), 3700000000000000);
		assert_eq!(Anchor::selling(&key), None);
		assert_eq!(Anchor::owner(&key), Some((id_c,start_block)));

		//7. buy a target anchor
		assert_ok!(
			Anchor::sell_anchor(account_c.clone(),key.clone(),price,id_b),
		);
		assert_eq!(Anchor::selling(&key), Some((id_c,price,id_b)));
		assert_eq!(Anchor::owner(&key), Some((id_c,start_block)));

		//8. try to buy targeted anchor
		assert_noop!(
			Anchor::buy_anchor(account_a.clone(),key.clone()),
			Error::<Test>::OnlySellToTargetBuyer,
		);
		assert_eq!(Anchor::selling(&key), Some((id_c,price,id_b)));
		assert_eq!(Anchor::owner(&key), Some((id_c,start_block)));

		//9. done!
		assert_ok!(
			Anchor::buy_anchor(account_b.clone(),key.clone())
		);
		assert_eq!(Anchor::selling(&key), None);
		assert_eq!(Anchor::owner(&key), Some((id_b,start_block)));
	});
}