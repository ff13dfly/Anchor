import { useState,useEffect } from 'react';

import { Row, Col,ListGroup} from 'react-bootstrap';

function History(props) {
  let [list, setList] = useState([]);

  const self={
    shortenAddress: (address, n) => {
      if (n === undefined) n = 10;
      return address.substr(0, n) + '...' + address.substr(address.length - n, n);
    },
  };

	useEffect(() => {
    setList(props.list);
  },[]);

	return (
    <Row>
      <Col lg={12} xs={12} className="pt-2" >
        <h5>History </h5>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        <ListGroup as="ol">
          {list.map((item,index) => (
            <ListGroup.Item 
              as="li" 
              id={`${item.name}_${item.block}`} 
              key={index} 
              active={item.block===props.block?true:false} 
              onClick={props.change}
            >
              {item.block} , signer:{self.shortenAddress(item.signer)}
            </ListGroup.Item >
          ))}
        </ListGroup>
      </Col>
      <Col lg={12} xs={12} className="pt-2" >
        Above is the history data list on chain.
      </Col>
    </Row>
	);
}
export default History;