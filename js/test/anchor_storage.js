const { ApiPromise, WsProvider } =require('@polkadot/api');
const { Keyring } =require('@polkadot/api');
const {anchorJS} = require('../publish/anchor.js');

const endpoint="ws://127.0.0.1:9944";

const wsProvider = new WsProvider(endpoint);
const anchor='hello';
ApiPromise.create({ provider: wsProvider }).then((api) => {
    console.log('Linker to substrate node created...');
    anchorJS.set(api);
    anchorJS.setKeyring(Keyring);

    prework(()=>{
        console.log(`\n********************Start of test********************\n`);
        const list=[test_01,test_02,test_03];
        autoTest(list);
    });
});

function autoTest(list){
    if(list.length===0) return console.log(`\n********************End of test********************`);
    const fun=list.shift();
    fun(()=>{
        autoTest(list);
    });
}

function prework(ck){
    console.log('Ready to prepare the env for testing ...');
    return ck && ck();
}

function test_01(ck){
    
    console.log(`[1] Search empty anchor "${anchor}"`);
    console.log(`Except result : false `);
    anchorJS.search(anchor,(res)=>{
        console.log(`Result : ${res}\n`);
        console.log(`------------------------------`);
        return ck && ck();
    });
}

function test_02(ck){
    console.log(`[2] Write data on anchor "${anchor}"`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}

function test_03(ck){
    console.log(`[3] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}