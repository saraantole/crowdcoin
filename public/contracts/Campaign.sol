// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender)); // create a new instance of a contract
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        // unlike the other varibles that are instantiated and can be used immediately everywhere, the struct is defined but not instantiated since it is like defining a new type not variable (like typescript interface)
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvals;
    }

    // arrays are good for iterating and lookups (not for search -> high gas fees loops -> O(n) - mappings are good to search one item in a list (hash tables - O(1) - not iterable
    // in mappings, if a value doesn't exists it returns the falsy version of the value type (eg. int -> 0, bool -> false, string -> '') inlike JS objects where is returns undefined
    // keys are not stored in mappings, but are converted to hash indexes when first added to the list

    address public manager;
    uint256 public minimumContribution;
    uint256 public approversCount;
    mapping(address => bool) public approvers;
    uint256 public requestsCount;
    mapping(uint256 => Request) public requests;

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (approvers[msg.sender] == false) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public managerOnly {
        Request storage newRequest = requests[requestsCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalsCount = 0; // no need to initialize the reference types (mappings, etc.), only the value types (bool, string, uint...)
    }

    function approveRequest(uint256 requestIndex) public {
        Request storage currentRequest = requests[requestIndex]; //storage because we want to manipulate the original Request struct, not create a copy

        require(msg.sender != manager);
        require(approvers[msg.sender]);
        require(!currentRequest.approvals[msg.sender]);

        currentRequest.approvals[msg.sender] = true;
        currentRequest.approvalsCount++;
    }

    function finalizeRequest(uint256 requestIndex) public managerOnly {
        Request storage currentRequest = requests[requestIndex];
        require(currentRequest.approvalsCount > (approversCount / 2));
        require(!currentRequest.complete);

        payable(currentRequest.recipient).transfer(currentRequest.value);
        currentRequest.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance, // contract balance
            requestsCount,
            approversCount,
            manager
        );
    }
}
