import web3 from "./web3";
import Campaign from '../public/abis/Campaign.json'

export const loadCampaignContract = async contractAddress => {
    try {
        const abi = Campaign.abi
        const campaign = new web3.eth.Contract(abi, contractAddress) // new instance of the contract for client ui
        return campaign
    } catch (e) {
        alert('Contract not deployed to the current network. Please select another network with Metamask.')
        return null
    }
}

