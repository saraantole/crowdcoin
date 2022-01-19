import { Card, Button } from 'semantic-ui-react'
import Link from "next/link"

export default function Home() {


  return (
    <div>
      <h3>CrowdCoin, where ideas come true.</h3>
      <Link href='/campaigns/new'><a>
        <Button
          content='Create Campaign'
          icon='add circle'
          color='green'
          floated="right"
        />
      </a>
      </Link>
      <Link href='/campaigns'><a>
        <Button
          content='Explore Campaigns'
          icon='arrow right'
          color='green'
          floated="right"
        />
      </a>
      </Link>
    </div>
  )
}
