pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";

/**
 * @title Client based in ChainlinkClient
 * @notice End users can deploy this contract to request the EthereumPrice from an Oracle
 */
contract Client is ChainlinkClient {
  // Stores the answer from the Chainlink oracle
  uint256 public currentPrice;
  uint public lastBlockTime;
  address public owner;
  address public oracleAddress;
  address public linkToken;
  string private tempJobId;
  string public lastJobId;
  bool public fulfillCheck = true;
  
  constructor() public {
    owner = msg.sender;
    oracleAddress = 0x1d693d883BeAeE16edD0D7588D6a9f7E1967E798;
    linkToken = 0xa36085F69e2889c224210F603D836748e7dC0088;
    setChainlinkToken(linkToken);
  }

  /**
   * @notice Creates a Chainlink request with the job specification ID,
   * @notice and sends it to the Oracle.
   * @notice _oracle The address of the Oracle contract fixed top
   * @notice _payment For this example the PAYMENT is set to zero
   * @param _jobId The job spec ID that we want to call in string format 
   */
  function requestPrice(string memory _jobId) 
    public
  {
    require(fulfillCheck, 'There is a pending request');
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(oracleAddress, req, 0);
    fulfillCheck = false;
    tempJobId = _jobId;
  }

  /**
   * @notice Callback function called by the Oracle when it has resolved the request
   * @dev Using recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
   * @param _requestId The request ID sent to the Oracle in the first place
   * @param _price The result of the request (multiplied by a factor of 100)
   */
  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
    lastBlockTime = block.timestamp;
    lastJobId = tempJobId;
    fulfillCheck = true;
  }
  
  function forceToTrue() public {
      fulfillCheck = true;
  }
  
  /**
   * @notice Allows the owner to cancel an unfulfilled request
   * @param _requestId The request ID sent to the Oracle in the first place
   * @param _payment The payment sent to the Oracle in the first place
   * @param _callbackFunctionId The ID of the callback function that would 
   * have been called by the Oracle to store the result of the request
   * @param _expiration The time of expiration for the request
   */
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  /**
   * @notice Allows the owner to withdraw the LINK tokens in the contract
   * @notice to the address calling this function
   */
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  /**
   * @notice Decodes an input string in a bytes32 word
   * @param _source The input string
   * @return result A bytes32 word of the decoded string
   */
  function stringToBytes32(string memory _source)
    private
    pure
    returns (bytes32 result) 
  {
    bytes memory emptyStringTest = bytes(_source);
    if (emptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(_source, 32))
    }

    return result;
  }
  
  /**
   * @dev Reverts if the sender is not the owner of the contract
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
}
