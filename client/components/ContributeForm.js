import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import getWeb3 from '../ethereum/getWeb3';
import campaignDefinition from '../lib/contracts/Campaign.json'

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    const {address} = this.props;
    console.log("******* ContributeForm onSubmit() address ***********");
    console.log(address);
     
    const web3 = await getWeb3()     
    console.log("******* ContributeForm onSubmit()  web3  ***********");
    console.log(web3);
      
    const campaign = new web3.eth.Contract(
      campaignDefinition.abi,
      address
    )
    console.log("******* ContributeForm onSubmit()  campaign  ***********");
    console.log(campaign);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log("******* ContributeForm onSubmit()  accounts  ***********");
      console.log(accounts);

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
