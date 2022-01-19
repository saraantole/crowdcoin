import { useRouter } from "next/router"
import { useState } from "react/cjs/react.development"
import { Button, Table } from "semantic-ui-react"
import web3 from "../utils/web3"

export default function Request({ isManager, isContributor, request, campaign, id, totalContributors, account, campaignBalance }) {
    const { Row, Cell } = Table
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onApprove = async () => {
        setLoading(true)
        try {
            await campaign.methods.approveRequest(id).send({ from: account })
            router.reload()
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    const onFinalize = async () => {
        setLoading(true)
        try {
            await campaign.methods.finalizeRequest(id).send({ from: account })
            router.reload()
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    const readyToFinalize = (request.approvalsCount > totalContributors / 2)  && (request.value < campaignBalance)

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>
                <a href={`https://etherscan.io/address/${request.recipient}`}
                    target='_blank' rel="noreferrer noopener" >{request.recipient}</a></Cell>
            <Cell>{request.approvalsCount}/{totalContributors}</Cell>
            {isContributor && !request.complete && request.approvalsCount < totalContributors && <Cell>
                <Button
                    color='green'
                    loading={loading} basic
                    onClick={onApprove}>
                    Approve
                </Button>
            </Cell>}
            {isManager && !request.complete && readyToFinalize && <Cell>
                <Button
                    color='green'
                    loading={loading} basic
                    onClick={onFinalize}>
                    Finalize
                </Button>
            </Cell>}
        </Row>
    )
}
