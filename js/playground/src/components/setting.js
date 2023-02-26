import { Container,Row, Col,Button, Card,Form} from 'react-bootstrap';
import { useEffect,useState} from 'react';

function Setting(props) {
  const list=props.list;
  const nodes=props.server.nodes;

  let [balance, setBalance] = useState(new Array(list.length).fill(0));

  const self={
    onSave:()=>{
      console.log('click me');
    },
  };

  useEffect(() => {
    //setList(props.list);
    
  },[]);

  return (
    <Container> 
      <Row>
        <Col lg={4} xs={6} className="pt-4" >
          <Form.Select aria-label="Default select example">
          {nodes.map((item,index) => (
            <option value={index} key={index}>{item}</option>
          ))}
          </Form.Select>
        </Col>
        <Col lg={2} xs={6} className="pt-4" >
          <Button size="md" variant="primary" onClick={() => {}} > Link</Button>
        </Col>
        <Col lg={4} xs={6} className="pt-4" ></Col>
        <Col lg={2} xs={6} className="pt-4" ></Col>
        {list.map((item,index) => (
				<Col lg={4} xs={4} className="pt-4" key={index}>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://robohash.org/5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq.png" />
            <Card.Body>
              <Card.Title>
              <Row>
                <Col lg={6} xs={6} >{item.encry.meta.name}</Col>
                <Col lg={6} xs={6} className="text-end" >{balance[index]}</Col>
              </Row>
                
                
              </Card.Title>
              <Card.Text>
                <p className='bg-info'>{item.encry.address}</p>
                <p>Password:{item.password}</p>
              </Card.Text>
            </Card.Body>
          </Card>
          </Col>
        ))}
			</Row>
    </Container>
  );
}
export default Setting;