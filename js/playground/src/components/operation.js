import { Row, Col, Button, Form } from 'react-bootstrap';
import { useEffect,useState } from 'react';

import {Accounts} from '../config/accounts';

function Operation(props) {
  const anchor=props.anchor;
  const ankr=props.anchorJS;
  const owner=props.owner;
  //console.log(ankr);

  let [price,setPrice]=useState(0);
  let [account,setAccount]=useState(0);
  let [free,setFree]=useState(false);
  let [password,setPassword]=useState(0);

  const self={
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    changeFree:(ev)=>{
      setFree(!free);
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    sell:()=>{
      if(price <=0) return false;
      let acc=null;
      for(let i=0;i<Accounts.length;i++){
        const  row=Accounts[i];
        if(row.encry.address===owner) acc=row;
      }

      if(acc===null) return false;

      const target=!free?Accounts[account].encry.address:undefined;
      ankr.load(acc.encry,password,(pair)=>{
        if(!pair) return false;
        console.log(pair);
        ankr.sell(pair,anchor,price,(res)=>{
          console.log(res);
        },target);
      });
    },
  };

  const op_null='';
  const op_normal=(
    <Row>
      
      <Col lg={10} xs={12} className="pt-2" >
        <Form.Select aria-label="Default select" disabled={free} onChange={(ev) => { self.changeAccount(ev) }}>
          {Accounts.map((item,index) => (
              <option value={index} key={index}>{item.encry.meta.name}:{item.encry.address}</option>
          ))}
        </Form.Select>
      </Col>
      <Col lg={2} xs={12} className="pt-2" >
        <Form.Group className="mb-3" controlId="formBasicCheckbox" onChange={(ev) => { self.changeFree(ev)}} >
          <Form.Check type="checkbox" label="Freely" className='pt-2'/>
        </Form.Group>
      </Col>
      <Col lg={5} xs={12} className="pt-2" >
        <Form.Control size="md" type="number" placeholder="Price..." onChange={(ev) => { self.changePrice(ev)}} />
      </Col>
      <Col lg={5} xs={12} className="pt-2" >
        <Form.Control size="md" type="password" placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
        </Col>
      <Col lg={2} xs={12} className="pt-2 text-end" >
        <Button size="md" variant="primary" onClick={() => {self.sell()}} > Sell </Button>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <small className='text-success'>Selling anchor in two ways target and freely. Anchor owner Password:<span className='text-danger ml-2 mr-2 bg-warning'>123456</span></small>
      </Col>
    </Row>
  );
  const op_sell=(
    <Row>
      <Col lg={8} xs={12} className="pt-2" ></Col>
      <Col lg={2} xs={4} className="pt-2 text-end" >
        <Button size="md" variant="primary" className="mr-2" onClick={() => {}} > Unsell </Button>
      </Col>
      <Col lg={2} xs={6} className="pt-2 text-end" >
        <Button size="md" variant="primary" onClick={() => { }} > Buy </Button>
      </Col>
    </Row>
  );
  useEffect(() => {

  }, []);
  if(!props.anchor) return op_null;
  return props.sell?op_sell:op_normal;
}
export default Operation;