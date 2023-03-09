import { Row, Col,ListGroup,Badge} from 'react-bootstrap';

function History(props) {
  const self={
    shortenAddress: (address, n) => {
      if (n === undefined) n = 10;
      return address.substr(0, n) + '...' + address.substr(address.length - n, n);
    },
  };

	return (
    <Row>
      <Col lg={12} xs={12} className="pt-2" >
        <h5>History </h5>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <ListGroup as="ol">
          {props.list.map((item,index) => (
            <ListGroup.Item 
              as="li" 
              id={`${item.name}_${item.block}`} 
              key={index} 
              active={item.block===props.block?true:false} 
              onClick={props.change}
            >
              {item.block.toLocaleString()} , pre : {item.pre.toLocaleString()} , signer:{self.shortenAddress(item.signer)}
            </ListGroup.Item >
          ))}
        </ListGroup>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        Above is the history data list on chain.
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        Owner: <Badge bg="info">{props.owner}</Badge>
      </Col>
    </Row>
	);
}
export default History;