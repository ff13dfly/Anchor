import { Container,Row, Col,Button, Form} from 'react-bootstrap';
import { useEffect } from 'react';

function Write(props) {
  const self={
    onSave:()=>{
      console.log('click me');
    },
  };

  useEffect(() => {
    
  },[]);

  return (
    <Container> 
      <Row>
				
				<Col lg={7} xs={12} className="pt-4" >
          <Row>
            <Col lg={12} xs={12} className="pt-2" >
              <h3>Anchor History</h3>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              History list
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <h3>Writing Process</h3>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              Status changing log
            </Col>
          </Row>
				</Col >
        <Col lg={5} xs={12} className="pt-4">
          <Row>
            <Col lg={12} xs={12} className="pt-2" >
              <Form.Control size="md" type="text" placeholder="Anchor name..."/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <Form.Control as="textarea" rows={3} placeholder="Raw data..."/>
            </Col>
            <Col lg={12} xs={12} className="pt-2" >
              <Form.Control size="md" type="text" placeholder="Protocol..." onChange={(ev) => { self.onChange(ev) }} />
            </Col>
            <Col lg={12} xs={12} className="text-end pt-2" >
              <Button size="md" variant="primary" onClick={() => { self.onSave() }} > Write to Chain </Button>
            </Col>
          </Row>
				</Col>
			</Row>
    </Container>
  );
}
export default Write;