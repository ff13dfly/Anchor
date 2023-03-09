import { Container, Row, Col } from 'react-bootstrap';
import { useEffect} from 'react';

import Node from './node';
import Account from './account';

import STORAGE from '../lib/storage';
import Keys from '../config/keys';

function Setting(props) {
  const nodes=STORAGE.getCache(Keys.node);

  useEffect(() => {

  }, []);

  return (
    <Container>
      <Node nodes={nodes} fresh={props.fresh} />
      <Row>
        <Col lg={12} xs={12} className="pt-4" ></Col>
        <Col lg={12} xs={12} className="pt-4" ></Col>
        <Col lg={12} xs={12} className="pt-4" ></Col>
      </Row>
      <Account anchoJS={props.anchorJS} node={nodes[0]}></Account>
    </Container>
  );
}
export default Setting;