import React from 'react'
import getWeb3 from './getWeb3'
import getFactory from './getFactory'
import campaignFactoryDefinition from '../lib/contracts/CampaignFactory.json'

export default class Web3Container extends React.Component {
  state = { web3: null, campaignFactory: null };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      //const accounts = await web3.eth.getAccounts()
      
      //console.log(`---- Web3Container componentDidMount() accounts from web3.eth.getAccounts() ----`);
      //console.log(accounts);

      const campaignFactory = await getFactory(web3, campaignFactoryDefinition)
      this.setState({ web3, campaignFactory })
      
    } catch (error) {
      alert(
        `Failed to load web3, or campaignFactory. Check console for details.`
      )
      console.log(error)
    }
  }

  render () {
    const { web3, campaignFactory } = this.state
    return web3 && campaignFactory
      ? this.props.render({ web3, campaignFactory })
      : this.props.renderLoading()
  }
}
