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
          "meta":{"name":"market_a"}
        },
        "password": "5HYn3_123456",
    },
    {
        "encry": {
          "encoded":"2ixR6J+Sxp1HKBkqVOc1iDjkkqko1y8neP4XsEvuYOcAgAAAAQAAAAgAAABf7k+ZCxCldOZoQd5zLa0KdrLu/mzJe/ufaze3pBRln5NgPrls5M/T9RlFg0ge0n78/2cOwIhSUXA6RY0FJWYYHXTraV8xwnDNeOqkoDaDqAGRWT4EMHXy9ypzaJxjJqN2DGh4CJi9Ivt+dkorc2YFfq6TYGaDKGWjaMXjV1P+CU8L3K/1ZKKRu9xhGhTJlKyRc2At+WhUF4RgNfpH",
          "encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},
          "address":"5CkLxxzqKs9uHhX8EWpJJRoCTcJD6ErTyEvad8nbVsTFS6gt",
          "meta":{"name":"market_b"}
        },
        "password": "5CkLx_123456",
    },
    {
        "encry": {
          "encoded":"nV6Xv+VIhSUEMDPwdqpqAsHAMAH48dT8ZBSZnLgHwksAgAAAAQAAAAgAAAB+GMrAztlDM0WFG/HhefK6o+qaWs291y5jwgz4EMmvpPkHsWzJVmVoTAlbfAocGjsE+lYX0hmNvudfJaB8OcQcgJW8WRrf3fik0pG11pq+58amwLCQBLmYQdI73DPJDIFSuLlF95toPsz9OPu0FoeyP5cp2rQ6UeaJd3pgT4nadI7lt+CYQD7evtfiBKXPV7CYvqP8aMbeVFK0Gnwh",
          "encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},
          "address":"5FHKmzFC3mDwG7pJKrBZqRWscV9E8hZDfer6aAG17VhQGuXB",
          "meta":{"name":"market_c"}
        },
        "password": "5FHKm_123456",
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

const anchor=`trade_anchor`;     //target anchor, can be checked from Polkadot UI
const list=[
    transfer_from_bob_to_pair_0,        //1.
    transfer_from_bob_to_pair_1,        //2.
    test_anchor_init,                   //3.
    test_anchor_buy_not_on_sell,        //4.
    test_anchor_sell_by_not_owner,      //5.
    test_anchor_sell_free,              //6.
    test_anchor_market,                 //7.
    test_anchor_sell_update,            //8.
    test_anchor_buy_with_low_balance,   //9.
    transfer_from_bob_to_pair_2,        //10.
    test_anchor_buy,                    //11.
    test_anchor_sell_to_target_account, //12.
    test_anchor_unsell_by_not_owner,    //13.
    test_anchor_buy_owner_self,         //14.
    test_anchor_buy_by_not_target,      //15.
    test_anchor_buy_by_target,          //16.
    test_anchor_update_by_not_owner,    //17.
    test_anchor_update_by_owner,        //18.
    test_anchor_unsell,                 //19.
];
self.auto(list);

/********************************************/
/*****************Test parts*****************/
/********************************************/

function transfer_from_bob_to_pair_0(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Bob`);
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    //self.pushFun('anchorJS.balance',`test_${index}`);
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Bob');
    const amount=1919;
    const pair=self.getPair(0);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(balance)=>{
                console.log(`[${index}] Result:`);
                console.log(balance);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        } 
    });
}

function transfer_from_bob_to_pair_1(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Bob`);
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    //self.pushFun('anchorJS.balance',`test_${index}`);
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Bob');
    const amount=1988;
    const pair=self.getPair(1);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(balance)=>{
                console.log(`[${index}] Result:`);
                console.log(balance);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        } 
    });
}

