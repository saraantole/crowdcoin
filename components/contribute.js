import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../utils/web3";

export default function Contribute({ campaign }) {
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods
                .contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(amount, 'ether')
                })
            router.reload()
        } catch (e) {
            setError(e.message)
        }

        setLoading(false)
        setAmount('')
    }

    return (
        <Form onSubmit={onSubmit} error={!!error}>
            <Form.Field required width={15}>
                <label>Amount to Contribute</label>
                <Input
                    disabled={loading}
                    type='number'
                    label='eth'
                    labelPosition="right"
                    value={amount}
                    onChange={e => { setError(''); setAmount(e.target.value) }}
                />
            </Form.Field>
            <Message header='Oops!' error content={error} />
            <Button loading={loading} color='green'>Contribute!</Button>
        </Form>
    )
}
