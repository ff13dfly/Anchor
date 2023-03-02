import { Container,Row, Col,Button,Form} from 'react-bootstrap';
import { useEffect,useState} from 'react';

function Node(props) {
  const nodes=props.nodes;

  const self={
    onSave:()=>{
      console.log('click me');
    },
  };

  useEffect(() => {
    //setList(props.list);
    
  },[]);

  return (
      <Row>
        <Col lg={12} xs={12} className="pt-4" ></Col>
        <Col lg={2} xs={6} className="pt-2"><h6>Testing Nodes</h6></Col>
        <Col lg={3} xs={6}>
          <Form.Select aria-label="Default select example">
          {nodes.map((item,index) => (
            <option value={index} key={index}>{item}</option>
          ))}
          </Form.Select>
        </Col>
        <Col lg={2} xs={6} className="text-end">
          <Button size="md" variant="primary" onClick={() => {}} >Link</Button>
        </Col>
        <Col lg={3} xs={6}>
          <Form.Control size="md" type="text" placeholder="New node..." onChange={(ev) => {}} />
        </Col>
        <Col lg={2} xs={6} className="text-end">
          <Button size="md" variant="primary" onClick={() => {}} >Add</Button>
        </Col>
			</Row>
  );
}
export default Node;