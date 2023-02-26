
import { useState,useEffect,useCallback} from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

import Header from './components/header';
import Search from './components/search';
import Write from './components/write';
import Market from './components/market';
import Setting from './components/setting';
import Summary from './components/summary';

import {Servers} from './config/servers';
import {Accounts} from './config/accounts';

import {anchorJS} from './lib/anchor';

let wsAPI=null;
let linking = false;

//UI documents
//https://www.react-bootstrap.cn/components/alerts

function App() {
  let [view,setView]=useState('');
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
      const dom=pages[hash]===undefined?pages['#home']:pages[hash];
      setView(dom);
    },
    status:(info)=>{
      console.log(info);
    },
    fresh:(node)=>{

    },
  };

  const pages={
    '#home':(<Search anchorJS={anchorJS}></Search>),
    '#write':(<Write  anchorJS={anchorJS} accounts={Accounts}></Write>),
    '#market':(<Market anchorJS={anchorJS} />),
    '#setting':(<Setting anchorJS={anchorJS} list={Accounts} server={Servers} fresh={self.fresh}/>),
    '#document':(<Summary anchorJS={anchorJS} />),
  };

  const handleChangeEvent = useCallback(() => {
      self.router(window.location.hash);
  }, []);

  
  useEffect( ()=> {
    window.addEventListener('hashchange', handleChangeEvent);
    self.router(window.location.hash);
    self.link(Servers.nodes[0],(res)=>{
      if(!res) return self.status(`Failed to link to node ${res}`);
      anchorJS.set(wsAPI);
      anchorJS.setKeyring(Keyring);
    });
  },[]);

  return (<div id="container"><Header />{view}</div>);
}

export default App;
