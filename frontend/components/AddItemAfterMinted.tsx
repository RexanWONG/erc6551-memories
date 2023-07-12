import { Web3Button, useContractWrite, useContract } from "@thirdweb-dev/react";
import { useRouter } from 'next/router';

import abi from '../constants/ERC6551Memories.json';

interface AddItemAfterMintedProps {
    tokenId: number;
    itemTokenId: number
}

const AddItemAfterMinted: React.FC<AddItemAfterMintedProps> = ({ tokenId, itemTokenId }) => {
    const router = useRouter(); 

    const contractAddress = '0x6696d0E4D89394A8aCAD839249Abe8B91F3055a2';
    const contractAbi = abi.abi;

    const { contract } = useContract(contractAddress, contractAbi);

    const { mutateAsync: addItemToMemory } = useContractWrite(contract, "addItemToMemory");

    const handleAddItemToMemory = async () => {
        try {
          await addItemToMemory({ args: [tokenId, itemTokenId] });
          alert("Item Added!") 
          router.push(`/memory/${tokenId}`)
        } catch (error) {
          console.error(error)
        }
    }

    return (
        <Web3Button
            theme="light"
            contractAddress={contractAddress}
            action={handleAddItemToMemory}
        >
            Add Item!
        </Web3Button>
    )
}

export default AddItemAfterMinted