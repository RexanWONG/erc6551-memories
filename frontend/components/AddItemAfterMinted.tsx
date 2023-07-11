import React from 'react'

interface AddItemAfterMintedProps {
    tokenId: string;
    itemTokenId: string
}

const AddItemAfterMinted: React.FC<AddItemAfterMintedProps> = ({ tokenId, itemTokenId }) => {
  return (
    <div>AddItemAfterMinted</div>
  )
}

export default AddItemAfterMinted