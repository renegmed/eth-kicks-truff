import React, { Component } from 'react';
//import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
//import { Link } from '../routes';
//import getWeb3 from '../ethereum/getWeb3'
//import getFactory from '../ethereum/getFactory'
//import campaignFactoryDefinition from '../lib/contracts/CampaignFactory.json'
//import Campaign from '../../contracts/Campaign.sol';
import Web3Container from '../ethereum/Web3Container';


class CampaignIndex extends Component {
  async componentDidMount () {
    const { web3, campaignFactory } = this.props
    console.log("====== campaignFactory ========");
    console.log(campaignFactory);

    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log("====== campaigns ========");
    console.log(campaigns);

    this.state = { campaigns };
  }
  
  render() { 
   
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

        </div>
      </Layout>
    );
  }
}

//export default CampaignIndex;

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Campaign Home Page...</div>}
    render={({ web3, campaignFactory }) => (
      <CampaignIndex campaignFactory={campaignFactory} web3={web3} />
    )}
  />
)