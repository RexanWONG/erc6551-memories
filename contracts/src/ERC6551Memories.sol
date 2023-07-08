// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@reference/src/lib/ERC6551AccountLib.sol";

contract ERC6551Memories is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("erc6551-memories", "E6M") {}

    uint256 numOfMemories;

    struct Memory {
        uint256 id;
        address creator;
        string name;
        string description;
        string memoryThumbnailIpfsHash;
        address tbaAddress;
        string[] itemsIpfsHashes;
        uint256 totalDonationsAmount;
    }

    mapping(uint256 => Memory) public _memories;

    function createMemory(
        string memory _name,
        string memory _description,
        string memory _memoryThumbnailIpfsHash,
        string memory _uri
    ) public {
        require(bytes(_name).length > 0, "Please insert a name");
        require(bytes(_description).length > 0, "Please insert a description");
        require(bytes(_memoryThumbnailIpfsHash).length > 0, "Please insert a thumbnail");
        require(bytes(_uri).length > 0, "Please insert a URI");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);

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

        Memory storage newMemory = _memories[numOfMemories];

        newMemory.id = numOfMemories;
        newMemory.creator = msg.sender;
        newMemory.name = _name;
        newMemory.description = _description;
        newMemory.memoryThumbnailIpfsHash = _memoryThumbnailIpfsHash;
        newMemory.tbaAddress = _tbaAddress;
        newMemory.totalDonationsAmount = 0;

        numOfMemories++;
    }

    function addItemToMemory(
        uint256 _id, 
        string memory _uri,
        string memory _itemIpfsHash
    ) public {
        require(bytes(_uri).length > 0, "Please insert a URI");
        require(bytes(_itemIpfsHash).length > 0, "Please insert an item ipfs hash");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);

        Memory storage _memory = _memories[_id];

        ERC721 item = ERC721(address(this));
        item.safeTransferFrom(msg.sender, _memory.tbaAddress, tokenId); 

        _memory.itemsIpfsHashes.push(_itemIpfsHash);
    }

    function donateToMemory(
        uint256 _id
    ) payable public {
        Memory storage _memory = _memories[_id];

        require(msg.value <= msg.sender.balance, "insufficient funds");

        (bool success, ) = _memory.tbaAddress.call{value: msg.value, gas: 2300}("");
        require(success, "Transfer to creator failed");

        _memory.totalDonationsAmount += msg.value;
    }

    // View functions

    function getNumOfMemories() public view returns (uint256) {
        return numOfMemories;
    }

    function getMemory(uint256 _id) public view returns (
        uint256,
        address,
        string memory,
        string memory, 
        string memory,
        address,
        string[] memory,
        uint256
    ){
        Memory storage _memory = _memories[_id];

        return (
            _memory.id,
            _memory.creator,
            _memory.name,
            _memory.description,
            _memory.memoryThumbnailIpfsHash,
            _memory.tbaAddress,
            _memory.itemsIpfsHashes,
            _memory.totalDonationsAmount
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