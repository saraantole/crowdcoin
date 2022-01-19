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
    }

    campaignId && getCampaignContract()
  }, [campaignId])

  const items = campaignSummary && [
    {
      header: campaignSummary.manager,
      meta: 'Manager Address',
      description: 'The manager created this campaign and can create requests to withdraw money',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: campaignSummary.minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You must contribute at least this much wei to become an approver'

    },
    {
      header: campaignSummary.requestsCount,
      meta: 'Spending Requests',
      description: 'A request tries to withdraw money from the contract. Requests must be approved my approvers'
    },
    {
      header: campaignSummary.approversCount,
      meta: 'Approvers',
      description: 'Number of people who have already contributed to this campaign'
    },
    {
      header: web3.utils.fromWei(campaignSummary.balance, 'ether'),
      meta: 'Current Balance (ETH)',
      description: 'The balance is how much money this campaign has left to spend'
    }
  ]

  return (
    <>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>

          <Grid.Column width={6}>
            <Contribute campaign={campaign} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignId}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}
