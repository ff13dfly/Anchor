import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import {Accounts} from '../config/accounts';

function Account(props) {
  let [balance, setBalance] = useState(new Array(Accounts.length).fill(0));

  const self = {
    onSave: () => {
      console.log('click me');
    },
  };

  useEffect(() => {
    //Accounts.push({"hello":"world"});
    //console.log(Accounts);
    //setList(props.list);
    //console.log(balance);
  }, []);

  return (
    <Row>
      <Col lg={3} xs={6}><h6>Testing Accounts</h6></Col>
      <Col lg={3} xs={6}> </Col>
      <Col lg={4} xs={6}>
        <Form.Control size="md" type="text" placeholder="Passwor for new account..." onChange={(ev) => {}} />
      </Col>
      <Col lg={2} xs={6} className="text-end">
        <Button size="md" variant="primary" onClick={() => {}} >New Account</Button>
      </Col>
      {Accounts.map((item, index) => (
        <Col lg={4} xs={4} className="pt-3" key={index}>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col lg={6} xs={6} >{item.encry.meta.name}</Col>
                  <Col lg={6} xs={6} className="text-end" >{balance[index]}</Col>
                </Row>
              </Card.Title>
              <Row>
                <Col lg={3} xs={12} >
                  <img src="https://robohash.org/5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq.png" alt="" />
                </Col>
                <Col lg={9} xs={12} >
                  <Row>
                    <Col lg={12} xs={12} >
                      <h5>{item.encry.address}</h5>
                    </Col>
                    <Col lg={12} xs={12} >
                      Password : {item.password}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default Account;