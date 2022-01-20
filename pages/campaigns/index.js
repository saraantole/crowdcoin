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
          header: '🌱 ' +
            campaignAddress.split('').filter((_letter, index) => index < 5).join('')
            + '...' +
            campaignAddress.split('').filter((_letter, index) => index > campaignAddress.length - 6).join(''),
          description: <Link href={`/campaigns/${campaignAddress}`}><a>View Campaign Details</a></Link>,
          fluid: true
        }
      )))
    }

    factory && getCampaigns()
  }, [factory])

  return (
    <div id='campaigns-preview'>
      <Link href='/campaigns/new'><a>
        <Button
          content='Create Campaign'
          icon='add circle'
          color='green'
          floated="right"
        />
      </a>
      </Link>
      <h2>Campaigns</h2>
      <h3>Take a look at our active campaigns</h3>
      <Card.Group stackable items={campaigns} itemsPerRow={3} className="cards" />
    </div>
  )
}
