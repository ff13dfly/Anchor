import { Container, Row, Col } from 'react-bootstrap';

function Loading(props) {
  //const tmp=props.page.split("#");
  return (
    <Container>
      <Row>
        <Col lg={12} xs={12} className="pt-4" >
          <h4>Loading page {props.page}</h4>
        </Col>
      </Row>
    </Container>
  );
}
export default Loading;