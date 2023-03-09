import { Row, Col, Card,Image,Badge,Button } from 'react-bootstrap';
import { useState,useEffect } from 'react';

import {Accounts} from '../config/accounts';

function Account(props) {
  const ankr=props.anchoJS;

  const self = {
    onSave: () => {
      console.log('click me');
    },
    getMap:()=>{
      let map={};
      for(let i=0;i<Accounts.length;i++){
        const row=Accounts[i];
        map[row.encry.address]=0;
      }
      return map;
    },
    freeCharge:()=>{
      const linker=ankr.getLinker();
      const  fromAccount= linker.keyRing.addFromUri('//Charlie');
      const list=[];
      for(let i=0;i<Accounts.length;i++) list.push(Accounts[i].encry.address);
      self.toAccounts(fromAccount,list,()=>{
        self.render();
      },linker.websocket);
    },

    toAccounts:(from,list,ck,ws)=>{
      setInfo(`Charging, ${list.length} accounts left.`);
      if(list.length===0){
        setInfo(`Free charge successful.`);
        setTimeout(()=>{
          setInfo('');
        },1000);
        return ck && ck();
      } 
      const target=list.pop();
      const amount=self.random(1000,4000);
      ws.tx.balances.transfer(target, amount*1000000000000).signAndSend(from,(res)=>{
        const status=res.status.toHuman();
        if(status.InBlock){
          self.toAccounts(from,list,ck,ws);
        } 
      });
    },
    random:function(min, max){
      return Math.round(Math.random() * (max - min)) + min;
  },
    getList:(map)=>{
      let list=[];
      for(let address in map) list.push(address);
      return list;
    },
    getBalances:(list,ck,done)=>{
      if(done===undefined) done={};
      if(list.length===0) return ck && ck(done);

      let address=list.pop();
      ankr.balance(address,(bc)=>{
        done[address]=parseInt(bc.free*0.000000000001).toLocaleString();
        return self.getBalances(list,ck,done);
      });
    },
    render:()=>{
      const accs=self.getList(balance);
      self.getBalances(accs,(done)=>{
        setBalance(done);
      });

      let avs={};
      for(let acc in icons){
        avs[acc]=`https://robohash.org/${acc}.png`;
      }
      setIcons(avs);
    },
  };

  let [balance,setBalance] = useState(self.getMap());
  let [icons,setIcons] = useState(self.getMap());
  let [info,setInfo] = useState('');

  useEffect(() => {
    self.render();
  },[]);

  return (
    <Row>
      <Col lg={4} xs={12}><h6>Testing Accounts</h6></Col>
      <Col lg={6} xs={6} className="text-end">{info}</Col>
      <Col lg={2} xs={6} className="text-end">
        <Button size="md" variant="primary" onClick={() => {self.freeCharge()}} >Free charge</Button>
      </Col>
      {/* <Col lg={4} xs={6}>
        <Form.Control size="md" type="text" placeholder="Passwor for new account..." onChange={(ev) => {}} />
      </Col>
      <Col lg={2} xs={6} className="text-end">
        <Button size="md" variant="primary" onClick={() => {}} >New Account</Button>
      </Col> */}
      {Accounts.map((item, index) => (
        <Col lg={4} xs={4} className="pt-3" key={index}>
          <Card style={{height:'12rem'}}>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col lg={6} xs={6} >{item.encry.meta.name}</Col>
                  <Col lg={6} xs={6} className="text-end" >
                    <Badge bg="info">{balance[item.encry.address]}</Badge>
                  </Col>
                </Row>
              </Card.Title>
              <Row>
                <Col lg={3} xs={12} >
                  <Image 
                    src={icons[item.encry.address]}
                    rounded
                    width="100%"
                  />
                </Col>
                <Col lg={9} xs={12} >
                  <Row>
                    <Col lg={12} xs={12} >
                      <h5>{item.encry.address}</h5>
                    </Col>
                    <Col lg={12} xs={12} >
                      Password : {item.password}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default Account;