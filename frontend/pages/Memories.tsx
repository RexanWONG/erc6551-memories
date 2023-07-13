import { useEffect, useState } from 'react';
import { useContract, useContractRead } from "@thirdweb-dev/react";
import Link from 'next/link';

import abi from '../constants/ERC6551Memories.json'
import MemoryCard from '../components/MemoryCard';

const Memories = () => {
  const contractAddress = '0xfDF30D1b5fa83d5cBfF66F4e3fc64Bba7d1f8499';
  const { contract } = useContract(contractAddress, abi.abi);
  
  const { data, isLoading, error } = useContractRead(contract, "getMemories");
  
  const [listOfMemories, setListOfMemories] = useState([]);

  useEffect(() => {
    if (error) {
      console.error("Failed to read contract", error);
    }

    if (!isLoading && data) {
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
                tokenId={Number(memory[0])} 
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
