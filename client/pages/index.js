import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes'; ;
import Web3Container from '../ethereum/Web3Container';


class CampaignIndex extends Component {
  state = {campaigns: null};
 
  async componentDidMount () {
    const { web3, campaignFactory } = this.props
     
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log("======  componentDidMount() campaigns ========");
    console.log(campaigns);

    this.setState({ campaigns });
 
  }
  
  renderCampaigns() {
    const campaigns = this.state.campaigns;
    console.log("===== campaigns =======");
    console.log(campaigns); 
    
    let items;
    if (campaigns) {
      items = campaigns.map(address => {
        return {
          header: address,
          description: (
            <Link >
              <a>View Campaign</a>
            </Link>
          ),
          fluid: true
        };
      });
    }
    return <Card.Group items={items} />;
  }

  render() { 
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>  
          {this.renderCampaigns()}
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