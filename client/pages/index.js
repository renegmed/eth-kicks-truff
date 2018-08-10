import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes'; ;
import Web3Container from '../ethereum/Web3Container';


class CampaignIndex extends Component {
  state = {campaigns: null, web3: null};
 
  // this method is NextJS specific????NOT WORKING . It doesn't use componentDidMount
  // static async getInitialProps() {
  //   const { web3, campaignFactory } = this.props
  //   console.log("======  CampaignIndex getInitialProps() web3 ========");
  //   console.log(web3);

  //   const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  //   console.log("======  getInitialProps() campaigns ========");
  //   console.log(campaigns);

  //   return { web3, campaignFactory, campaigns };
  // }  

  async componentDidMount () {
    const { web3, campaignFactory } = this.props
    console.log("======  CampaignIndex componentDidMount() web3 ========");
    console.log(web3);

    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log("======  componentDidMount() campaigns ========");
    console.log(campaigns);

    this.setState({ web3, campaigns });
 
  }
  
  renderCampaigns() {
    const {campaigns} = this.state;
    console.log("===== campaigns =======");
    console.log(campaigns); 
    
    let items;
    if (campaigns) {
      items = campaigns.map(address => {
        return {
          header: address,
          description: (
            <Link route={`/campaigns/${address}`}>
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
          
          <Link route="/campaigns/new" >
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary               
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Campaign Home Page...</div>}
    render={({ web3, campaignFactory }) => (
      <CampaignIndex campaignFactory={campaignFactory} web3={web3} />
    )}
  />
)