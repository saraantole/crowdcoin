/* eslint-disable no-undef */
const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = async function (callback) {
    try {
        // Fetch accounts from wallet and deployed contract
        const accounts = await web3.eth.getAccounts()
        const factory = await CampaignFactory.deployed()

        const campaignCreator = accounts[1]
        const minimumAmount = web3.utils.toWei('50', 'ether')

        await factory.createCampaign(minimumAmount, { from: campaignCreator })

    } catch (e) {
        console.log(e)
    }
    callback()
}