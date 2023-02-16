import { Container,Row, Col,Button, Form} from 'react-bootstrap';
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
          Accounts List with password
				</Col>
			</Row>
    </Container>
  );
}
export default Account;