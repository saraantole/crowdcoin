const CampaignFactory = artifacts.require('CampaignFactory')
const Campaign = artifacts.require('Campaign')

contract('Campaign', ([creator, user1, contributor, supplier]) => {
    let campaign, factory, campaignAddress, manager;

    beforeEach(async () => {
        factory = await CampaignFactory.new({ from: creator });
        await factory.createCampaign(50, { from: user1 });
        [campaignAddress] = await factory.getDeployedCampaigns();
        campaign = await Campaign.at(campaignAddress);
    })

    describe('Factory', () => {
        it('deploys a factory', () => {
            assert.ok(factory.address);
        })

        it('creates a new campaign', () => {
            assert.equal(campaign.address, campaignAddress);
        })

        it('assigns caller as campaign manager', async () => {
            manager = await campaign.manager();
            assert.equal(user1, manager);
        })
    })

    describe('Contract', () => {
        it('allows people to contribute and become approvers', async () => {
            await campaign.contribute({ from: contributor, value: 60 })
            const isApprover = await campaign.approvers(contributor);
            assert(isApprover);
        })

        it('requires minimum contribution', async () => {
            try {
                await campaign.contribute({ from: contributor, value: 10 })
                assert(false);
            } catch (e) {
                assert(e);
            }
        })

        it('allows manager to make payment request', async () => {
            await campaign.createRequest(
                'Buy batteries',
                100,
                supplier,
                { from: manager }
            )
            const request = await campaign.requests(0);
            assert.equal('Buy batteries', request.description);
        })

        it('processes requests', async () => {
            await campaign.contribute({ from: contributor, value: web3.utils.toWei('10', 'ether') })
            await campaign.createRequest(
                'Buy batteries',
                web3.utils.toWei('5', 'ether'),
                supplier,
                { from: manager }
            );

            await campaign.approveRequest(0, { from: contributor });
            await campaign.finalizeRequest(0, { from: manager });
            let supplierBalance = await web3.eth.getBalance(supplier);
            supplierBalance = web3.utils.fromWei(supplierBalance.toString(), 'ether');
            assert(supplierBalance >= '105');
        })
    })
})
