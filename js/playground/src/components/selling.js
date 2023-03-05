import { Row, Col, Button, Form } from 'react-bootstrap';
import { useEffect,useState } from 'react';

import {Accounts} from '../config/accounts';

function Selling(props) {
  const anchor=props.anchor;
  const ankr=props.anchorJS;
  const owner=props.owner;
  //console.log(ankr);

  let [price,setPrice]=useState(0);
  let [account,setAccount]=useState(0);
  let [free,setFree]=useState(false);
  let [password,setPassword]=useState(0);

  let [remind,setRemind]=useState(Accounts[0].password);
  let [process,setProcess]=useState('');
  let [disabled,setDisabled]= useState(false);

  const self={
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    changeFree:(ev)=>{
      setFree(!free);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
      const row=Accounts[ev.target.value];
      setRemind(row.password);
    },
    sell:()=>{
      if(price <=0) return false;
      let acc=null;
      for(let i=0;i<Accounts.length;i++){
        const  row=Accounts[i];
        if(row.encry.address===owner) acc=row;
      }

      if(acc===null) return false;

      setDisabled(true);
      const target=!free?Accounts[account].encry.address:undefined;
      ankr.load(acc.encry,password,(pair)=>{
        if(!pair) return false;
        ankr.sell(pair,anchor,price,(res)=>{
          if(res.error){
            return setProcess(res.error);
          }

          const status=res.status.toHuman();
          if (typeof (status) == 'string') return setProcess(status);
          if(status.InBlock){
            return setProcess('InBlock, nearly done.');
          }
          if(status.Finalized){
            setDisabled(false);
            setProcess('Finalized');
            return setTimeout(()=>{
              setProcess('');
              props.fresh(anchor);
            },1000);
          }

        },target);
      });
    },
  };

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col lg={12} xs={12} className="pt-2" >
        <small className='text-success'>Selling anchor in two ways target and freely. Anchor owner Password:<span className='text-danger ml-2 mr-2 bg-warning'>{remind}</span></small>
      </Col>
      <Col lg={10} xs={12}>
        <Form.Select aria-label="Default select" disabled={free || disabled} onChange={(ev) => { self.changeAccount(ev) }}>
          {Accounts.map((item,index) => (
              <option value={index} key={index}>{item.encry.address}</option>
          ))}
        </Form.Select>
      </Col>
      <Col lg={2} xs={12}>
        <Form.Group className="mb-3" controlId="formBasicCheckbox" onChange={(ev) => { self.changeFree(ev)}} >
          <Form.Check type="checkbox" label="Freely" className='pt-2'/>
        </Form.Group>
      </Col>
      <Col lg={5} xs={12} className="pt-2" >
        <Form.Control size="md" type="number" disabled={disabled} placeholder="Price..." onChange={(ev) => { self.changePrice(ev)}} />
      </Col>
      <Col lg={5} xs={12} className="pt-2" >
        <Form.Control size="md" type="password" disabled={disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
      </Col>
      <Col lg={2} xs={12} className="pt-2 text-end" >
        <Button size="md" variant="primary" disabled={disabled} onClick={() => {self.sell()}} > Sell </Button>
      </Col>
      <Col lg={12} xs={12} className="text-end" >{process}</Col>
    </Row>
  );
}
export default Selling;