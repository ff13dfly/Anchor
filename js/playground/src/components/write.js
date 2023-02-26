import { Container,Row, Col,Button, Form} from 'react-bootstrap';
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

  const ankr=props.anchorJS;

  const self={
    changeName:(ev)=>{
      setName(ev.target.value);
    },
    changeRaw:(ev)=>{
      setRaw(ev.target.value);
      if(!name) return false;
      ankr.history(name,(list)=>{
        if(!list) return setMore('No result.');
        setMore(<History list={list} block={0} change={()=>{}} />);
      });
    },
    changeProtocol:(ev)=>{
      setProtocol(ev.target.value);
    },
    changeAccount:(ev)=>{
      setAccount(ev.target.value);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
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
        ankr.write(pair,name,raw, protocol, (status)=>{
          setInfo(status.toHuman());
          //console.log(status);
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
              <small className='text-success'>Unique name. If not exsist, will initialize, otherwise will update. 40 Bytes max.</small>
              <Form.Control size="md" type="text" disabled={disabled} placeholder="Anchor name..." onChange={(ev) => { self.changeName(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Any data, 4M bytes max</small>
              <Form.Control as="textarea" rows={3} disabled={disabled} placeholder="Raw data..." onChange={(ev) => { self.changeRaw(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Customized protocol, 256 Bytes max.</small>
              <Form.Control size="md" type="text" disabled={disabled} placeholder="Protocol..." onChange={(ev) => { self.changeProtocol(ev) }} />
            </Col>
            <Col lg={12} xs={12} className="pt-2" ><hr/></Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Test account password here : </small>
              <Form.Select aria-label="Default select" disabled={disabled} onChange={(ev) => { self.changeAccount(ev) }}>
              {accounts.map((item,index) => (
                <option value={index} key={index}>{item.encry.meta.name}:{item.encry.address}</option>
              ))}
              </Form.Select>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Password:<span className='text-danger ml-2 mr-2 bg-warning'>123456</span></small>
              <Form.Control size="md" type="password" disabled={disabled} placeholder="Passowrd..." onChange={(ev) => { self.changePassword(ev) }}/>
            </Col>
            <Col lg={4} xs={4} className="pt-2" >{info}</Col>
            <Col lg={4} xs={4} className="text-end pt-2" >
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