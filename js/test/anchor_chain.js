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
          "encoded":"2ixR6J+Sxp1HKBkqVOc1iDjkkqko1y8neP4XsEvuYOcAgAAAAQAAAAgAAABf7k+ZCxCldOZoQd5zLa0KdrLu/mzJe/ufaze3pBRln5NgPrls5M/T9RlFg0ge0n78/2cOwIhSUXA6RY0FJWYYHXTraV8xwnDNeOqkoDaDqAGRWT4EMHXy9ypzaJxjJqN2DGh4CJi9Ivt+dkorc2YFfq6TYGaDKGWjaMXjV1P+CU8L3K/1ZKKRu9xhGhTJlKyRc2At+WhUF4RgNfpH",
          "encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},
          "address":"5CkLxxzqKs9uHhX8EWpJJRoCTcJD6ErTyEvad8nbVsTFS6gt",
          "meta":{"name":"mock_f"}
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
            console.log(`********************End of test********************`);
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
        return ck && ck();
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
        self.prework(()=>{
            test_start=self.stamp();
            console.log(`\n********************Start of test********************\n`);
            self.run(list,list.length);
        });
    },
};

/********************************************/
/*****************Test queue*****************/
/********************************************/

const anchor='trade';  //target anchor, can be checked from Polkadot UI

const list=[
    test_check_status_before_set,       //1.
    test_subscribe,                     //2.
    test_check_status,                  //3.
    test_load_encry_error,              //4.
    test_encry_load,                    //5.
    transfer_from_alice_to_writer,      //6.
    test_anchor_write,                  //7.
];
self.auto(list);

/********************************************/
/*****************Test parts*****************/
/********************************************/

function test_check_status_before_set(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} check anchorJS status`);
    console.log(`Test function : anchorJS.ready`);
    console.log(`Except result : false \n`);
    self.pushFun('anchorJS.ready',`test_${index}`,'false status.');

    console.log(`[${index}] Result:`);
    console.log(anchorJS.ready());

    const end=self.stamp();
    console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
    return ck && ck();
}


function test_subscribe(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} subcribe anchor node.`);
    console.log(`Test function : anchorJS.subcribe`);
    console.log(`Except result : listen to node and get list of finalized anchors \n`);
    
    self.pushFun('anchorJS.set',`test_${index}`,'set successful.');
    self.pushFun('anchorJS.setKeyring',`test_${index}`,'set successful.');
    self.pushFun('anchorJS.subcribe',`test_${index}`,'set successful.');

    ApiPromise.create({ provider: new WsProvider(config.endpoint) }).then((api) => {
        console.log('Linker to substrate node created...');
        websocket=api;
        anchorJS.set(api);
        anchorJS.setKeyring(Keyring);

        let first=true;
        anchorJS.subcribe((list)=>{
            if(first){
                console.log(`[${index}] Result of subcribe:`);
                console.log(list);
                console.log(`[${index}] Above is the first subscribe result. To avoid effect the output, will skip empty subcribe.`);
                first=false;
            }

            if(list.length!==0){
                console.log(`[${index}] Result of subcribe:`);
                console.log(list);
            }
        });

        setTimeout(()=>{
            const end=self.stamp();
            console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
            return ck && ck();
        },3000);
    });
}

function test_check_status(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  check anchorJS status`);
    console.log(`Test function : anchorJS.ready`);
    console.log(`Except result : true \n`);
    self.pushFun('anchorJS.ready',`test_${index}`,'true status.');

    console.log(`[${index}] Result:`);
    console.log(anchorJS.ready());

    const end=self.stamp();
    console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
    return ck && ck();
}

function test_load_encry_error(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  load encry and decode error test.`);
    console.log(`Test function : anchorJS.load`);
    console.log(`Except result : {"error":"error list"} \n`);
    

    const account=accounts[0];
    const suffix='test';
    const wrong_password=account.password+suffix;
    const len=account.encry.encoded.length;
    console.log(`Invalid password : ${wrong_password}`);
    console.log(`Right password : ${account.password}`);
    anchorJS.load(account.encry,wrong_password,(err_pass)=>{
        console.log(`[${index}] Result:`);
        console.log(err_pass);
        self.pushFun('anchorJS.load',`test_${index}`,'invalid password.');
        
        const address=account.encry.address;
        account.encry.address+=suffix;
        console.log(`\nInvalid address : ${account.encry.address}`);
        console.log(`Right address : ${address}`);
        anchorJS.load(account.encry,account.password,(err_address)=>{
            console.log(`[${index}] Result:`);
            console.log(err_address);
            self.pushFun('anchorJS.load',`test_${index}`,'invalid address.');
            
            account.encry.address=address;
            account.encry.encoded+=suffix;
            console.log(`\nInvalid encoded lenghth : ${account.encry.encoded.length}`);
            console.log(`Right encoded lenghth : ${len}`);
            anchorJS.load(account.encry,account.password,(err_encry)=>{
                console.log(`[${index}] Result:`);
                console.log(err_encry);
                self.pushFun('anchorJS.load',`test_${index}`,'invalid encry data.');

                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            });

        });
    });
}

function test_encry_load(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  load encry and decode successful.`);
    console.log(`Test function : anchorJS.load`);
    console.log(`Except result : Pair Object\n`);
    self.pushFun('anchorJS.load',`test_${index}`,'load successful.');

    const account=accounts[1];
    anchorJS.load(account.encry,account.password,(pair)=>{
        console.log(`[${index}] Result:`);
        console.log(pair);
        self.setKV('writer',pair);

        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}

function transfer_from_alice_to_writer(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} transfer units from test account Alice`);
    console.log(`Test function : anchorJS.balance`);
    console.log(`Except result : Balance Object\nhttps://github.com/ff13dfly/Anchor/tree/main/js#balance-object\n`);
    self.pushFun('anchorJS.balance',`test_${index}`,'get successful');
    
    const ks = new Keyring({ type: 'sr25519' });
    const from= ks.addFromUri('//Alice');
    const amount=1919;
    const pair=self.getKV('writer');
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

function test_anchor_write(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start} write anchor to try subscribe`);
    console.log(`Test function : anchorJS.subcribe`);
    console.log(`Except result : false \n`);
    self.pushFun('anchorJS.subcribe',`test_${index}`,'get subcribe data successful.');

    const pair=self.getKV('writer');
    console.log(`Writer address : ${pair.address}`);

    const name=self.randomData(10);
    const raw=self.randomData(50);
    const protocol=self.randomData(20);

    anchorJS.write(pair,name,raw,protocol,(status)=>{
        //console.log(`Status:${JSON.stringify(status)}`);
        if(status.step==="Ready"){
            console.log(`[${index}] Ready to write new anchor to node.`);
        }

        if(status.step==="InBlock"){
            console.log(`[${index}] Aready done, please wait for the subcribe data in 5 seconds.`);
        }

        if(status.step==="Finalized"){
            setTimeout(()=>{
                const end=self.stamp();
                console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
                return ck && ck();
            },1000);
        }
    });
}
