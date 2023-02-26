import { Row, Col, Button, Form } from 'react-bootstrap';
import { useEffect } from 'react';

function Options(props) {
  const op_null='';
  const op_normal=(
    <Row>
      <Col lg={4} xs={12} className="pt-2" >
        <Form.Control size="md" type="number" placeholder="Price..." onChange={(ev) => { }} />
      </Col>
      <Col lg={4} xs={12} className="pt-2" >
        <Form.Select aria-label="Default select">
          <option value="1">account_a</option>
          <option value="1">account_b</option>
          <option value="1">account_c</option>
        </Form.Select>
      </Col>
      <Col lg={2} xs={12} className="pt-2" >
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Freely" className='pt-2'/>
        </Form.Group>
      </Col>
      <Col lg={2} xs={12} className="pt-2 text-end" >
        <Button size="md" variant="primary" onClick={() => { }} > Sell </Button>
      </Col>
    </Row>
  );
  const op_sell=(
    <Row>
      <Col lg={8} xs={12} className="pt-2" ></Col>
      <Col lg={2} xs={4} className="pt-2 text-end" >
        <Button size="md" variant="primary" className="mr-2" onClick={() => { }} > Unsell </Button>
      </Col>
      <Col lg={2} xs={6} className="pt-2 text-end" >
        <Button size="md" variant="primary" onClick={() => { }} > Buy </Button>
      </Col>
    </Row>
  );
  useEffect(() => {

  }, []);
  if(!props.anchor) return op_null;
  return props.sell?op_sell:op_normal;
}
export default Options;