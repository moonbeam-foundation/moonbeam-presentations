// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Token is ERC721URIStorage {
    // Set Counters
    using Counters for Counters.Counter;
    Counters.Counter private tokenIDs;

    constructor() ERC721('MoonLink NFT', 'ML-NFT') {
    }

    function mintNFT(string memory tokenURI) public  {
        // Mint Token
        _mint(msg.sender, tokenIDs.current());
        // Set URI
        _setTokenURI(tokenIDs.current(), tokenURI);
        // Increment Counter
        tokenIDs.increment();
    }
}