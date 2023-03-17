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

let test_start=0;
let test_end=0;
const funs={};
const self={
    run:(list,count)=>{
        if(list.length===0){
            test_end=self.stamp();
            console.log(`\nStart from ${test_start}, end at ${test_end}, total cost : ${((test_end-test_start)*0.001).toFixed(3)} s.`);
            self.report();
            console.log(`\n********************End of test********************`);
            return true;
        } 
        const fun=list.shift();
        fun(count-list.length,()=>{
            if(list.length!==0) console.log(`Done, ready for next one.\n\n`);
            setTimeout(()=>{
                self.run(list,count);
            },1500);
        });
    },
    report:()=>{
        console.log(`\nTested Function Overview.`);
        for(let fun in funs){
            console.log(`${fun}:`);
            const list=funs[fun];
            for(let i=0;i<list.length;i++){
                const row=list[i];
                console.log(`    ${row[0]} : ${row[1]}`);
            }
        }
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
            console.log(`Get pair from JSON encry account data. Account : ${account.encry.address}`);
            pairs.push(res);
            return self.initAccounts(accs,ck);
        });
    },
    pushFun:(name,test,intro)=>{
        if(!funs[name]) funs[name]=[];
        funs[name].push([test,intro===undefined?'':intro]);
    },
    setKV:(k,v)=>{
        cache[k]=v;
    },
    getKV:(k)=>{
        return cache[k]===undefined?null:cache[k];
    },
    stamp:()=>{
        return new Date().getTime();
    },
    getPair:(id)=>{
        if(!pairs[id]) return false;
        return pairs[id];
    },
    random:function(min, max){
        return Math.round(Math.random() * (max - min)) + min;
      },
    randomData:(len)=>{
        let str='';
        for(let i=0;i<len;i++){
            str+=Math.ceil(Math.random() * 10)-1;
        }
        return str;
    },
    auto:(list)=>{
        ApiPromise.create({ provider: new WsProvider(config.endpoint) }).then((api) => {
            console.log('Linker to substrate node created...');
            websocket=api;

            anchorJS.set(api);
            anchorJS.setKeyring(Keyring);
            self.prework(()=>{
                test_start=self.stamp();
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

const anchor='hello';  //target anchor, can be checked from Polkadot UI
const more="test_a";   //more anchor name
const utf8_a="你好";    //UTF8 anchor name, "hello" in Chinese

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
    test_anchor_UTF8_supports,
];
self.auto(list);

/********************************************/
/*****************Test parts*****************/
/********************************************/
function test_empty_anchor(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Search empty anchor "${anchor}"`);
    console.log(`Test function : anchorJS.search`);
    console.log(`Except result : false \n`);
    self.pushFun('anchorJS.search',`test_${index}`,'Empty anchor test');

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
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : {"error":"Low balance"}\n`);
    self.pushFun('anchorJS.write',`test_${index}`,'Low balance test.');

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
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    self.pushFun('anchorJS.balance',`test_${index}`,'Balance check after transfer');
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Alice');
    const amount=1919;
    const pair=self.getPair(0);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(balance)=>{
                console.log(`Result:`);
                console.log(balance);
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
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.write',`test_${index}`);

    const raw=JSON.stringify({title:"this is a test",content:self.randomData(34)});
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
    console.log(`Test function : anchorJS.search`);
    console.log(`Except result : Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object\n`);
    self.pushFun('anchorJS.search',`test_${index}`);

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
    console.log(`Test function : anchorJS.owner`);
    console.log(`Except result : ${pair.address}\n`);
    self.pushFun('anchorJS.owner',`test_${index}`);

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
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    self.pushFun('anchorJS.balance',`test_${index}`);
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Alice');
    const amount=2688;
    const pair=self.getPair(1);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(balance)=>{
                console.log(`Result:`);
                console.log(balance);
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
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : {"error":"Not the owner of ${anchor}"}\n`);
    self.pushFun('anchorJS.write',`test_${index}`);

    const raw=JSON.stringify({title:"Can I ?",content:"hello world"});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(1);
    console.log(`Writer address : ${pair.address}`);

    anchorJS.owner(anchor,(owner)=>{
        console.log(`Owner address : ${owner}`);
        anchorJS.write(pair,anchor,raw,protocol,(res)=>{
            console.log(`Result:`);
            console.log(res);
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        });
    });
}

function test_error_params_to_write(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${anchor}" with length limit exceeded.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : {"error":"Params error"}\n`);
    self.pushFun('anchorJS.write',`test_${index}`);
    
    const fun=self.randomData;
    const pair=self.getPair(1);

    //anchor name length > limitation
    const anchor_01=fun(41);
    const raw_01=fun(2300);
    const protocol_01=fun(200);
    console.log(`Anchor name limitation. Anchor: ${anchor_01.length}, raw: ${raw_01.length}, protocol: ${protocol_01.length}`);
    anchorJS.write(pair,anchor_01,raw_01,protocol_01,(res)=>{
        console.log(`Result:`);
        console.log(res);

        const anchor_02=fun(29);
        const raw_02=fun(4*1024*1024+1);
        const protocol_02=fun(100);
        console.log(`Raw limitation. Anchor: ${anchor_02.length}, raw: ${raw_02.length}, protocol: ${protocol_02.length}`);
        anchorJS.write(pair,anchor_01,raw_01,protocol_01,(res)=>{
            console.log(`Result:`);
            console.log(res);

            const anchor_03=fun(22);
            const raw_03=fun(200);
            const protocol_03=fun(257);
            console.log(`Protocol limitation. Anchor: ${anchor_03.length}, raw: ${raw_03.length}, protocol: ${protocol_03.length}`);
            anchorJS.write(pair,anchor_01,raw_01,protocol_01,(res)=>{
                console.log(`Result:`);
                console.log(res);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        });
    });
}

function test_anchor_write_again(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${anchor}", prepare for history test.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.write',`test_${index}`);

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

function test_anchor_write_more(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${more}", prepare for multi test.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.write',`test_${index}`);

    const raw=JSON.stringify({title:"this is a test",content:"hello world"});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(1);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,more,raw,protocol,(res)=>{
        console.log(`Result:`);
        console.log(res);
        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    });
}

function test_anchor_history(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Get anchor "${anchor}" history list.`);
    console.log(`Test function : anchorJS.history`);
    console.log(`Except result : Array of Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object\n`);
    self.pushFun('anchorJS.history',`test_${index}`);

    anchorJS.history(anchor,(res)=>{
        console.log(`Result:`);
        console.log(res);

        //Get the list blocknumbers for next test.
        const blocks=[];
        for(let i=0;i<res.length;i++){
            const row=res[i];
            blocks.unshift(row.block);
        }
        self.setKV(anchor,blocks);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_target_and_latest(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Get target anchor "${anchor}" data.`);
    console.log(`Test function : anchorJS.target`);
    console.log(`Except result : Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object\n`);
    self.pushFun('anchorJS.target',`test_${index}`);
    self.pushFun('anchorJS.latest',`test_${index}`);

    const his=self.getKV(anchor);
    anchorJS.target(anchor,his[0],(res)=>{
        console.log(`Result:`);
        console.log(res);

        console.log(`Test function : anchorJS.latest`);
        console.log(`Except result : Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object\n`);
        anchorJS.latest(anchor,(latest)=>{
            console.log(`Result:`);
            console.log(latest);
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        });
    });
}

function test_anchor_multi(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Get multi anchor data.`);
    console.log(`Test function : anchorJS.multi`);
    console.log(`Except result : Array of Anchor Data Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-data-object\n`);
    self.pushFun('anchorJS.multi',`test_${index}`);

    const his=self.getKV(anchor);
    const list=[anchor,[anchor,his[0]],more];
    console.log(`Anchor list : ${JSON.stringify(list)} \nhttps://github.com/ff13dfly/Anchor/tree/main/js#anchor-location\n`);
    anchorJS.multi(list,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_UTF8_supports(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Write data to anchor "${utf8_a}", UTF8 support.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.write',`test_${index}`);
    self.pushFun('anchorJS.search',`test_${index}`);

    const raw=JSON.stringify({title:self.randomData(12),content:self.randomData(45)});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(1);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,utf8_a,raw,protocol,(res)=>{
        console.log(`Result:`);
        console.log(res);
        if(res.step==="Finalized"){
            anchorJS.search(utf8_a,(data)=>{
                console.log(`\n\nChecking anchor "${utf8_a}" data:`);
                console.log(data);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        }
    });
}