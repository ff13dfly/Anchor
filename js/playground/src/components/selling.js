import { Row, Col, Button, Form,Badge } from 'react-bootstrap';
import { useEffect,useState,useRef } from 'react';

import {Accounts} from '../config/accounts';

function Selling(props) {
  const anchor=props.anchor;
  const ankr=props.anchorJS;
  const owner=props.owner;
  
  let [price,setPrice]=useState(0);
  let [account,setAccount]=useState(0);
  let [free,setFree]=useState(true);
  let [password,setPassword]=useState(0);

  let [remind,setRemind]=useState(Accounts[0].password);
  let [process,setProcess]=useState('');
  let [disabled,setDisabled]= useState(false);
  let [hidden,setHidden]=useState('hidden');
  let [checked,setChecked]=useState('checked');

  const refPrice = useRef(null);
  const refPassword = useRef(null);

  const self={
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    changeFree:(ev)=>{
      setFree(!free);
      setChecked(checked==='checked'?'':'checked');
      setHidden(checked==='checked'?'':'hidden');
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
    },
    clear:()=>{
      refPrice.current.value = "";
      refPassword.current.value = "";
    },
    getOwnerPassword:(owner)=>{
      for(let i=0;i<Accounts.length;i++){
        const row=Accounts[i];
        if(row.encry.address===owner) return row.password;
        //console.log(row);
      }
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

          setProcess(res.message);
          if(res.step==="Finalized"){
            setDisabled(false);
            setProcess('Finalized');
            self.clear();
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
    const pass=self.getOwnerPassword(owner);
    setRemind(pass);
  }, []);

  return (
    <Row>
      <Col lg={5} xs={12} className="pt-2" >
        <small className='text-success'>Owner password: <Badge bg="info">{remind}</Badge></small>
      </Col>
      <Col lg={7} xs={12} className="pt-2 text-end" >{process}</Col>
      <Col lg={5} xs={12} className="pt-1" >
        <Form.Control size="md" type="number" ref={refPrice} disabled={disabled} placeholder="Price..." onChange={(ev) => { self.changePrice(ev)}} />
      </Col>
      <Col lg={5} xs={12} className="pt-1">
        <Form.Control size="md" type="password" ref={refPassword} disabled={disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
      </Col>
      <Col lg={2} xs={12} className="pt-1 text-end" >
        <Button size="md" variant="primary" disabled={disabled} onClick={() => {self.sell()}} > Sell </Button>
      </Col>
      
      <Col lg={10} xs={12} className="pt-2">
        <Form.Select aria-label="Default select" disabled={free || disabled} hidden={hidden} onChange={(ev) => {self.changeAccount(ev)}}>
          {Accounts.map((item,index) => (
            <option value={index} key={index}>{item.encry.address}</option>
            // {item.encry.address}===owner?'':(<option value={index} key={index}>{item.encry.address}</option>)
          ))}
        </Form.Select>
      </Col>
      <Col lg={2} xs={12} className="pt-2">
        <Form.Group className="mb-3" controlId="formBasicCheckbox"  >
          <Form.Check type="checkbox" label="Freely" className='pt-2' onChange={(ev) => { self.changeFree(ev)}} checked={checked}/>
        </Form.Group>
      </Col>
    </Row>
  );
}
export default Selling;