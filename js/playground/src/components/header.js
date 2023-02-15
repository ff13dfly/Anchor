import { Container,Row, Col } from 'react-bootstrap';

import { useEffect } from 'react';

function Header(props) {

  useEffect(() => {
    
    
  },[]);

  
  return (
    <Container> 
    <Row className = "pt-2" >
      <Col lg = { 12 } xs = { 12 } className = "pt-2" >This header</Col>
    </Row>
    </Container>
  );
}
export default Header;