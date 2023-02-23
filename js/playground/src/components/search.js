import { Container,Row, Col,Button, Form,Badge,Card} from 'react-bootstrap';
import { useEffect,useState } from 'react';

function Search(props) {
  let [name,setName]=useState("");

  const self={
    onSave:()=>{
      console.log(`Searching:${name}`);
    },
    onChange:(ev)=>{
      setName(ev.target.value);
    },
  };

  useEffect(() => {
    
  },[]);

  return (
    <Container> 
      <Row>
				<Col lg={4} xs={8} className="text-end pt-4" >
					<Form.Control size="lg" type="text" placeholder="Anchor name..." onChange={(ev) => { self.onChange(ev) }} />
				</Col>
				<Col lg={2} xs={4} className="text-end pt-4" >
					<Button size="lg" variant="primary" onClick={() => { self.onSave() }} > Search </Button>
				</Col >

        <Col lg={12} xs={12} className="pt-2" >
          <Row>
            <Col lg={12} xs={12} className="pt-2" >
              <h4>Anchor-name <Badge bg="info">On-sell</Badge> </h4>
            </Col>
            <Col lg={4} xs={4} className="pt-2" >
            <Card>
              <Card.Body>
                <Card.Title>Block : 123</Card.Title>
                <Card.Text>
                  Raw :   <br/>
                  Protocol : <br/>
                  Pre: 0<br/>
                  Owner : <small>5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq</small>
                </Card.Text>
              </Card.Body>
            </Card>
            </Col>
          </Row>
        </Col>
			</Row>
    </Container>
  );
}
export default Search;