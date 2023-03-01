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
        <Col lg={4} xs={6} className="pt-4" >
          <Form.Select aria-label="Default select example">
          {nodes.map((item,index) => (
            <option value={index} key={index}>{item}</option>
          ))}
          </Form.Select>
        </Col>
        <Col lg={2} xs={6} className="pt-4 text-end">
          <Button size="md" variant="primary" onClick={() => {}} >Link</Button>
        </Col>
        <Col lg={4} xs={6} className="pt-4" >
          <Form.Control size="md" type="text" placeholder="New node..." onChange={(ev) => {}} />
        </Col>
        <Col lg={2} xs={6} className="pt-4 text-end">
          <Button size="md" variant="primary" onClick={() => {}} >Add</Button>
        </Col>
			</Row>
  );
}
export default Node;