pragma solidity ^0.8.0;

contract NumberStore {
    
    // Contract instances
    Incrementer internal incrementer;
    
    // Variables
    uint public numberStored;
    address public incrementerAddress;

    constructor(address _address) {
        incrementerAddress = _address;
    }
    
    // Calls Incrementer Contract
    function incrementNumber() public {
        
        // Call Incrementer
        incrementer = Incrementer(incrementerAddress);
        numberStored = incrementer.increment(numberStored);
    }
}

contract Incrementer {
    function increment(uint _number) external pure returns (uint) {
        return _number + 1;
    }
}
