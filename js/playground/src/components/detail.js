import { Row, Col, Badge, Card,Button,Form} from 'react-bootstrap';
import { useState,useRef } from 'react';

import Selling from './selling';
import {Accounts} from '../config/accounts';

import STORAGE from '../lib/storage';
import Keys from '../config/keys';

function Detail(props) {
  const anchor = props.data.error ? {} : props.data;
  //console.log(anchor);
  const ankr = props.anchorJS;


  //let [URI, setURI] = useState(!anchor ? '#' : `https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer/query/${anchor.block}`);
  let [password,setPassword]=useState(0);
  let [process,setProcess]=useState('');
  let [disabled,setDisabled]= useState(false);

  const refPassword = useRef(null);

  const nodes=STORAGE.getCache(Keys.node);
  const URI=`https://polkadot.js.org/apps/?rpc=${nodes[0]}#/explorer/query/${anchor.block}`;

  const self = {  
    format: (stamp) => {
      var dt = new Date(stamp);
      return dt.toLocaleString();
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    unsell:()=>{
      //console.log('here,password:'+password);
      const owner=anchor.owner;
      let acc=null;
      for(let i=0;i<Accounts.length;i++){
        const  row=Accounts[i];
        if(row.encry.address===owner) acc=row;
      }
      if(acc===null) return false;
      setDisabled(true);

      ankr.load(acc.encry,password,(pair)=>{
        if(!pair){
          setProcess('Password error.');
          setDisabled(false);
          return false;
        } 
        ankr.unsell(pair,anchor.name,(res)=>{
          if(res.error){
            return setProcess(res.error);
          }

          setProcess(res.message);
          if(res.step==="Finalized"){
            setDisabled(false);
            setProcess('Finalized');
            refPassword.current.value="";
            return setTimeout(()=>{
              setProcess('');
              props.fresh(anchor.name);
            },1000);
          }
          
        });
      });
    },
  };

  return (
    <Row>
      <Col lg={12} xs={12} className="pt-2" >
        <Card>
          <Card.Body>
            <table className='table'>
              <tbody>
                <tr>
                  <td>Block</td>
                  <td>
                  <Row>
                    <Col lg={3} xs={6}>
                      <h5><Badge bg="info">{anchor.block.toLocaleString()}</Badge></h5>
                    </Col>
                    <Col lg={9} xs={6} className="text-end" >
                    <a target="_blank" rel="noreferrer" href={URI}>Browse block on https://polkadot.js.org/apps/</a>
                    </Col>
                  </Row>
                  </td>
                </tr>
                <tr>
                  <td>Raw</td>
                  <td>{typeof anchor.raw !== 'string'?JSON.stringify(anchor.raw):anchor.raw}</td>
                </tr>
                <tr>
                  <td>Protocol</td>
                  <td>{typeof anchor.protocol !== 'string'?JSON.stringify(anchor.protocol):anchor.protocol}</td>
                </tr>
                <tr>
                  <td>Pre</td>
                  <td>{anchor.pre}</td>
                </tr>
                <tr>
                  <td>Last</td>
                  <td>{anchor.signer}</td>
                </tr>
                <tr>
                  <td>Stamp</td>
                  <td>{!anchor.stamp ? '' : self.format(anchor.stamp)}</td>
                </tr>
                <tr>
                  <td>Owner</td>
                  <td><h5><Badge bg="info">{anchor.owner}</Badge></h5></td>
                </tr>
                <tr>
                  <td>Selling</td>
                  <td>
                    <Row>
                      <Col lg={5} xs={5}>
                        <h5><Badge bg="info">
                          {!anchor ? '' : (anchor.sell ? ("Yes, price "+anchor.cost.toLocaleString()) : "No")}
                        </Badge></h5>
                      </Col>
                      <Col lg={5} xs={5} className="text-end">
                        <Form.Control size="sm" type="password" ref={refPassword} disabled={!anchor.sell || disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
                      </Col>
                      <Col lg={2} xs={2} className="text-end">
                        <Button size="sm" variant="primary" disabled={!anchor.sell || disabled} onClick={() => {self.unsell()}} > Unsell </Button>
                      </Col>
                      <Col lg={12} xs={12} className="text-end" >{process}</Col>
                    </Row>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12} xs={12} className="pt-2" ></Col>
      <Col lg={12} xs={12} className="pt-4" ></Col>
      <Col lg={12} xs={12}>
        <Selling 
          sell={(!anchor || !anchor.sell) ? false : true} 
          anchor={!anchor ? '' : anchor.name} 
          owner={anchor.owner}  
          anchorJS={props.anchorJS}
          fresh={props.fresh}
        />
      </Col>
    </Row>
  );
}
export default Detail;