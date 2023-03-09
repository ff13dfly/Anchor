import { Row, Col,Button,Form} from 'react-bootstrap';
import { useEffect,useState} from 'react';
import STORAGE from '../lib/storage';
import Keys from '../config/keys';

function Node(props) {
  const nodes=STORAGE.getCache(Keys.node);

  let [URI,setURI]=useState(nodes[0]);
  const self={
    changeNode:(ev)=>{
      const index=ev.target.value;
      setURI(nodes[index]);
    },
    onRelink:()=>{
      const list=[URI];
      for(let i=0;i<nodes.length;i++){
        if(nodes[i]!==URI) list.push(nodes[i]);
      }
      STORAGE.setPersist('node_persist',list);
      window.location.reload();
    },
  };

  useEffect(() => {
    
  },[]);

  return (
      <Row>
        <Col lg={12} xs={12} className="pt-4" ></Col>
        <Col lg={2} xs={6} className="pt-2"><h6>Testing Nodes</h6></Col>
        <Col lg={3} xs={6}>
          <Form.Select onChange={(ev) => {self.changeNode(ev)}} >
          {nodes.map((item,index) => (
            <option value={index} key={index}>{item}</option>
          ))}
          </Form.Select>
        </Col>
        <Col lg={1} xs={6} className="text-end">
          <Button size="md" variant="primary" onClick={(ev) => {self.onRelink()}} >Link</Button>
        </Col>
        {/* <Col lg={2} xs={6}></Col>
        <Col lg={3} xs={6}>
          <Form.Control size="md" type="text" placeholder="New node..." onChange={(ev) => {}} />
        </Col>
        <Col lg={1} xs={6} className="text-end">
          <Button size="md" variant="primary" onClick={() => {}} >Add</Button>
        </Col> */}
			</Row>
  );
}
export default Node;