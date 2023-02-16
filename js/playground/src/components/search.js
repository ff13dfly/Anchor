import { Container,Row, Col,Button, Form} from 'react-bootstrap';
import { useEffect } from 'react';

function Search(props) {
  const self={
    onSave:()=>{
      console.log('click me');
    },
  };

  useEffect(() => {
    
  },[]);

  return (
    <Container> 
      <Row>
				<Col lg={4} xs={8} className="text-end pt-4" >
					<Form.Control size="lg" type="text" placeholder="Anchor name..." onChange={(ev) => { self.onChange(ev) }} />
				</Col>
				<Col lg={2} xs={4} className="text-end pt-4" >
					<Button size="lg" variant="primary" onClick={() => { self.onSave() }} > Search </Button>
				</Col >
			</Row>
    </Container>
  );
}
export default Search;