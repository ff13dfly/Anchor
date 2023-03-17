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
const self={
    run:(list,count)=>{
        if(list.length===0){
            test_end=self.stamp();
            console.log(`\nStart from ${test_start}, end at ${test_end}, total cost : ${((test_end-test_start)*0.001).toFixed(3)} s.`);
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

const anchor='trade';  //target anchor, can be checked from Polkadot UI

const list=[
    test_01,
];
self.auto(list);

/********************************************/
/*****************Test parts*****************/
/********************************************/
function test_01(index,ck){
    const start=self.stamp();
    console.log(config.color,`[${index}] ${start}  Search empty anchor "${anchor}"`);
    console.log(`Test function : anchorJS.search`);
    console.log(`Except result : false \n`);

    anchorJS.search(anchor,(res)=>{
        console.log(`Result:`);
        console.log(res);
        const end=self.stamp();
        console.log(config.color,`[${index}] ${end}, cost: ${end-start} ms \n ------------------------------`);
        return ck && ck();
    });
}
