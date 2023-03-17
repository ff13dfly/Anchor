const { ApiPromise, WsProvider } =require('@polkadot/api');
const { Keyring } =require('@polkadot/api');
const {anchorJS} = require('../publish/anchor.js');

/********************************************/
/***************Basic setting****************/
/********************************************/
const config={
    color:'\x1b[36m%s\x1b[0m',
    endpoint:"ws://127.0.0.1:9944"
};

let websocket=null;
const cache={};
const pairs=[];
const accounts=[
    {
        "encry": {
          "encoded":"oDkM3PGO2UAETUQZwNxdfn5XHOtppDjjFOMtCtWtkPsAgAAAAQAAAAgAAABFVI6EY8E+lNe8mpQpoRNailwluxtpsgKYrg3Fd3yHe48WTl1HkO2PdaJhM5u3JrJCojqXxeY8q0KwvY7jsZ6hE3ESbVEBhjO+fgh1jCjlvC4Nrj2yAySqc3J4+chXjP9g914B+MB2nNzQmwKpiLoVjEyIARxClNLmtpgaToHBb26XCf8O7wIreNRB6YJiK1gpL4c53raxvKtmZ1eG",
          "encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},
          "address":"5HYn3tEtVXrxmNDvyt5A8QzeJMMZ4R3coceBu7DcXgD6dRwp",
          "meta":{"name":"mock_b"}
        },
        "password": "5HYn3_123456",
    },
    {
        "encry": {
          "encoded":"2ixR6J+Sxp1HKBkqVOc1iDjkkqko1y8neP4XsEvuYOcAgAAAAQAAAAgAAABf7k+ZCxCldOZoQd5zLa0KdrLu/mzJe/ufaze3pBRln5NgPrls5M/T9RlFg0ge0n78/2cOwIhSUXA6RY0FJWYYHXTraV8xwnDNeOqkoDaDqAGRWT4EMHXy9ypzaJxjJqN2DGh4CJi9Ivt+dkorc2YFfq6TYGaDKGWjaMXjV1P+CU8L3K/1ZKKRu9xhGhTJlKyRc2At+WhUF4RgNfpH",
          "encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},
          "address":"5CkLxxzqKs9uHhX8EWpJJRoCTcJD6ErTyEvad8nbVsTFS6gt",
          "meta":{"name":"mock_f"}
        },
        "password": "5CkLx_123456",
    },
];
const self={
    run:(list,count)=>{
        if(list.length===0) return console.log(`\n********************End of test********************`);
        const fun=list.shift();
        fun(count-list.length,()=>{
            console.log(`Done, ready for next one.\n\n`);
            setTimeout(()=>{
                self.run(list,count);
            },1500);
        });
    },
    prework:(ck)=>{
        console.log('Ready to prepare the env for testing ...');
        self.initAccounts(accounts,()=>{
            console.log('Accounts ready.');
            return ck && ck();
        });
    },
    initAccounts:(accs,ck)=>{
        if(accs.length===0) return ck && ck();
        const account=accs.shift();
        anchorJS.load(account.encry,account.password,(res)=>{
            console.log(`Get pair from JSON encry account file. Account : ${account.encry.address}`);
            pairs.push(res);
            return self.initAccounts(accs,ck);
        });
    },
    kv:(k,v)=>{
        cache[k]=v;
    },
    stamp:()=>{
        return new Date().getTime();
    },
    getPair:(id)=>{
        if(!pairs[id]) return false;
        return pairs[id];
    },
    randomData:(len)=>{

    },
    auto:(list)=>{
        ApiPromise.create({ provider: new WsProvider(config.endpoint) }).then((api) => {
            console.log('Linker to substrate node created...');
            websocket=api;

            anchorJS.set(api);
            anchorJS.setKeyring(Keyring);
            self.prework(()=>{
                console.log(`\n********************Start of test********************\n`);
                self.run(list,list.length);
            });
        });
    },
};

/********************************************/
/*****************Test queue*****************/
/********************************************/

//!important This test mock the low balance and empty anchor.
//!important If it runs once, the target account do have enough balance.
//!important To avoid this situation, please restart the substrate node.

const anchor='hello';                   //target anchor, can be checked from Polkadot UI
const list=[
    test_empty_anchor,
    test_low_balance_to_write,
    transfer_from_alice_to_pair_0,
    test_anchor_write,
    test_anchor_search,
    test_anchor_owner,
    transfer_from_alice_to_pair_1,
    test_not_owner_to_write,
    test_error_params_to_write,
    test_anchor_write_again,
    test_anchor_write_more,
    test_anchor_history,
    test_anchor_target_and_latest,
    test_anchor_multi,
];
self.auto(list);

/********************************************/
/*****************Test parts*****************/
/********************************************/
function test_empty_anchor(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Search empty anchor "${anchor}"`);
    console.log(`Except result : false `);

    anchorJS.search(anchor,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_low_balance_to_write(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${anchor}" without enough units`);
    console.log(`Except result : {"error":"Not enough balance"}`);

    const raw=JSON.stringify({title:"this is a test",content:"hello world"});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(0);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,anchor,raw,protocol,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function transfer_from_alice_to_pair_0(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Alice`);
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Alice');
    const amount=1919;
    const pair=self.getPair(0);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(nonce)=>{
                console.log(`Balance check via anchorJS, result: ${nonce.free}`);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        } 
    });
}

function test_anchor_write(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${anchor}" again`);
    console.log(`Except result : {"error":"Not enough balance"}`);

    const raw=JSON.stringify({title:"this is a test",content:"hello world"});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(0);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,anchor,raw,protocol,(res)=>{
        console.log(`Result:`);
        console.log(res);
        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    });
}

function test_anchor_search(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Search anchor "${anchor}" again`);
    console.log(`Except result : Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object`);

    anchorJS.search(anchor,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_owner(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Check anchor "${anchor}" owner`);
    const pair=self.getPair(0);
    console.log(`Except result : ${pair.address}`);

    anchorJS.owner(anchor,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function transfer_from_alice_to_pair_1(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Alice`);
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Alice');
    const amount=3766;
    const pair=self.getPair(1);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(nonce)=>{
                console.log(`Balance check via anchorJS, result: ${nonce.free}`);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        } 
    });
}

function test_not_owner_to_write(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${anchor}" by who is not the owner.`);
    console.log(`Except result : {"error":"Not the owner of ${anchor}"}`);

    const raw=JSON.stringify({title:"Can I ?",content:"hello world"});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(1);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,anchor,raw,protocol,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_error_params_to_write(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    //return ck && ck();
}

function test_anchor_write_again(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}

function test_anchor_write_more(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}

function test_anchor_history(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}

function test_anchor_target_and_latest(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    console.log(`------------------------------`);
    return ck && ck();
}

function test_anchor_multi(index,ck){
    console.log(`[${index}] Write data on anchor "${anchor}" again`);
    console.log(`Except result : `);
    console.log(`Result : \n`);
    return ck && ck();
}
