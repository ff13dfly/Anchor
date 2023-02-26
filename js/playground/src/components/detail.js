import { Row, Col, Badge, Card, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';



function Detail(props) {
  const anchor = props.data.error ? {} : props.data;
  //console.log(anchor);
  const ankr = props.anchorJS;

  let [URI, setURI] = useState(!anchor ? '#' : `https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer/query/${anchor.block}`);

  const self = {
    format: (stamp) => {
      var dt = new Date(stamp);
      return dt.toLocaleString();
    },
  };

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col lg={12} xs={12} className="pt-2">
        <h4>{anchor.name}<Badge bg="info">Block:{anchor.block}</Badge></h4>
      </Col>
      <Col lg={6} xs={6} className="pt-2" >
        Node : ws://localhost:9944
      </Col>
      <Col lg={6} xs={6} className="pt-2 text-end" >
        <a target="_blank" rel="noreferrer" href={URI}>Browse on https://polkadot.js.org/apps/</a>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <Card>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
              <table className='table'>
                <tbody>
                  <tr>
                    <td>Raw</td>
                    <td>{anchor.raw}</td>
                  </tr>
                  <tr>
                    <td>Protocol</td>
                    <td>{JSON.stringify(anchor.protocol)}</td>
                  </tr>
                  <tr>
                    <td>Pre</td>
                    <td>{anchor.pre}</td>
                  </tr>
                  <tr>
                    <td>Signer</td>
                    <td>{anchor.signer}</td>
                  </tr>
                  <tr>
                    <td>Stamp</td>
                    <td>{!anchor.stamp ? '' : self.format(anchor.stamp)}</td>
                  </tr>
                  <tr>
                    <td>Selling</td>
                    <td>{!anchor ? '' : (anchor.sell ? "Yes" : "No")}</td>
                  </tr>
                </tbody>
              </table>

            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <Row>
          <Col lg={4} xs={8} className="pt-2 text-end" >
            <Form.Control size="md" type="number" placeholder="Price..." onChange={(ev) => { }} />
          </Col>
          <Col lg={2} xs={4} className="pt-2 text-end" >
            <Button size="md" variant="primary" onClick={() => { }} > Sell </Button>
          </Col>
          <Col lg={2} xs={4} className="pt-2 text-end" >
            <Button size="md" variant="primary" className="mr-2" onClick={() => { }} > Unsell </Button>
          </Col>
          <Col lg={4} xs={6} className="pt-2 text-end" >

            <Button size="md" variant="primary" onClick={() => { }} > Buy </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default Detail;