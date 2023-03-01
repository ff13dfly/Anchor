import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import Node from './node';
import Account from './account';

function Setting(props) {
  const list = props.list;
  const nodes = props.server.nodes;

  let [balance, setBalance] = useState(new Array(list.length).fill(0));

  const self = {
    onSave: () => {
      console.log('click me');
    },
  };

  useEffect(() => {
    //setList(props.list);
    //console.log(balance);
  }, []);

  return (
    <Container>
      <Node nodes={props.server.nodes} />
      <Row>
        <Col lg={12} xs={12} ><hr /></Col>
      </Row>
      <Account />
    </Container>
  );
}
export default Setting;