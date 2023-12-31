import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";

import abi from "../constants/ERC6551Memories.json";
import Loading from "./Loading";

interface MemoryCardProps {
  contractAddress: string;
  tokenId: number;
  creator: string;
  tbaAddress: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ contractAddress, tokenId, creator, tbaAddress }) => {
  const { contract } = useContract(contractAddress, abi.abi);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);

  if (isLoading) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'><Loading /></div>;
  if (error || !nft) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'>NFT not found</div>;

  return (
    <div className='transition-all duration-200 ease-in-out transform hover:scale-105 rounded-2xl overflow-hidden shadow-md bg-white border-2 border-gray-200'>
      <ThirdwebNftMedia 
        metadata={nft.metadata} 
        controls={true} 
        className='className="!md:h-96 !md:w-96 !h-full !w-full !rounded-t-2xl !rounded-b-sm !object-cover"' />

      <div className="block p-4">
        <h3 className="font-extrabold text-[24px] text-gray-800 text-left leading-[26px] truncate">{nft.metadata.name}</h3>
        <p className="mt-2 font-normal text-gray-500 text-left leading-[18px] truncate">{nft.metadata.description}</p>
      </div>

      <div className="flex items-center p-4">
        <div className='flex-1 flex flex-col'>
          <p className="text-[12px]">
            <span className="text-gray-500">
              <p>Creator : {(creator)}</p>
              <p>TBA address : {(tbaAddress)}</p>
              <p className="mt-[2px]">Token ID: {tokenId.toString()}</p>
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}

export default MemoryCard;
