import { Row, Col, Badge, Card } from 'react-bootstrap';
import { useState } from 'react';

import Options from './options';

function Detail(props) {
  const anchor = props.data.error ? {} : props.data;
  const ankr = props.anchorJS;

  let [URI, setURI] = useState(!anchor ? '#' : `https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer/query/${anchor.block}`);

  const self = {
    format: (stamp) => {
      var dt = new Date(stamp);
      return dt.toLocaleString();
    },
  };

  return (
    <Row>
      <Col lg={12} xs={12} className="pt-2 text-end" >
        <a target="_blank" rel="noreferrer" href={URI}>Browse block on https://polkadot.js.org/apps/</a>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <Card>
          <Card.Body>
            <table className='table'>
              <tbody>
                <tr>
                  <td>Block</td>
                  <td><h5><Badge bg="info">{anchor.block}</Badge></h5></td>
                </tr>
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
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        Node : ws://localhost:9944
      </Col>
      
      <Col lg={12} xs={12} className="pt-2" >
        <Options sell={(!anchor || !anchor.sell) ? false : true} anchor={!anchor ? '' : anchor.name} />
      </Col>
    </Row>
  );
}
export default Detail;