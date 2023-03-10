import { Container, Row, Col, Badge, Form,Button,Card } from 'react-bootstrap';
import { useEffect,useState } from 'react';

import {Accounts} from '../config/accounts';

function Market(props) {
  const ankr = props.anchorJS;

  let [list, setList] = useState([]);
  let [accs, setAccs] = useState({});   //storage the select of buying
  let [unselling,setUnselling]=useState({});
  let [buying,setBuying]=useState({});
  let [password,setPassword]=useState({});
  let [process,setProcess]=useState({});

  const prefix={
    select:'select_',
    buy:'buy_',
    unsell:'unsell_',
    password:'psd_',
  };

  const self = {
    buy:(ev)=>{
      const anchor=ev.target.id;
      const acc=Accounts[!accs[anchor]?0:accs[anchor]];

      if(!buying[anchor]){
        process[anchor]='Password error';
        setProcess(process);
        return self.fresh();
      }

      ankr.load(acc.encry,buying[anchor],(pair)=>{
        if(pair===false){
          process[anchor]='Password error';
          setProcess(process);
          return self.fresh();
        } 
        ankr.buy(pair,anchor, (res)=>{
          if(!res){
            process[anchor]='Unexcept error';
            setProcess(process);
            return self.fresh();
          } 
          if(res.error){
            process[anchor]=res.error;
            setProcess(process);
            return self.fresh();
          } 
          process[anchor]=res.message;
          setProcess(process);
          self.fresh();
        });
      });
    },
    changeAccount:(ev)=>{
      const tmp=ev.target.id.split(prefix.select);
      const anchor=tmp[1];
      const index=ev.target.value;

      accs[anchor]=index;
      setAccs(accs);

      password[anchor]=Accounts[index].password;
      setPassword(password);
      self.fresh();
    },
    changeUnselling:(ev)=>{
      const tmp=ev.target.id.split(prefix.unsell);
      const anchor=tmp[1];
      unselling[anchor]=ev.target.value;
      setUnselling(unselling);
    },
    changeBuying:(ev)=>{
      const tmp=ev.target.id.split(prefix.buy);
      const anchor=tmp[1];
      buying[anchor]=ev.target.value;
      setBuying(buying);
    },
    shortenAddress: (address, n) => {
      if (n === undefined) n = 10;
      return address.substr(0, n) + '...' + address.substr(address.length - n, n);
    },
    format: (stamp) => {
      var dt = new Date(stamp);
      return dt.toLocaleString();
    },
    fresh:()=>{
      ankr.market((alist) => {
        if(alist.length===0) return false;
        const arr=[];
        for(let i=0;i<alist.length;i++){
          arr.push(alist[i].name);
        }
  
        ankr.multi(arr,(map)=>{
          setList(map);
        });
      });
    },
  };

  useEffect(() => {
    self.fresh();
  },[]);

  return (<Container><Row>{list.map((item, index) => (
    <Col lg={4} xs={4} className="pt-4" key={index} >
      <Card>
        <Card.Body>
          <Row>
            <Col lg={6} xs={6} >
              <h5>{item.name}</h5>
            </Col>
            <Col lg={6} xs={6} className="text-end">
              <h5><Badge bg="info">{item.cost.toLocaleString()}</Badge></h5>
            </Col>
            <Col lg={12} xs={12} >
                Owner : {self.shortenAddress(item.owner)}
            </Col>
            <Col lg={12} xs={12} >
                Current : {JSON.stringify(item.raw)}
            </Col>
            <Col lg={12} xs={12} >
                Last : {!item.stamp ? '' : self.format(item.stamp)}
            </Col>
            <Col lg={12} xs={12} className="pt-4" ></Col>
            <Col lg={12} xs={12} className="text-end">
              {item.owner===item.target?
                (<h6><Badge bg="warning">Free to buy</Badge></h6>):
                (<h6>Only to {self.shortenAddress(item.target)}</h6>)
              }
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row>
        <Col lg={12} xs={12} className="pt-3">
          <small>Selet account to buy. Password: <Badge bg="success" id={prefix.password+item.name}>{password[item.name]?password[item.name]:Accounts[0].password}</Badge></small>
          <Form.Select className='pt-1' aria-label="Default select" id={prefix.select+item.name} onChange={(ev) => {self.changeAccount(ev)}}>
            {Accounts.map((item,index) => (
                <option value={index} key={index}>{item.encry.address}</option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={9} xs={9} className="pt-2">
          <Form.Control size="md" type="password"  id={prefix.buy+item.name} placeholder="Buying passowrd..." onChange={(ev) => {self.changeBuying(ev)}}/>
        </Col>
        <Col lg={3} xs={3} className="text-end pt-2">
          <Button size="md" variant="primary" id={item.name} onClick={(ev) => {self.buy(ev)}} > Buy </Button>
        </Col>
        <Col lg={12} xs={12} className="pt-2 text-end">{process[item.name]}</Col>
      </Row>
    </Col>
  ))}
  </Row></Container>);
}
export default Market;