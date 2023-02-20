// This file is part of Substrate.
use super::*;
use crate::mock::*;
use frame_support::{
	assert_noop, 
	assert_ok, 
	error::BadOrigin};
use frame_system::{EventRecord, Phase};



//substrate document
//https://docs.substrate.io/test/unit-testing/

//Grant program details
//https://github.com/w3f/Grants-Program/pull/1528 

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
		let key=vec![72,105];						//anchor name : Hi   //b"Hi" ?
		let raw=vec![84,101,115,116,46,46,46];		//raw data : Test...
		let protocol=vec![78,111,110,101];			//protocol data : None
		let account_a=RuntimeOrigin::signed(11);	//test account A
		let account_b=RuntimeOrigin::signed(22);	//test account B
		
		//Logical part of set_anchor
		//1.set a new anchor
		assert_ok!(
			Anchor::set_anchor( account_a.clone(),key.clone(),raw.clone(),protocol.clone(),0)
		);
		//TODO: left result "None", feeling the test runtime storage not start.
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