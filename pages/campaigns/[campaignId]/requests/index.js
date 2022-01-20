import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadCampaignContract } from "../../../../utils/campaign";
import web3 from "../../../../utils/web3";
import Request from '../../../../components/request'

export default function Requests() {
  const router = useRouter()
  const { campaignId } = router.query
  const [campaign, setCampaign] = useState(undefined)
  const [account, setAccount] = useState(undefined)
  const [requests, setRequests] = useState([])
  const [totalContributors, setTotalContibutors] = useState(undefined)
  const [isContributor, setIsContributor] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [campaignBalance, setCampaignBalance] = useState(undefined)

  useEffect(() => {
    const getCampaignContract = async () => {
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      const contract = await loadCampaignContract(campaignId)
      setCampaign(contract)

      const contractManager = await contract.methods.manager().call()
      setIsManager(contractManager === accounts[0])

      const requestsLength = await contract.methods.requestsCount().call()
      const requestsArray = await Promise.all(
        Array(Number(requestsLength))
          .fill()
          .map((_element, index) => contract.methods.requests(index).call())
      )
      setRequests(requestsArray)

      const approvers = await contract.methods.approversCount().call()
      setTotalContibutors(approvers)

      const isApprover = await contract.methods.approvers(accounts[0]).call()
      setIsContributor(isApprover)

      const contractInfo = await contract.methods.getSummary().call()
      setCampaignBalance(contractInfo[1])
    }

    campaignId && getCampaignContract()
  }, [campaignId])

  return (
    <div id='spending-request'>
      <h2>Spending Requests</h2>
      <h3>{isManager ? 'Check the status of your spending requests or create a new one.' : 'Check if there is any new spending request to review.'}</h3>
      {
        isManager &&
        <Link href={`/campaigns/${campaignId}/requests/new`}>
          <a>
            <Button color="green" floated="right" style={{ marginBottom: '10px' }}>Add Request</Button>
          </a>
        </Link>
      }
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Request Amount (ETH)</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            {isContributor && !isManager && <Table.HeaderCell>Approve</Table.HeaderCell>}
            {isManager && <Table.HeaderCell>Finalize</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request, index) => <Request campaignBalance={campaignBalance} isManager={isManager} isContributor={isContributor} account={account} key={index} totalContributors={totalContributors} id={index} request={request} campaign={campaign} />)}
        </Table.Body>
      </Table>
      <p>Found {requests.length} request{requests.length !== 1 && 's'}.</p>
    </div>
  )
}
