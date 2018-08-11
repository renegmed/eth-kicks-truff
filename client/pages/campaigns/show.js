import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
import getWeb3 from '../../ethereum/getWeb3';
import campaignDefinition from '../../lib/contracts/Campaign.json'
 

class CampaignShow extends Component {

  static async getInitialProps(props) {
    // from url /campaigns/:address
    const campaignAddress = props.query.address;
    // console.log("------ CampaignShow getInitialProps campaignAddress ----------");
    // console.log(campaignAddress);
     
    let summary;

    try {
      
      const web3 = await getWeb3()     
      console.log("------ CampaignShow getInitialProps web3 ----------");
      console.log(web3);
        
      const campaign = new web3.eth.Contract(
        campaignDefinition.abi,
        campaignAddress
      )
      console.log("------ CampaignShow getInitialProps campaign ----------");
      console.log(campaign);
      
      summary = await campaign.methods.getSummary().call();    
      
      console.log("------ CampaignShow getInitialProps summary ----------");
      console.log(summary); 

    } catch (error) {
        console.log(error);
    }

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      web3: web3
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have already donated to this campaign'
      },
      {
        header: web3.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend.'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
