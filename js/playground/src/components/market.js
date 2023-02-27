import { Container, Row, Col, Badge, Form,Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import {Accounts} from '../config/accounts';

function Market(props) {
  let [list, setList] = useState([]);

  const ankr = props.anchorJS;

  const self = {
    buy:(ev)=>{
      const anchor=ev.target.id;
      console.log(anchor);
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
        const arr=[];
        for(let i=0;i<alist.length;i++){
          arr.push(alist[i].name);
        }
  
        ankr.multi(arr,(map)=>{
          setList(map);
          console.log(map);
        });
      });
    },
  };

  useEffect(() => {
    self.render();
  },[]);

  return (
    <Container>
      <Row>
        {list.map((item, index) => (
          <Col lg={4} xs={4} className="pt-4" key={index} >
            <Row>
              <Col lg={6} xs={6} >
                <h5>{item.name}</h5>
              </Col>
              <Col lg={6} xs={6} className="text-end">
                <h5><Badge bg="info">{item.price}</Badge></h5>
              </Col>
              <Col lg={12} xs={12} >
                  Owner : {self.shortenAddress(item.owner)}
              </Col>
              <Col lg={12} xs={12} >
                  Stamp : {!item.stamp ? '' : self.format(item.stamp)}
              </Col>
              <Col lg={12} xs={12} >
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Free to buy" className='pt-2' readOnly checked={item.owner===item.target} />
                </Form.Group>
              </Col>
              <Col lg={12} xs={12} ><hr /></Col>
              <Col lg={9} xs={9} >
                <small>Selet account to buy the anchor.</small>
                <Form.Select aria-label="Default select" id={'select_'+item.name} onChange={(ev) => {}}>
                  {Accounts.map((item,index) => (
                      <option value={index} key={index}>{item.encry.address}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={3} xs={3} className="text-end pt-4">
                <Button size="md" variant="primary" id={item.name} onClick={(ev) => {self.buy(ev)}} > Buy </Button>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default Market;