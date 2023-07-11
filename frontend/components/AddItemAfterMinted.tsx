import { useContractWrite, useContract } from "@thirdweb-dev/react";
import { useRouter } from 'next/router';

import abi from '../constants/ERC6551Memories.json';

interface AddItemAfterMintedProps {
    tokenId: number;
    itemTokenId: number
}

const AddItemAfterMinted: React.FC<AddItemAfterMintedProps> = ({ tokenId, itemTokenId }) => {
    const router = useRouter(); 

    const contractAddress = '0x2C9FFf3A8e4B06BC13e388798F857d7d14268B6F';
    const contractAbi = abi.abi;

    const { contract } = useContract(contractAddress, contractAbi);

    const itemsContractAddress = '0x5F591d8Ac37D7B888dfa285bf0CE7904a2BEa6c8';
    const { mutateAsync: addItemToMemory } = useContractWrite(contract, "addItemToMemory", [tokenId, itemsContractAddress, itemTokenId]);
    return (
        <div>AddItemAfterMinted</div>
    )
}

export default AddItemAfterMinted