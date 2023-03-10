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
      //console.log(ev.target.value);
      setName(ev.target.value);
      self.calcFee();
      self.render(ev.target.value);
    },
    changeRaw:(ev)=>{
      setRaw(ev.target.value);
      self.calcFee();
    },
    changeProtocol:(ev)=>{
      setProtocol(ev.target.value);
      self.calcFee();
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
      const row=accounts[ev.target.value];
      setRemind(row.password);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    calcFee:()=>{
      const len=name.length+raw.length+protocol.length;
      const base=153;         
      const cost=parseFloat((len+base)*0.01).toFixed(3);
      setInfo(`estimated cost : ${cost}`);
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
    blank:()=>{
      setTimeout(() => {
        setInfo("");
      }, 1500);
    },
    onSave:()=>{
      if(!password){
        setInfo("Password error");
        return self.blank();
      }
      if(!accounts[account]){
        setInfo("Account error");
        return self.blank();
      } 
      setDisabled(true);
      self.getPair((pair)=>{
        if(pair===false){
          setInfo("Password error");
          setDisabled(false);
          return self.blank();
        }
        
        ankr.write(pair,name,raw, protocol, (res)=>{
          if(res.error){
            setDisabled(false);
            setInfo(res.error);
            return self.blank();
          }

          setInfo(res.message);
          if(res.step==="Finalized"){
            self.render();
            setDisabled(false);
            return self.blank();
          }
        });
      });
    },
    render:(target)=>{
      const anchor=!target?name:target;
      if(!anchor) return false;

      ankr.search(anchor,(res)=>{
        const owner=!res?false:res.owner;
        ankr.history(anchor,(list)=>{
          if(!list) return setMore('No result.');
          setMore(<History list={list} block={0} owner={owner} change={()=>{}} />);
        });
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
              <small className='text-secondary'>Unique name. If not exsist, will initialize, otherwise will update. 40 bytes max.</small>
              <Form.Control 
                size="md" 
                type="text" 
                disabled={disabled} 
                placeholder="Anchor name..." 
                onChange={(ev) => { self.changeName(ev) }}
              />
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Any data, 4M bytes max</small>
              <Form.Control as="textarea" rows={3} disabled={disabled} placeholder="Raw data..." onChange={(ev) => { self.changeRaw(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Customized protocol, 256 bytes max.</small>
              <Form.Control size="md" type="text" disabled={disabled} placeholder="Protocol..." onChange={(ev) => { self.changeProtocol(ev) }} />
            </Col>
            <Col lg={12} xs={12} className="pt-4" ></Col>
            <Col lg={12} xs={12} className="pt-4" ></Col>
            <Col lg={12} xs={12} className="pt-4" ></Col>
            <Col lg={12} xs={12} className="text-end" >{info}</Col>
            <Col lg={7} xs={6} className="pt-2" >
              <small className='text-secondary'>Selected account password: <Badge bg="success">{remind}</Badge></small>
              <Form.Control className="pt-2" size="md" type="password" disabled={disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
            </Col>
            <Col lg={5} xs={6} className="text-end pt-4" >
              <Button size="md" variant="primary" disabled={disabled} onClick={() => { self.onSave() }} > Write to Chain </Button>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-secondary'>Select test account to write to the chain.</small>
              <Form.Select aria-label="Default select" disabled={disabled} onChange={(ev) => { self.changeAccount(ev) }}>
              {accounts.map((item,index) => (
                <option value={index} key={index}>{item.encry.address}</option>
              ))}
              </Form.Select>
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