import { Button } from 'semantic-ui-react'
import Link from "next/link"

export default function Home() {
  return (
    <div id='home'>
      <h1>Where <em style={{ color: '#21ba45' }}>ideas</em> come true.</h1>
      <div>
        <Link href='/campaigns'><a>
          <Button
            content=' Explore Campaigns'
            icon='angle right'
            color='green'
          />
        </a>
        </Link>
        <Link href='/campaigns/new'><a>
          <Button
            style={{ marginLeft: '10px' }}
            content='Create Campaign'
            icon='add circle'
            color='green'
          />
        </a>
        </Link>
      </div>
    </div>
  )
}
