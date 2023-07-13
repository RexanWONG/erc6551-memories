import React from 'react'

const HomepageDescription = () => {
  return (
    <div className="text-gray-500 mt-5 ml-10">
        <p>Each 'memory' is an ERC721 NFT that has been assigned to an ERC6551 token-bound account (TBA) address.  Thanks to the TBA address, each memory can own 'items'</p>
        <p>Each 'item' is an ERC721 NFT.  An item represents the photos or videos that are part of the memory collection.  To recap, an ERC721 memory can own multiple ERC721 items</p>
        <p>This dapp demostrates the power and functionality of ERC6551 TBA addresses.  You can create memories, add items to them, and donate ETH to the memory</p>
    </div>
  )
}

export default HomepageDescription