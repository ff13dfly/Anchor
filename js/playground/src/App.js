
import { useState,useEffect,useCallback} from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

import Header from './components/header';
import Search from './components/search';
import Write from './components/write';
import Market from './components/market';
import Setting from './components/setting';
import Summary from './components/summary';

import {anchorJS} from './lib/anchor';
import {Servers} from './config/servers';
import {Accounts} from './config/accounts';

import STORAGE from './lib/storage';
import Keys from './config/keys';

let wsAPI=null;
let linking = false;

//UI documents
//https://www.react-bootstrap.cn/components/alerts

function App() {
  let [view,setView]=useState('');

  //persist node storage.
  const map={};
  map.node_persist=Keys.node_persist;
  STORAGE.setMap(map);

  const handleChangeEvent = useCallback(() => {
    self.router(window.location.hash);
  }, []);

  const self={
    link:(node,ck) => {
      if(linking) return setTimeout(()=>{
        self.link(node,ck);
      },500);
      if(wsAPI!==null) return ck && ck(wsAPI);

      try {
        self.status(`Trying to link node : ${node}`);
        linking=true;
        const provider = new WsProvider(node);
        ApiPromise.create({ provider: provider }).then((api) => {
          if(wsAPI===null) wsAPI=api;
          linking=false;
          return ck && ck(true);
        });
      } catch (error) {
        linking=false;
        return ck && ck(error);
      }
    },
    router:(hash)=>{
      console.log(hash);
      if(hash!=="#home" && !anchorJS.ready()){
        return setTimeout(()=>{
          self.router(hash);
        },200);
      }
      const dom=pages[hash]===undefined?pages['#home']:pages[hash];
      setView(dom);
    },
    status:(info)=>{
      console.log(info);
    },
    fresh:(anchor)=>{
      self.router(window.location.hash);
    },
    relink:(URI)=>{
      wsAPI=null;
      self.link(URI,(res)=>{
        if(!res) return self.status(`Failed to link to node ${res}`);
        if(!anchorJS.set(wsAPI)){
          console.log('Error anchor node.');
        }
        anchorJS.setKeyring(Keyring);

        self.router(window.location.hash);
      });
    },
    //load customer localstorage accounts
    loadSetting:()=>{
      //load custome nodes.
      const ps=STORAGE.getPersist('node_persist');
      let list=[];
      if(ps!==null){
        for(let i=0;i<ps.length;i++){
          list.push(ps[i]);
        }
      }else{
        for(let i=0;i<Servers.nodes.length;i++){
          list.push(Servers.nodes[i]);
        }
        STORAGE.setPersist('node_persist',list);
      }
      STORAGE.setCache(Keys.node,list);
    },
  };

  const pages={
    '#home':(<Search anchorJS={anchorJS} fresh={self.fresh} ></Search>),
    '#write':(<Write  anchorJS={anchorJS} accounts={Accounts}></Write>),
    '#market':(<Market anchorJS={anchorJS} />),
    '#setting':(<Setting anchorJS={anchorJS} list={Accounts} fresh={self.relink}/>),
    '#document':(<Summary anchorJS={anchorJS} />),
  };
  
  useEffect( ()=> {
    window.addEventListener('hashchange', handleChangeEvent);
    self.loadSetting();
    self.router(window.location.hash);

    const list=STORAGE.getCache(Keys.node);
    self.link(list[0],(res)=>{
      if(!res) return self.status(`Failed to link to node ${res}`);
      if(!anchorJS.set(wsAPI)){
        console.log('Error anchor node.');
      }
      anchorJS.setKeyring(Keyring);
    });
  },[]);

  return (<div id="container"><Header />{view}</div>);
}

export default App;