function test_anchor_init(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} init anchor "${anchor}"`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    //self.pushFun('anchorJS.write',`test_${index}`);

    const raw=JSON.stringify({title:"this is a test for market",content:self.randomData(34)});
    const protocol=JSON.stringify({type:"data"});
    const pair=self.getPair(0);
    console.log(`Acccount address : ${pair.address}`);
    anchorJS.write(pair,anchor,raw,protocol,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);
        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    });
}

function test_anchor_buy_not_on_sell(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Set anchor "${anchor}" to selling status by wrong account`);
    console.log(`Test function : anchorJS.buy`);
    console.log(`Except result : {"error":"${anchor} is not on sell"}\n`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy error : unselling anchor.');

    const pair=self.getPair(1);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_sell_by_not_owner(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Set anchor "${anchor}" to selling status by wrong account`);
    console.log(`Test function : anchorJS.sell`);
    console.log(`Except result : {"error":"Not the owner of ${anchor}"}\n`);
    self.pushFun('anchorJS.sell',`test_${index}`,'sell error : not the owner.');

    anchorJS.owner(anchor,(owner)=>{
        
        const pair=self.getPair(1);
        const price = 699;
        console.log(`Owner address : ${owner}`);
        console.log(`Operation address : ${pair.address}`);
        anchorJS.sell(pair,anchor,price,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);

            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        });
    });
}

function test_anchor_sell_free(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Set anchor "${anchor}" to selling status`);
    console.log(`Test function : anchorJS.sell`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.sell',`test_${index}`,'sell successful.');

    anchorJS.owner(anchor,(owner)=>{
        const pair=self.getPair(0);
        const price = 499;
        console.log(`Owner address : ${owner}`);
        console.log(`Operation address : ${pair.address}`);
        anchorJS.sell(pair,anchor,price,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);
            if(res.step==="Finalized"){
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            }
        });
    });
}

function test_anchor_market(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} Get selling anchors.`);
    console.log(`Test function : anchorJS.sell`);
    console.log(`Except result : Array of Market Object\n`);
    self.pushFun('anchorJS.market',`test_${index}`,'market list successful.');

    anchorJS.market((list)=>{
        console.log(`[${index}] Result:`);
        console.log(list);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_sell_update(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} update anchor "${anchor}" selling status`);
    console.log(`Test function : anchorJS.sell`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.sell',`test_${index}`,'sell update successful.');

    anchorJS.search(anchor,(data)=>{
        const pair=self.getPair(0);
        const price = 799;
        console.log(`Current price : ${data.cost}`);
        console.log(`Update price : ${price}`);

        anchorJS.sell(pair,anchor,price,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);
            if(res.step==="Finalized"){
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            }
        });
    });
}

function test_anchor_buy_with_low_balance(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} buy anchor "${anchor}" with low balance`);
    console.log(`Test function : anchorJS.buy`);
    console.log(`Except result : {"error":"Low balance"}\n`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy error : low balance.');

    const pair=self.getPair(2);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function transfer_from_bob_to_pair_2(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Bob`);
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    //self.pushFun('tx.balances.transfer',`test_${index}`);
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Bob');
    const amount=2633;
    const pair=self.getPair(2);
    console.log(`Target address ${pair.address}, units ${amount.toLocaleString()}`);
    websocket.tx.balances.transfer(pair.address, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
            anchorJS.balance(pair.address,(balance)=>{
                console.log(`[${index}] Result:`);
                console.log(balance);
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });
        } 
    });
}

function test_anchor_buy(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} buy anchor "${anchor}" successful.`);
    console.log(`Test function : anchorJS.buy`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy successful.');

    const pair=self.getPair(2);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    });
}

function test_anchor_sell_to_target_account(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} sell anchor "${anchor}" to target account`);
    console.log(`Test function : anchorJS.sell`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.sell',`test_${index}`,'sell to target account successful.');

    const pair=self.getPair(2);
    const price=89;
    const target=self.getPair(1);

    anchorJS.sell(pair,anchor,price,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);
        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    },target.address);
}

