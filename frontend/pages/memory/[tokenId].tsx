import { useRouter } from 'next/router';
import { ThirdwebNftMedia, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import truncateEthAddress from 'truncate-eth-address'

import abi from "../../constants/ERC6551Memories.json";
import Navbar from '../../components/Navbar';
import Loading from "../../components/Loading";


interface MemoryCardProps {
  creator: string;
}

const Memory: React.FC<MemoryCardProps> = () => {
  const contractAddress = '0xC14c22fD299148D3987C04e37F5ae296D0405e09';

  const router = useRouter();
  const { tokenId } = router.query; 

  const { contract } = useContract(contractAddress, abi.abi);
  const { data: memory } = 
    tokenId !== undefined ? useContractRead(contract, "getIndividualMemory", [tokenId]) : { data: null };

  const { data: nft, isLoading, error } = useNFT(contract, String(tokenId));

  const getMemory = () => {
    console.log("Memory", memory)
  }
  
  

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
                
                <h1 className="text-3xl text-gray-800 font-extrabold text-left leading-[26px] mt-3">
                  {nft.metadata.name}{" "}
                  <span className="text-gray-400 text-[20px] font-light">by {truncateEthAddress(memory[0])}</span>
                </h1>
            </div>
            
        </div>
    </div>

  );
}

export default Memory;
