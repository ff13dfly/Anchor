import { Container,Row, Col,Button, Form} from 'react-bootstrap';
import { useEffect } from 'react';

function Nodes(props) {
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
          Nodes list
				</Col>
			</Row>
    </Container>
  );
}
export default Nodes;