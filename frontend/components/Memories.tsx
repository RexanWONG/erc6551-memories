import { useEffect, useState } from 'react';
import { useContract, useContractRead } from "@thirdweb-dev/react";
import Link from 'next/link';

import abi from '../constants/ERC6551Memories.json'
import MemoryCard from './MemoryCard';

const Memories = () => {
  const contractAddress = '0x1E897d2A2405dE2fa142056A6269DE7ee1c1433c';
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
            <Link href={`/memory/${memory[0]}`}>
              <MemoryCard 
                key={index} 
                contractAddress={contractAddress} 
                tokenId={memory[0]} 
                creator={memory[1]}
                tbaAddress={memory[2]}
              />
            </Link>
          )}
        </div>
    </div>
  )
}

export default Memories
