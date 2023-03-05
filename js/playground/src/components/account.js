import { Row, Col, Button, Card, Form,Image } from 'react-bootstrap';
import { useState } from 'react';

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
        //console.log(row);
        map[row.encry.address]=0;
      }
      return map;
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
    },
  };

  let [balance, setBalance] = useState(self.getMap());

  self.render();

  return (
    <Row>
      <Col lg={3} xs={6}><h6>Testing Accounts</h6></Col>
      <Col lg={3} xs={6}></Col>
      <Col lg={4} xs={6}>
        <Form.Control size="md" type="text" placeholder="Passwor for new account..." onChange={(ev) => {}} />
      </Col>
      <Col lg={2} xs={6} className="text-end">
        <Button size="md" variant="primary" onClick={() => {}} >New Account</Button>
      </Col>
      {Accounts.map((item, index) => (
        <Col lg={4} xs={4} className="pt-3" key={index}>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col lg={6} xs={6} >{item.encry.meta.name}</Col>
                  <Col lg={6} xs={6} className="text-end" >{balance[item.encry.address]}</Col>
                </Row>
              </Card.Title>
              <Row>
                <Col lg={3} xs={12} >
                  <Image 
                    src="https://robohash.org/5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq.png"
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