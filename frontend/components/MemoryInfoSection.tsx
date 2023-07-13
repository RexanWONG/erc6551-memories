import Link from "next/link"
import truncateEthAddress from "truncate-eth-address"

interface MemoryInfoSectionProps {
    memoryTokenId: number;
    walletAddress: string;
    memoryCreatorWalletAddress: string;
    tbaAddress: string;
    memoryDescription: string;
    numOfItemsInMemory: number;
}

const MemoryInfoSection: React.FC<MemoryInfoSectionProps> = ({ memoryTokenId, walletAddress, memoryCreatorWalletAddress, tbaAddress, memoryDescription, numOfItemsInMemory }) => {
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
              <h1>no hello</h1>
            )}
        </div>
        <div className="mt-5">
              <h1 className="text-4xl mb-5">
                {numOfItemsInMemory} items  
              </h1>
              <p className='text-gray-500 mt-16'> 
                {memoryDescription}
              </p>

        </div>
    </div>
  )
}

export default MemoryInfoSection