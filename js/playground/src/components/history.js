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
        <h5>History</h5>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <ListGroup as="ol">
          {props.list.map((item,index) => (
            <ListGroup.Item 
              as="li" 
              id={`${item.name}_${item.block}`} 
              key={index} 
              active={item.block===props.block?true:false} 
              onClick={(ev)=>{
                props.change(ev);
              }}
            >
              On:{item.block.toLocaleString()}; pre:{item.pre.toLocaleString()}; {self.shortenAddress(item.signer)}
              {/* <Row onClick={(ev)=>{ev.nativeEvent.stopImmediatePropagation()}}>
                <Col lg={3} xs={12} onClick={(ev)=>{ev.nativeEvent.stopImmediatePropagation()}}>On:{item.block.toLocaleString()}</Col>
                <Col lg={3} xs={12} onClick={(ev)=>{ev.nativeEvent.stopImmediatePropagation()}}>Pre:{item.pre.toLocaleString()}</Col>
                <Col lg={6} xs={12} onClick={(ev)=>{ev.nativeEvent.stopImmediatePropagation()}} className="text-end">{self.shortenAddress(item.signer)}</Col>
              </Row> */}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        Above is the history data list on chain.
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        {!props.owner?'':'Owner: '}<h5><Badge bg="info">{props.owner}</Badge></h5>
      </Col>
    </Row>
	);
}
export default History;