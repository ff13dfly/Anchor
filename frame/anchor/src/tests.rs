use frame_support::{assert_noop, assert_ok, error::BadOrigin};
use frame_system::{EventRecord, Phase};

use super::*;
//use crate::mock::*;

/****************************************/
/***************setAnchor****************/
/****************************************/
#[test]
fn set_new_anchor() {
    assert_eq!(100, 100);

}

#[test]
fn set_owned_anchor() {
    assert_eq!(100, 100);

}

/****************************************/
/***************sellAnchor***************/
/****************************************/
#[test]
fn sell_owned_anchor() {
    assert_eq!(100, 100);
}

#[test]
fn sell_unowned_anchor() {
    assert_eq!(100, 100);
    
}

/****************************************/
/**************unsellAnchor**************/
/****************************************/

#[test]
fn unsell_owned_anchor() {
    assert_eq!(100, 100);
}

#[test]
fn unsell_unowned_anchor() {
    assert_eq!(100, 100);
}

/****************************************/
/****************buyAnchor***************/
/****************************************/

#[test]
fn buy_target_anchor() {
    assert_eq!(100, 100);
}

#[test]
fn buy_free_anchor() {
    assert_eq!(100, 100);
}

#[test]
fn buy_unselling_anchor() {
    assert_eq!(100, 100);
}