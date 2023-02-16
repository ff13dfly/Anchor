
import { useState,useEffect,useCallback} from 'react';

import Header from './components/header';
import Search from './components/search';
import Write from './components/write';
import Account from './components/account';
import Nodes from './components/nodes';
import Summary from './components/summary';

function App() {
  //let [page, setPage] = useState('#');

  let [view,setView]=useState('');

  const self={
    router:(page)=>{
      switch (page) {
        case '#home':
          setView(<Search />);
          break;

        case '#write':
          setView(<Write />);
          break;
        case '#account':
          setView(<Account />);
          break;
        case '#nodes':
          setView(<Nodes />);
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
