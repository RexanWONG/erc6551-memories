import { useContractWrite, useContract } from "@thirdweb-dev/react";
import abi from '../../constants/ERC6551Memories.json';

const contractAddress = '0xE6b5EFc893c69f0844A1A9b66EA50eFc6CEBa7f5';
const contractAbi = abi.abi;

const { contract } = useContract(contractAddress, contractAbi);

const { mutateAsync: addItemToMemory } = useContractWrite(contract, "addItemToMemory");

const handleAddItemToMemory = async (tokenId: number, contractAddress: string, itemTokenId: number) => {
    try {
      await addItemToMemory({ args: [tokenId, contractAddress, itemTokenId] });
      alert("Minted Item") 
    } catch (error) {
      console.error(error)
    }
}
