import { Container,Row, Col,Button, Form} from 'react-bootstrap';
import { useState } from 'react';

import Detail from './detail';
import History from './history';

function Search(props) {
  let [name,setName]=useState("");
  let [result,setResult]=useState("");
  let [more, setMore] = useState('');

  const ankr=props.anchorJS;
  

  const self={
    fresh:(name)=>{
      ankr.search(name,(res)=>{
        if(res===false){
          setMore('');
          return setResult(`No such anchor : ${name}`);
        }
        setResult((<Detail data={res} anchorJS={props.anchorJS} fresh={self.fresh}></Detail>));
        if(!res) return false;
        self.list(name,res.block,res.owner);
      });
    },
    list:(name,cur,owner)=>{
      ankr.history(name,(list)=>{
        setMore((<History list={list} block={cur} change={self.select} />));
      });
    },
    select:(ev)=>{
      const id=ev.target.id;
      const arr=id.split('_');
      const block=parseInt(arr.pop());
      //console.log(name);
      ankr.target(name,block,(res)=>{
        setResult((<Detail data={res} anchorJS={props.anchorJS} fresh={self.fresh}/>));
        self.list(name,block,res.owner);
      });
    },
    onSearch:()=>{
      self.fresh(name);
    },
    onChange:(ev)=>{
      setName(ev.target.value);
    },
  };

  return (
    <Container> 
      <Row>
        <Col lg={12} xs={12} className="pt-4">
          <small>You can search "hello" anchor to view the details.</small>
        </Col >
				<Col lg={4} xs={8} className="text-end" >
					<Form.Control size="lg" type="text" placeholder="Anchor name..." onChange={(ev) => { self.onChange(ev) }} />
				</Col>
				<Col lg={2} xs={4} className="text-end" >
					<Button size="lg" variant="primary" onClick={() => { self.onSearch() }} > Search </Button>
				</Col >

        <Col lg={7} xs={12} className="pt-2" >
          {result}
        </Col>
        <Col lg={5} xs={12} className="pt-2" >
          {more}
        </Col>
			</Row>
    </Container>
  );
}
export default Search;