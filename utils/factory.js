import web3 from "./web3";
import CampaignFactory from '../public/abis/CampaignFactory.json'

export const loadFactoryContract = async () => {
    try {
/*         const currentNet = await web3.eth.net.getNetworkType()
        console.log(currentNet) */
        const abi = CampaignFactory.abi
        const networkId = await web3.eth.net.getId()
        const contractAddress = CampaignFactory.networks[networkId].address
        const factory = new web3.eth.Contract(abi, contractAddress) // new instance of the contract for client ui
        return factory
    } catch (e) {
        alert('Contract not deployed to the current network. Please select Ropsten network with Metamask.')
        return null
    }
}

