import { Container,Row, Col,Button, Card} from 'react-bootstrap';
import { useEffect } from 'react';

function Account(props) {
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
        <Col lg={12} xs={12} className="pt-4" >
          Linked node: wss://dev.metanchor.net
        </Col>

				<Col lg={12} xs={12} className="pt-4" >
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="https://robohash.org/5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq.png" />
          <Card.Body>
            <Card.Title>Test Account</Card.Title>
            <Card.Text>
            5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>

				</Col>
			</Row>
    </Container>
  );
}
export default Account;