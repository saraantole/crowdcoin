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
  const { query: { campaignId } } = router

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
    <div id='request'>
      <Link href={`/campaigns/${campaignId}/requests`}><a style={{ color: 'black', float: 'right', textDecoration: 'underline' }}>Back</a></Link>
      <h2>Create a New Spending Request</h2>
      <h3>Fill in this form to create a new request to withdraw money from the balance.</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field required>
          <label>Description</label>
          <Input type="text" disabled={loading} value={description} onChange={e => { setError(''); setDescription(e.target.value) }} />
        </Form.Field>
        <Form.Field required>
          <label>Amount (ETH)</label>
          <Input type="number" disabled={loading} value={amount} onChange={e => { setError(''); setAmount(e.target.value) }} />
        </Form.Field>
        <Form.Field required>
          <label>Recipient Address</label>
          <Input type="text" disabled={loading} value={recipient} onChange={e => { setError(''); setRecipient(e.target.value) }} />
        </Form.Field>
        <Message error content={error} header='Oops!' />
        <Button loading={loading} color="green">Create Request!</Button>
      </Form>
    </div>
  )
}