function test_anchor_unsell_by_not_owner(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} unsell anchor "${anchor}" by wrong account.`);
    console.log(`Test function : anchorJS.unsell`);
    console.log(`Except result : {"error":"Not the owner of ${anchor}"}`);
    self.pushFun('anchorJS.unsell',`test_${index}`,'unsell error : not the owner.');

    anchorJS.owner(anchor,(owner)=>{
        const pair=self.getPair(0);
        console.log(`Owner address : ${owner}`);
        console.log(`Operation address : ${pair.address}`);

        anchorJS.unsell(pair,anchor,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);

            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        });
    });
}

function test_anchor_buy_owner_self(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} buy your own anchor.`);
    console.log(`Test function : anchorJS.unsell`);
    console.log(`Except result : {"error":"Your own anchor"}`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy error : your own anchor.');

    const pair=self.getPair(2);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_buy_by_not_target(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} buy anchor "${anchor}" not the target account.`);
    console.log(`Test function : anchorJS.unsell`);
    console.log(`Except result : {"error":"Not target account"}`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy error : not target account.');

    const pair=self.getPair(0);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function test_anchor_buy_by_target(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} buy anchor "${anchor}" by target account successful.`);
    console.log(`Test function : anchorJS.unsell`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.buy',`test_${index}`,'buy by target account successful.');

    const pair=self.getPair(1);
    anchorJS.buy(pair,anchor,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        if(res.step==="Finalized"){
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        }
    });
}

function test_anchor_update_by_not_owner(index,ck){
    const start=self.stamp(); 
    console.log(config.color,`[${index}] ${start} update anchor "${anchor}" by wrong owner.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result :{"error":"Not the owner of ${anchor}"}`);
    //self.pushFun('anchorJS.write',`test_${index}`);

    anchorJS.owner(anchor,(owner)=>{
        const raw=JSON.stringify({title:"owner changed.",content:self.randomData(22)});
        const protocol=JSON.stringify({type:"data"});
        const pair=self.getPair(2);
        console.log(`Owner address : ${owner}`);
        console.log(`Operation address : ${pair.address}`)
        anchorJS.write(pair,anchor,raw,protocol,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);

            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        });
    });
}

function test_anchor_update_by_owner(index,ck){
    const start=self.stamp(); 
    console.log(config.color,`[${index}] ${start} update anchor "${anchor}" successful.`);
    console.log(`Test function : anchorJS.write`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    //self.pushFun('anchorJS.write',`test_${index}`);

    anchorJS.owner(anchor,(owner)=>{
        const raw=JSON.stringify({title:"owner changed.",content:self.randomData(22)});
        const protocol=JSON.stringify({type:"data"});
        const pair=self.getPair(1);
        console.log(`Owner address : ${owner}`);
        console.log(`Operation address : ${pair.address}`)
        anchorJS.write(pair,anchor,raw,protocol,(res)=>{
            console.log(`[${index}] Result:`);
            console.log(res);
            if(res.step==="Finalized"){
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            }
        });
    });
}

function test_anchor_unsell(index,ck){
    const start=self.stamp(); 
    console.log(config.color,`[${index}] ${start} sell/unsell anchor "${anchor}" successful.`);
    console.log(`Test function : anchorJS.unsell & anchorJS.sell`);
    console.log(`Except result : Status Object \nhttps://github.com/ff13dfly/Anchor/tree/main/js#status-object\n`);
    self.pushFun('anchorJS.unsell',`test_${index}`,'unsell successful.');
    self.pushFun('anchorJS.sell',`test_${index}`,'sell successful.');

    const pair=self.getPair(1);
    const price = 399;
    anchorJS.sell(pair,anchor,price,(res)=>{
        console.log(`[${index}] Result:`);
        console.log(res);

        if(res.step==="Finalized"){
            anchorJS.unsell(pair,anchor,(status)=>{

                console.log(`[${index}] Result:`);
                console.log(status);

                if(status.step==="Finalized"){
                    const end=self.stamp();
                    console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                    return ck && ck();
                }
            });
        }
    });
}