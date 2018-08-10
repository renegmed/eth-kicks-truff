const getCampaignFactoryInstance = async (web3, campaignFactoryDefinition) => {  // campaignFactoryDefinition is the abi
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId()
  const deployedAddress = campaignFactoryDefinition.networks[networkId].address

  // create the instance
  const instance = new web3.eth.Contract(
    campaignFactoryDefinition.abi,
    deployedAddress
  )

  console.log("------ getCampaignFactoryInstance ----");
  console.log(instance);
  
  return instance
}

export default getCampaignFactoryInstance
