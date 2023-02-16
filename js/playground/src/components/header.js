import { Container,Row, Col,Nav,Navbar } from 'react-bootstrap';
import { useEffect } from 'react';

function Header(props) {

  useEffect(() => {
    
  },[]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Anchor.js Playground</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Search</Nav.Link>
            <Nav.Link href="#write">Write</Nav.Link>
            <Nav.Link href="#account">Account</Nav.Link>
            <Nav.Link href="#nodes">Nodes</Nav.Link>
            <Nav.Link href="#document">Document</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;