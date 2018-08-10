const CampaignFactory = artifacts.require('./CampaignFactory.sol');
const web3 = require('./web3.min');
const Campaign = artifacts.require('./Campaign.sol')

contract('CampaignFactory', (accounts) => {

  it('...should be able to create multiple instances of Campaign using factory.', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed(); 
    
    assert.ok(campaignFactoryInstance, 'Campaign Factory instance was not created.');
    
    await campaignFactoryInstance.createCampaign(10);
    await campaignFactoryInstance.createCampaign(20);

    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    //console.log(deployedCampaigns);

    assert.ok(deployedCampaigns, "Campaign instance was not created");
      
    assert.equal(deployedCampaigns.length, 2, 
        "Two instance of Campaign were not created");
  })

  it('marks caller as the campaign manager', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10, {from: accounts[0]});
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];

    const campaign = Campaign.at(campaignAddress);

    const manager = await campaign.getManager();     

    assert.equal(accounts[0], manager, 'First account and Campaign Manager should be the same.');
  });

  it('verify the minimum contribution from Campaign instance', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10);
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];

    const campaign = Campaign.at(campaignAddress);

    const minContribution = await campaign.getMinimumContribution();    

    assert.equal(minContribution, 10, 'Minimum contribution should be equal to 10.');
  });



  it('allows people to contribute money and marks them as approvers', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10, {from: accounts[0]});
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];
    const campaign = Campaign.at(campaignAddress);

    await campaign.contribute({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.approvers(accounts[1]);
    assert(isContributor,'After contributing to campaign, the account should be approver');
  
  });


  it('requires a minimum contribution', async () => {

    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10, {from: accounts[0]});
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];
    const campaign = Campaign.at(campaignAddress);

    try {
      await campaign.contribute({
        value: '5',
        from: accounts[1]
      });
      assert(false, 'Account contribution is below the minimum amount.');
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10, {from: accounts[0]});
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];
    const campaign = Campaign.at(campaignAddress);

    await campaign.createRequest('Buy batteries', '100', accounts[1], {
        from: accounts[0],
        gas: '1000000'
      });
  
    const requestAddress = await campaign.requests(0);
    console.log(requestAddress);

    assert.equal('Buy batteries', request.description, 'Description is different from the record.');
  });


  it('processes requests', async () => {
    const campaignFactoryInstance = await CampaignFactory.deployed();
    await campaignFactoryInstance.createCampaign(10, {from: accounts[0]});
    const deployedCampaigns = await campaignFactoryInstance.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0];
    const campaign = Campaign.at(campaignAddress);

    await campaign.contribute({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1],
         { from: accounts[0], gas: '1000000' });

    await campaign.approveRequest(0, {
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.finalizeRequest(0,{
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104, 'Balance computation should be more than 104.');
  });
})
