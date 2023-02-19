
import { useState,useEffect,useCallback} from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

import Header from './components/header';
import Search from './components/search';
import Write from './components/write';
import Market from './components/market';
import Account from './components/account';
import Summary from './components/summary';

function App() {
  let [view,setView]=useState('');

  const self={
    link:(node,ck) => {
        try {
          const provider = new WsProvider(node);
          ApiPromise.create({ provider: provider }).then((api) => {
            ck && ck(api);
          });
        } catch (error) {
          ck && ck(false);
        }
    },
    router:(page)=>{
      switch (page) {
        case '#home':
          setView(<Search />);
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
  };

  const handleChangeEvent = useCallback(() => {
      self.router(window.location.hash);
      
  }, []);

  
  useEffect( ()=> {
    window.addEventListener('hashchange', handleChangeEvent);
    self.router(window.location.hash);
  }, []);

  return (<div id="container"><Header />{view}</div>);
}

export default App;
