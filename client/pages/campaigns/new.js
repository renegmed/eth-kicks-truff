import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router } from '../../routes';
import getWeb3 from '../../ethereum/getWeb3';
import getFactory from '../../ethereum/getFactory'
import campaignFactoryDefinition from '../../lib/contracts/CampaignFactory.json'

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false,
    web3: this.props.web3
  };
  
  async componentDidMount () {
    const {web3} = this.props
    console.log("======  CampaignNew componentDidMount() web3 ========");
    console.log(web3);
 
    this.setState({ web3 });
 
  }
  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      
      const web3 = await getWeb3()     
      console.log("------ CampaignNew onSubmit web3 ----------");
      console.log(web3);

      const accounts = await web3.eth.getAccounts();

      const campaignFactory = await getFactory(web3, campaignFactoryDefinition)

      await campaignFactory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
