//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.5;

// Factory that creates each campaign
contract CampaignFactory {
    Campaign[] deployedCampaigns;

    function createCampaign(uint256 _minimum) public {
        Campaign newCampaign = new Campaign(_minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

// Campaign contract
contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    uint numRequests;
    mapping (uint => Request) public requests;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    // Request structure
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) yesVotes; //Not value type thus it doesnt need initilazing
    }
    
    // onlyOwner
    modifier isManager() {
        require(msg.sender == manager, "Not manager!");
        _;
    }

    constructor(uint256 _minimum, address _creator) {
        manager = _creator;
        minimumContribution = _minimum;
    }

    //Contribute to project
    function contribute() public payable {
        require(msg.value >= minimumContribution, "Not enough!");

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    // Create request to be voted by contributors
    function createRequest(
        string memory _description,
        uint256 _value,
        address _recipient
    ) public isManager returns(uint requestID) {
        requestID = numRequests++;
        Request storage r = requests[requestID];
        r.description = _description;
        r.value = _value;
        r.recipient = payable(_recipient);
        r.complete = false;
        r.approvalCount = 0;
    }
    
    
    // Contributors approve request
    function approveRequest(uint requestID) public {
        Request storage currentRequest = requests[requestID];

        require(approvers[msg.sender], "Not a contributor");
        require(!currentRequest.yesVotes[msg.sender], "You already voted.");

        currentRequest.yesVotes[msg.sender] = true;
        currentRequest.approvalCount++;
    }
    
    // Owner finalizes request
    function finalizeRequest(uint256 _index) public payable isManager {
        Request storage currentRequest = requests[_index];

        require(
            currentRequest.approvalCount > (approversCount / 2),
            "No majority achieved"
        );
        require(!currentRequest.complete, "Request has already been completed");

        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }
    
    // Get the summary of a Campaign
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
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }
    
    function getRequestCount() public view returns (uint256) {
        return numRequests;
    }
}