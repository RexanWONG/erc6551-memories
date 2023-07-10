import { useRouter } from 'next/router';
import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";

import abi from "../../constants/ERC6551Memories.json";
import Navbar from '../../components/Navbar';
import Loading from "../../components/Loading";


interface MemoryCardProps {
  creator: string;
}

const Memory: React.FC<MemoryCardProps> = () => {
  const router = useRouter();
  const { tokenId } = router.query; 

  const { contract } = useContract('0xa1D7721554624E67c91c9BC41B5BC230EE197Dec', abi.abi);
  const { data: nft, isLoading, error } = useNFT(contract, String(tokenId));

  if (isLoading) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'><Loading /></div>;
  if (error || !nft) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'>NFT not found</div>;

  return (
    <div>
        <Navbar linkHref={'/'} linkText={'Back to home'}/> 
        <div className='flex flex-row items-center justify-center mt-16'>
            <div className='flex flex-col items-start justify-start'>
                <ThirdwebNftMedia 
                    metadata={nft.metadata} 
                    controls={true} 
                    width={650} 
                    height={650} 
                    className='w-full object-cover rounded-lg border-2 border-gray-400' 
                />
                <h1 className='text-3xl text-gray-800 font-extrabold  text-left leading-[26px] truncate mt-3'>{nft.metadata.name}</h1>
                
            </div>
            
        </div>
    </div>

  );
}

export default Memory;
