import { Row, Col, Badge, Card } from 'react-bootstrap';
import { useEffect,useState } from 'react';



function Detail(props) {

  const anchor=props.data;
  const ankr=props.anchorJS;

  const self = {
    format:(stamp)=>{
      var dt=new Date(stamp);
      return dt.toLocaleString();
    },
  };

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col lg={12} xs={12} className="pt-2" >
        <h4>{anchor.name} <Badge bg="info">Block:{anchor.block}</Badge> </h4>
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
                    <td>{self.format(anchor.stamp)}</td>
                  </tr>
                  <tr>
                    <td>Selling</td>
                    <td>{anchor.sell?"Yes":"No"}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
export default Detail;