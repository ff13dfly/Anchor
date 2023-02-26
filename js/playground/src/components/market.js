import { Container, Row, Col, Badge, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function Market(props) {
  let [list, setList] = useState([]);

  const ankr = props.anchorJS;

  const self = {
    onSave: () => {
      console.log('click me');
    },
  };

  useEffect(() => {
    ankr.market((res) => {
      let arr = [{}, {},{}];
      setList(arr);
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col lg={12} xs={12} className="pt-2" ></Col>
        {list.map((item, index) => (
          <Col lg={3} xs={3} className="pt-2" >
            <Card>
              <Card.Body>
                <Card.Title>
                  Anchor-name <Badge bg="info">1,999</Badge>
                </Card.Title>
                <Card.Text>
                  Target : free to buy <br />
                  Owner : 5Dt3Diu9becXCqtY2nYucE7DYRaWb7a8V73xuphWeB7MbLVq
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
export default Market;