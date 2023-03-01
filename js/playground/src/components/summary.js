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
				<Col lg={12} xs={12} className="pt-4" >
          <h4>Overview</h4>
          <p>
            This playground is a test enviment for anchor node. It is a Polkadot/Substrate extend pallet, details here <a href="https://github.com/ff13dfly/Anchor">https://github.com/ff13dfly/Anchor</a>.
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
            That's the reason we keep the typing password step.
          </p>

          <h4>Basic playway</h4>
          <p>
            It may take your 10 minutes to try this playround. 
            I think it is worthy, after playing, you  will find a new way of the blockchain world.
          </p>
          <p>
            1. Search an exsist anchor, such as "hello", to check the details.
          </p>
          <p>
            2. Set a new anchor by default test account. 
            By trying this, you can know what is storage on chain well. Yes, it is a <Badge bg="info">Key-value Storage</Badge>.
          </p>
          <p>
            3. Update the anchor by default test account. Now, you can see what is <Badge bg="info">On-chain Linked List</Badge>. 
            The history of anchor can be checked easily on the search page.
          </p>
          <p>
            4. Sell the anchor. It is a good way to understand the ownship of anchor. 
            Now, it is <Badge bg="info">Name Service</Badge> on chain, you own it actually. 
            When the anchor is on selling, you can find it on market page. 
            Try to figure out the two way to sell anchor. 
            One, sell it freely; two, sell it to target account.
          </p>
          <p>
            5. Unsell the anchor.
          </p>
          <p>
            6. Buy the anchor.
          </p>


          <h4>Stepin playway</h4>
          <p>
            If you are interesting in this part, it is high possible that you are a developer, so there will be some code. 
            But don't be afraid if you have no coding experince, the code is as simple as possible, just try.
          </p>
          <p>
            1. Search an exsist anchor, such as "hello", to check the details.
          </p>
          <p>
            2. Set a new anchor by default test account.
          </p>

          

          <h4>Resource</h4>
          <p>
            Anchor Pallet : 
          </p>
          <p>
            Anchor.js : 
          </p>

          <h4>More details</h4>
          <p>
            Thank you for your patient, I am here, if you want to know more.
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