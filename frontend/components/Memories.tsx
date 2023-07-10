// Memories.tsx
import { useEffect, useState } from 'react';
import { useContract, useContractRead } from "@thirdweb-dev/react";
import abi from '../constants/ERC6551Memories.json'
import MemoryCard from './MemoryCard';

const Memories = () => {
  const contractAddress = '0x5042f2e43dCbD88bD530Bd07438c05e93C50666f';
  const { contract } = useContract(contractAddress, abi.abi);
  const { data, isLoading, error } = useContractRead(contract, "getMemories");
  
  const [listOfMemories, setListOfMemories] = useState([]);

  useEffect(() => {
    if (error) {
      console.error("Failed to read contract", error);
    }

    if (!isLoading && data) {
      console.log("Memories", data);
      setListOfMemories(data);
    }
  }, [data, isLoading, error]);

  return (
    <div className='p-10'>
        <h1 className='text-4xl font-bold'>View Memories</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          {listOfMemories.map((memory, index) => 
            <MemoryCard 
              key={index} 
              contractAddress={contractAddress} 
              tokenId={memory.tokenId} 
              creator={memory.creator}
              tbaAddress={memory.tbaAddress}
            />
          )}
        </div>
    </div>
  )
}

export default Memories
