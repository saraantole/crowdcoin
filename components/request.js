import { useRouter } from "next/router"
import { useState } from "react"
import { Button, Table } from "semantic-ui-react"
import web3 from "../utils/web3"

export default function Request({ isManager, isContributor, request, campaign, id, totalContributors, account, campaignBalance }) {
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

    const readyToFinalize = (request.approvalsCount > totalContributors / 2) && (request.value < campaignBalance)

    return (
        <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{request.description}</Table.Cell>
            <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
            <Table.Cell>
                <a href={`https://etherscan.io/address/${request.recipient}`} style={{ color: 'green' }}
                    target='_blank' rel="noreferrer noopener" >{request.recipient}</a></Table.Cell>
            <Table.Cell>{request.approvalsCount}/{totalContributors}</Table.Cell>
            {isContributor && !isManager && !request.complete && request.approvalsCount < totalContributors && <Table.Cell>
                <Button
                    color='green'
                    loading={loading} basic
                    onClick={onApprove}>
                    Approve
                </Button>
            </Table.Cell>}
            {isManager && !request.complete && readyToFinalize && <Table.Cell>
                <Button
                    color='green'
                    loading={loading} basic
                    onClick={onFinalize}>
                    Finalize
                </Button>
            </Table.Cell>}
        </Table.Row>
    )
}
