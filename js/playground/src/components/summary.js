import { Container,Row, Col} from 'react-bootstrap';
import { useEffect } from 'react';

function Summary(props) {
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
				<Col lg={12} xs={12} className="pt-4" >Playground introduction</Col>
			</Row>
    </Container>
  );
}
export default Summary;