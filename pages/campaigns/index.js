import { useContext, useEffect, useState } from "react"
import { Card, Button } from 'semantic-ui-react'
import Link from "next/link"
import { FactoryContext } from '../../context/factory.context'

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const factory = useContext(FactoryContext)

  useEffect(() => {
    const getCampaigns = async () => {
      const campaigns = await factory.methods.getDeployedCampaigns().call()
      setCampaigns(campaigns.map(campaignAddress => (
        {
          header: campaignAddress,
          description: <Link href={`/campaigns/${campaignAddress}`}><a>View Campaign</a></Link>,
          fluid: true
        }
      )))
    }

    factory && getCampaigns()
  }, [factory])

  return (
    <div>
      <h3>Active Campaigns</h3>
      <Link href='/campaigns/new'><a>
        <Button
          content='Create Campaign'
          icon='add circle'
          color='olive'
          floated="right"
        />
      </a>
      </Link>
      <Card.Group items={campaigns} />
    </div>
  )
}
