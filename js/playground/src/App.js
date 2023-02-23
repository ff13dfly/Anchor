
import { useState,useEffect,useCallback} from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

import Header from './components/header';
import Search from './components/search';
import Write from './components/write';
import Market from './components/market';
import Account from './components/account';
import Summary from './components/summary';

import {Servers} from './config/servers';
//import {Accounts} from './config/accounts';

import {anchorJS} from './lib/anchor';

let wsAPI=null;
let linking = false;

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
          ck && ck(true);
        });
      } catch (error) {
        linking=false;
        ck && ck(error);
      }
    },
    router:(page)=>{
      switch (page) {
        case '#home':
          setView(<Search anchorJS={anchorJS} />);
          break;

        case '#write':
          setView(<Write />);
          break;
        case '#market':
          setView(<Market />);
          break;
        case '#account':
          setView(<Account />);
          break;
        case '#document':
          setView(<Summary />);
          break;

        default:
          setView(<Search />);
          break;
      }
    },
    status:(info)=>{
      console.log(info);
    },
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
      anchorJS.search("hello",(an)=>{
        console.log(an);
      });
    });
  },[]);

  return (<div id="container"><Header />{view}</div>);
}

export default App;
