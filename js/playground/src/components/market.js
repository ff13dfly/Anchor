import { Container, Row, Col, Badge, Form,Button,Card } from 'react-bootstrap';
import { useState } from 'react';

import {Accounts} from '../config/accounts';

function Market(props) {
  let [list, setList] = useState([]);
  let [dom, setDom]=useState('');
  let [accs, setAccs] = useState({});   //storage the select of buying
  let [unselling,setUnselling]=useState({});
  let [buying,setBuying]=useState({});

  const ankr = props.anchorJS;

  const prefix={
    select:'select_',
    buy:'buy_',
    unsell:'unsell_',
  };

  const self = {
    buy:(ev)=>{
      const anchor=ev.target.id;
      const acc=Accounts[accs[anchor]];
      ankr.load(acc.encry,buying[anchor],(pair)=>{
        if(pair===false) return false;
        ankr.buy(pair,anchor, (res)=>{
          console.log(res);
        });
      });
    },
    changeAccount:(ev)=>{
      //console.log(ev.target.id);
      const tmp=ev.target.id.split(prefix.select);
      const anchor=tmp[1];
      accs[anchor]=ev.target.value;
      setAccs(accs);
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
    render:()=>{
      if(!ankr.ready()) return setTimeout(self.render,200);
      ankr.market((alist) => {
        if(alist.length===0) return setDom((<Row>
          <Col lg={12} xs={12} className="text-center pt-4">
            <h4>No selling anchors</h4>
          </Col>
        </Row>));
        const arr=[];
        for(let i=0;i<alist.length;i++){
          arr.push(alist[i].name);
        }
  
        ankr.multi(arr,(map)=>{
          
          setList(map);
          setDom(self.list(map));
        });
      });
    },
    list:()=>{
      return (<Row>{list.map((item, index) => (
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
                <Col lg={12} xs={12} >
                  <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Free to buy" className='pt-2' readOnly checked={item.owner===item.target} />
                  </Form.Group>
                </Col>
                <Col lg={9} xs={8} className="text-end">
                  <Form.Control size="sm" type="password" id={prefix.unsell+item.name} placeholder="Unselling passowrd..." onChange={(ev) => {self.changeUnselling(ev)}}/>
                </Col>
                <Col lg={3} xs={4} className="text-end">
                  <Button size="sm" variant="primary" onClick={() => {}} > Unsell </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row>
            <Col lg={12} xs={12} >
              <small>Selet account to buy the anchor.</small>
              <Form.Select aria-label="Default select" id={prefix.select+item.name} onChange={(ev) => {self.changeAccount(ev)}}>
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
          </Row>
        </Col>
      ))}
      </Row>)
    }
  };

  self.render();

  return (<Container>{dom}</Container>);
}
export default Market;