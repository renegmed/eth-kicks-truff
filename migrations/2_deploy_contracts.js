const CampaignFactory = artifacts.require('./CampaignFactory.sol')
//const Campaign = artifacts.require('./Campaign.sol')
module.exports = function (deployer, network, accounts) {
  deployer.deploy(SimpleStorage)
 
  // deployer.deploy(CampaignFactory, {from: accounts[0]}).then( () => {
  //   console.log('Deployed Campaign Factory address', CampaignFactory.address);
  //   console.log('accounts[0] ',accounts[0]);
  // });

  deployer.deploy(CampaignFactory).then( () => {
    console.log('Deployed Campaign Factory address', CampaignFactory.address);
    console.log('accounts[0] ',accounts[0]);
  });

  //deployer.deploy(Campaign, 10, accounts[0]);
}
