import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button, Card, Grid } from "semantic-ui-react"
import Contribute from "../../../components/contribute"
import { loadCampaignContract } from '../../../utils/campaign'
import web3 from "../../../utils/web3"

export default function Campaign() {
  const router = useRouter()
  const { campaignId } = router.query
  const [campaign, setCampaign] = useState(undefined)
  const [campaignSummary, setCampaignSummary] = useState(undefined)
  const [isManager, setIsManager] = useState(false)

  useEffect(() => {
    const getCampaignContract = async () => {
      const contract = await loadCampaignContract(campaignId)
      setCampaign(contract)
      const contractInfo = await contract.methods.getSummary().call()
      setCampaignSummary({
        minimumContribution: contractInfo[0],
        balance: contractInfo[1],
        requestsCount: contractInfo[2],
        approversCount: contractInfo[3],
        manager: contractInfo[4]
      })
      const accounts = await web3.eth.getAccounts()
      const contractManager = await contract.methods.manager().call()
      setIsManager(contractManager === accounts[0])
    }

    campaignId && getCampaignContract()
  }, [campaignId])

  const items = campaignSummary && [
    {
      header: '👨‍💼 ' +
        campaignSummary.manager.split('').filter((_letter, index) => index < 5).join('')
        + '...' +
        campaignSummary.manager.split('').filter((_letter, index) => index > campaignSummary.manager.length - 6).join(''),
      meta: 'Manager Address',
      description: 'The manager created this campaign and can create requests to withdraw money.',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: '🔼 ' + campaignSummary.minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You must contribute at least this much wei to become a contributor.'

    },
    {
      header: '💬 ' + campaignSummary.requestsCount,
      meta: 'Spending Requests',
      description: 'A request is created by the campaign manager to withdraw money from the campaign. Requests must be approved by the majority of contributors.'
    },
    {
      header: '🧑🏿‍🤝‍🧑🏻 ' + campaignSummary.approversCount,
      meta: 'Contributors',
      description: 'Number of people who have already contributed to this campaign.'
    },
    {
      header: '💰 ' + web3.utils.fromWei(campaignSummary.balance, 'ether'),
      meta: 'Current Balance (ETH)',
      description: 'The balance is how much money this campaign has left to spend.'
    }
  ]

  return (
    <div id='campaign-details'>
      <h2>Campaign Details</h2>
      <h3>Here you&apos;ll find the details of this campaign.</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>

          <Grid.Column width={6}>
            {isManager ? <h3>You&apos;re the manager of this campaign! 😎</h3> : <Contribute campaign={campaign} />}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignId}/requests`}>
              <a>
                <Button color="green">View Spending Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}
