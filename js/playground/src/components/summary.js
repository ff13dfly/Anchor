import { Container,Row, Col,Badge} from 'react-bootstrap';
import { useEffect } from 'react';

function Summary(props) {
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
				<Col lg={8} xs={12} className="pt-4" >
          <h4>Overview</h4>
          <p>
            This playground is a test environment for anchor node. Anchor is a Polkadot/Substrate extend pallet, details here <a href="https://github.com/ff13dfly/Anchor">https://github.com/ff13dfly/Anchor</a>.
            Anchor pallet is an On-chain Linked List system, you can store data on chain easily this way.
          </p>
          <p>
            This playground mocks all functions in anchor.js, which is the library to access anchor node. 
            Anchor node is a server run the substrate normally. So you can use Polkadot/Substrate tools to access the node too, 
            the only difference is anchor node integrate anchor pallet.
          </p>
          <p>
            <Badge bg="warning">Tips</Badge> Typing password is a normal action when you are playing. Actually, we can skip the process in code.
            Why not ? Account is an important part in blockchain world, feel it from your action. 
            That's the reason we keep the copy/paste password step although it is a bit troublesome.
          </p>
        </Col>
        <Col lg={4} xs={12} className="pt-4" >

        </Col>
        <Col lg={8} xs={12} className="pt-4" >
          <h4>Gameplay</h4>
          <p>
            It may take your 10 minutes to try this playround. 
            I think it is worthy, after playing, you  will find a new way of the blockchain world.
          </p>
          <p>
            <Badge bg="warning">Tips</Badge> If you connet to local running node, the mock account's balance is empty.
            Please click the "Free charge" button on settling page, system will transfer random coins to mock accounts from test account "Charlie".
          </p>
          <p>
            <Badge bg="primary">Step 1</Badge> Search an exsist anchor, such as "hello", to check the details.
          </p>
          <p>
            <Badge bg="primary">Step 2</Badge> Set a new anchor by mock account. 
            By trying this, you can know what is storage on chain well. Yes, it is <Badge bg="info">Key-value Storage</Badge>.
          </p>
          <p>
            <Badge bg="primary">Step 3</Badge> Update the anchor by default test account. Now, you can see what is <Badge bg="info">On-chain Linked List</Badge>. 
            The history of anchor can be checked easily on the search page.
          </p>
          <p>
            <Badge bg="primary">Step 4</Badge> Sell the anchor. It is a good way to understand the ownship of anchor. 
            Now, it is <Badge bg="info">Name Service</Badge> on chain, you own it actually. 
            When the anchor is on selling, you can find it on market page. 
            Try to figure out the two way to sell anchor. 
            One, sell it freely; two, sell it to target account.
          </p>
          <p>
            <Badge bg="primary">Step 5</Badge> Unsell the anchor. 
            You can find the "unsell" button on search result, after typing password, you will find what happen.
          </p>
          <p>
            <Badge bg="primary">Step 6</Badge> Buy the anchor.
            On market page, beside the selling card, you can select account to buy the target anchor. 
            After buying, you can search the anchor, will find the ownership changed in result details.
          </p>
          </Col>
          <Col lg={4} xs={12} className="pt-4" >

          </Col>
         <Col lg={12} xs={12} className="pt-4" >        

          <h4>Resource</h4>
          <p>
            Anchor Pallet : <a target="_blank" href="https://github.com/ff13dfly/Anchor">https://github.com/ff13dfly/Anchor</a>
          </p>
          <p>
            Anchor.js : <a target="_blank" href="https://github.com/ff13dfly/Anchor/blob/main/js/README.md">https://github.com/ff13dfly/Anchor/blob/main/js/README.md</a>
          </p>

          <h4>Notice</h4>
          <p>
            The test playground node will be reset frequently, please do not store important data on it.
          </p>
        </Col>
			</Row>
    </Container>
  );
}
export default Summary;