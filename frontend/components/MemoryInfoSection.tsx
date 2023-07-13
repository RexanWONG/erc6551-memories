import { useState, useEffect } from "react";
import Link from "next/link"
import truncateEthAddress from "truncate-eth-address"
import { ethers } from "ethers";

interface MemoryInfoSectionProps {
    memoryTokenId: number;
    walletAddress: string;
    memoryCreatorWalletAddress: string;
    tbaAddress: string;
    memoryDescription: string;
    numOfItemsInMemory: number;
}

const MemoryInfoSection: React.FC<MemoryInfoSectionProps> = ({ memoryTokenId, walletAddress, memoryCreatorWalletAddress, tbaAddress, memoryDescription, numOfItemsInMemory }) => {
  const [balance, setBalance] = useState(0)
  

  const getWalletBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider.getBalance(tbaAddress).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(Number(balanceInEth))
     })
  }

  useEffect(() => {
    getWalletBalance()
  }, [])
  

  
  return (
    <div className='flex flex-col items-start justify-start'>
        <div className='flex flex-row items-center justify-center gap-32'>
          <p className='text-gray-500 text-[20px]'>{truncateEthAddress(tbaAddress)}</p> 
            {walletAddress === memoryCreatorWalletAddress ? ( 
              <Link href={`/additem/${memoryTokenId}`}>
                <button className="bg-black text-white hover:bg-neutral-600 font-light rounded-lg px-4 py-2">
                  Add item
                </button>
              </Link>
            ) : (
              <Link href={`/donate/${memoryTokenId}`}>
                <button className="bg-black text-white hover:bg-neutral-600 font-light rounded-lg px-4 py-2">
                  Donate ETH to item
                </button>
              </Link>
            )}
        </div>
        <div className="mt-5">
              <h1 className="text-4xl mb-5">
                <span className="font-bold">{numOfItemsInMemory}</span> items  
              </h1>
              <h1 className="text-4xl mb-5">
                <span className="font-bold">{balance}</span> ETH received  
              </h1>
              <p className='text-gray-500 mt-10'> 
                {memoryDescription}
              </p>
        </div>
    </div>
  )
}

export default MemoryInfoSection