// SPDX-License-Identifier: MIT
// Sepolia : 0x0E45Ce20ECce7Fd93A1399430aE72D80D387fCa9
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC6551Memories.sol";

contract ERC6551MemoriesItems is ERC721, ERC721Enumerable, ERC721URIStorage {
    ERC6551Memories public mainMemoriesContract;
    
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ERC6551-Memories-Items", "EMI") {
        mainMemoriesContract = ERC6551Memories(0xfDF30D1b5fa83d5cBfF66F4e3fc64Bba7d1f8499);
    }

    mapping(address => uint256) public addressToTokenId;

    function mintItem(string memory _uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);

        addressToTokenId[msg.sender] = tokenId;
    }

    function getTokenIdByAddress(address _address) public view returns (uint256) {
        return addressToTokenId[_address];
    }

    function getIndividualMemory(uint256 _tokenId) public view returns (uint256, address, address) {
        return mainMemoriesContract.getIndividualMemory(_tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}