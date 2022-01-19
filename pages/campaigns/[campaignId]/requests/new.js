import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react/cjs/react.development";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { loadCampaignContract } from "../../../../utils/campaign";
import web3 from "../../../../utils/web3";

export default function NewRequest() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { campaignId } = router.query

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const campaign = await loadCampaignContract(campaignId)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(amount, 'ether'), recipient)
        .send({ from: accounts[0] })
      router.push(`/campaigns/${campaignId}`)
    } catch (e) {
      setError(e.message)
    }

    setDescription('')
    setAmount('')
    setRecipient('')
    setLoading(false)
  }


  return (
    <>
      <Link href={`/campaigns/${campaignId}/requests`}><a>Back</a></Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Amount (ETH)</label>
          <Input value={amount} onChange={e => setAmount(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient Address</label>
          <Input value={recipient} onChange={e => setRecipient(e.target.value)} />
        </Form.Field>
        <Message error content={error} header='Oops!' />
        <Button loading={loading} primary>Create!</Button>
      </Form>
    </>
  )
}
