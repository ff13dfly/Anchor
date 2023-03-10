import { Container,Nav,Navbar } from 'react-bootstrap';
import { useEffect } from 'react';

function Header(props) {
  // let [active,setActive]=useState({
  //   '#home':false,
  //   '#write':false,
  //   '#market':false,
  //   '#setting':false,
  //   "#document":false,
  // });
  // active[window.location.hash]=true;

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
            <Nav.Link href="#market">Market</Nav.Link>
            <Nav.Link href="#setting">Setting</Nav.Link>
            <Nav.Link href="#document">Document</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;