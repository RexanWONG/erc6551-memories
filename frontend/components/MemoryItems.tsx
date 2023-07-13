import { ThirdwebNftMedia } from "@thirdweb-dev/react"

interface Metadata {
    name: string;
    description: string;
    image: string;
    id: string;
    uri: string;
  }
  
  interface MemoryItemsProps {
    ownedItems: Array<{ metadata: Metadata; owner: string; supply: string; type: string }>;
  }
  
const MemoryItems: React.FC<MemoryItemsProps> = ({ ownedItems }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-10"> 
        {ownedItems.map((item) => 
            <div key={item.metadata.id}>
                <div className='transition-all duration-200 ease-in-out transform hover:scale-105 rounded-2xl overflow-hidden shadow-md bg-white border-2 border-gray-200'>
                    <ThirdwebNftMedia 
                        metadata={item.metadata as any}   
                        controls={true} 
                        className='className="!md:h-96 !md:w-96 !h-full !w-full !rounded-t-2xl !rounded-b-sm !object-cover"' />

                    <div className="block p-4">
                        <h3 className="font-extrabold text-[24px] text-gray-800 text-left leading-[26px] truncate">{item.metadata.name}</h3>
                        <p className="mt-2 font-normal text-gray-500 text-left leading-[18px] truncate">{item.metadata.description}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
} 

export default MemoryItems 