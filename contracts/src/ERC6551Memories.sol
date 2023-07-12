// SPDX-License-Identifier: MIT
// Sepolia : 0x4Db40DC251EF1Ffd0BeA25CC7Df1D21Efd55Ce31
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@reference/src/lib/ERC6551AccountLib.sol";

contract ERC6551Memories is ERC721, ERC721Enumerable, ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("erc6551-memories", "E6M") {}

    struct Memory {
        uint256 tokenId;
        address creator;
        address tbaAddress;
    }

    mapping(uint256 => Memory) public memories;

    function createMemory(string memory _uri) public {
        require(bytes(_uri).length > 0, "Please insert a URI");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);

        address _tbaAddress = _computeTbaAddress(tokenId);

        Memory storage newMemory = memories[tokenId];

        newMemory.creator = msg.sender;
        newMemory.tokenId = tokenId;
        newMemory.tbaAddress = _tbaAddress;
    }

    function donateToMemory(uint256 _tokenId) payable public {
        Memory storage _memory = memories[_tokenId];

        require(msg.value <= msg.sender.balance, "insufficient funds");

        (bool success, ) = _memory.tbaAddress.call{value: msg.value, gas: 2300}("");
        require(success, "Transfer to creator failed");
    }

    function _computeTbaAddress(uint256 tokenId) internal view returns (address) {
        address registry = 0x02101dfB77FDE026414827Fdc604ddAF224F0921;
        address implementation = 0x2D25602551487C3f3354dD80D76D54383A243358;
        uint256 chainId = 11155111; // Sepolia
        address tokenContract = address(this);
        uint salt = 0;    

        address _tbaAddress = ERC6551AccountLib.computeAddress(
            registry, 
            implementation, 
            chainId, 
            tokenContract, 
            tokenId, 
            salt
        );

        return _tbaAddress;
    }

    // view functions (for frontend)

    function getMemories() public view returns (Memory[] memory) {
        Memory[] memory allMemories = new Memory[](_tokenIdCounter.current());

        for (uint256 i = 0; i < _tokenIdCounter.current(); ++i) {
            Memory storage item = memories[i];
            allMemories[i] = item;
        }
        
        return allMemories;
    }

    function getIndividualMemory(uint256 _tokenId) public view returns (uint256, address, address) {
        return (
           memories[_tokenId].tokenId,
           memories[_tokenId].creator,
           memories[_tokenId].tbaAddress
        );
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