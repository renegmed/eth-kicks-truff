import Web3 from 'web3'

const resolveWeb3 = (resolve) => {
  let { web3 } = window
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
  const localProvider = `http://localhost:7545`  // network ganache

  if (alreadyInjected) {
    console.log(`+++ getWeb3.js resolveWeb3() Injected web3 detected. +++++`)
    web3 = new Web3(web3.currentProvider)
  } else {
    console.log(`+++ getWeb3.js resolveWeb3() No web3 instance injected, using Local web3. ++++`)
    const provider = new Web3.providers.HttpProvider(localProvider)
    web3 = new Web3(provider)
  }

  console.log("------ resolveWeb3 ----");
  console.log(web3);
  
  resolve(web3)  

}

export default () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve)
    }
  })
