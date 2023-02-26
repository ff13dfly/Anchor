import { Container,Row, Col,Button, Form} from 'react-bootstrap';
import { useEffect,useState } from 'react';

import History from './history';


function Write(props) {
  const accounts=props.accounts;

  let [name,setName]=useState("");
  let [raw,setRaw]=useState("");
  let [protocol,setProtocol]=useState("");
  let [account,setAccount]=useState("");
  let [more, setMore] = useState('');

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
    onSave:()=>{
      console.log(`Ready to write.`);
      console.log({name});
      console.log({raw});
      console.log({protocol});
      console.log({account});
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
              <Form.Control size="md" type="text" placeholder="Anchor name..." onChange={(ev) => { self.changeName(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Any data, 4M bytes max</small>
              <Form.Control as="textarea" rows={3} placeholder="Raw data..." onChange={(ev) => { self.changeRaw(ev) }}/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Customized protocol, 256 Bytes max.</small>
              <Form.Control size="md" type="text" placeholder="Protocol..." onChange={(ev) => { self.changeProtocol(ev) }} />
            </Col>
            <Col lg={12} xs={12} className="pt-2" ><hr/></Col>
            <Col lg={12} xs={12} className="pt-2" >
              <small className='text-success'>Test account password here : </small>
              <Form.Select aria-label="Default select" onChange={(ev) => { self.changeAccount(ev) }}>
              {accounts.map((item,index) => (
                <option value={item.encry.address} key={index}>{item.encry.meta.name}:{item.encry.address}</option>
              ))}
              </Form.Select>
            </Col>
            <Col lg={12} xs={12} className="text-end pt-2" >
              <Button size="md" variant="primary" onClick={() => { self.onSave() }} > Write to Chain </Button>
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