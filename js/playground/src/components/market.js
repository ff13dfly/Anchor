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
    ankr.market((alist) => {
      setList(alist);
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col lg={12} xs={12} className="pt-2" ></Col>
        {list.map((item, index) => (
          <Col lg={3} xs={3} className="pt-2" key={index} >
            <Card>
              <Card.Body>
                <Card.Title>
                  {item.name}  <Badge bg="info">{item.price}</Badge>
                </Card.Title>
                <Card.Text>
                  Target : {item.target} <br />
                  Owner : {item.owner}
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