import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { FactoryContext } from "../../context/factory.context";
import web3 from "../../utils/web3";

export default function NewCampaign() {
  const [minimumContribution, setMinimumContribution] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const factory = useContext(FactoryContext)
  const router = useRouter()

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] })
      router.push('/')
    } catch (e) {
      setError(e.message)
    }

    setLoading(false)
    setMinimumContribution('')
  }

  return (
    <div>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minimumContribution}
            onChange={e => setMinimumContribution(e.target.value)}
            label='wei' labelPosition="right" />
        </Form.Field>
        <Message error header='Oops!' content={error} />
        <Button loading={loading} primary>Create</Button>
      </Form>
    </div>
  )
}
