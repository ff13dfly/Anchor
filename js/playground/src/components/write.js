import { Container,Row, Col,Badge,Button, Form} from 'react-bootstrap';
import { useEffect,useState } from 'react';

import History from './history';


function Write(props) {
  const accounts=props.accounts;

  let [name,setName]=useState("");
  let [raw,setRaw]=useState("");
  let [protocol,setProtocol]=useState("");
  let [account,setAccount]=useState(0);
  let [password,setPassword]=useState(0);

  let [more, setMore] = useState("");
  let [disabled,setDisabled]= useState(false);
  let [info,setInfo]=useState('');
  let [remind,setRemind]=useState(accounts[0].password);

  const ankr=props.anchorJS;

  const self={
    changeName:(ev)=>{
      setName(ev.target.value);
    },
    changeRaw:(ev)=>{
      setRaw(ev.target.value);
      self.render();
    },
    changeProtocol:(ev)=>{
      setProtocol(ev.target.value);
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
      const row=accounts[ev.target.value];
      setRemind(row.password);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    clear:()=>{
      setName('');
      setRaw('');
      setProtocol('');
      setPassword('');
    },
    getPair:(ck)=>{
      const acc=accounts[account];
      ankr.load(acc.encry,password,(pair)=>{
        return ck && ck(pair);
      });
    },
    onSave:()=>{
      if(!accounts[account]) return console.log('Account error');
      setDisabled(true);
      self.getPair((pair)=>{
        if(pair===false) return false;
        ankr.write(pair,name,raw, protocol, (res)=>{
          if(res.error){
            setDisabled(false);
            return setInfo(res.error);
          } 

          const status=res.status.toHuman();
          if (typeof (status) == 'string') return setInfo(status);

          if(status.InBlock){
            //setDisabled(false);
            return setInfo('InBlock, waiting for Finalized');
          }

          if(status.Finalized){
            self.render();
            setDisabled(false);
            //self.clear();
            return setInfo('Finalized');
          }
        });
      });
    },
    render:()=>{
      if(!name) return false;
      ankr.history(name,(list)=>{
        if(!list) return setMore('No result.');
        setMore(<History list={list} block={0} change={()=>{}} />);
      });
    },
  };

  useEffect(() => {
    
  },[]);

  return (
    <Container> 
      <Row>
        <Col lg={7} xs={12} className="pt-4">
          <Row>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Unique name. If not exsist, will initialize, otherwise will update. 40 Bytes max.</small>
              <Form.Control size="md" type="text" disabled={disabled} placeholder="Anchor name..." onChange={(ev) => { self.changeName(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Any data, 4M bytes max</small>
              <Form.Control as="textarea" rows={3} disabled={disabled} placeholder="Raw data..." onChange={(ev) => { self.changeRaw(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Customized protocol, 256 Bytes max.</small>
              <Form.Control size="md" type="text" disabled={disabled} placeholder="Protocol..." onChange={(ev) => { self.changeProtocol(ev) }} />
            </Col>
            <Col lg={12} xs={12} className="pt-2" ><hr/></Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Select test account to write to the chain.</small>
              <Form.Select aria-label="Default select" disabled={disabled} onChange={(ev) => { self.changeAccount(ev) }}>
              {accounts.map((item,index) => (
                <option value={index} key={index}>{item.encry.meta.name}:{item.encry.address}</option>
              ))}
              </Form.Select>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Selected demo account password: <Badge bg="info">{remind}</Badge></small>
              <Form.Control className="pt-2" size="md" type="password" disabled={disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
            </Col>
            <Col lg={8} xs={8} className="pt-4" >{info}</Col>
            <Col lg={4} xs={4} className="text-end pt-4" >
              <Button size="md" variant="primary" disabled={disabled} onClick={() => { self.onSave() }} > Write to Chain </Button>
            </Col>
          </Row>
				</Col>
        <Col lg={5} xs={12} className="pt-4" >
          <Row>
            <Col lg={12} xs={12} className="pt-2" >{more}</Col>
          </Row>
				</Col >
			</Row>
    </Container>
  );
}
export default Write;