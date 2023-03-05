import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import Node from './node';
import Account from './account';

import STORAGE from '../lib/storage';
import Keys from '../config/keys';

function Setting(props) {
  const nodes=STORAGE.getCache(Keys.node);
  //let [balance, setBalance] = useState(new Array(list.length).fill(0));
  //console.log(props);

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
      <Node nodes={nodes} />
      <Row>
      <Col lg={12} xs={12} className="pt-4" ></Col>
      <Col lg={12} xs={12} className="pt-4" ></Col>
      <Col lg={12} xs={12} className="pt-4" ></Col>
      </Row>
      <Account anchoJS={props.anchorJS}/>
    </Container>
  );
}
export default Setting;