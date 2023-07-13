import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAddress, ThirdwebNftMedia, useContract, useContractRead, useNFT, useOwnedNFTs } from "@thirdweb-dev/react";
import truncateEthAddress from 'truncate-eth-address'

import memoriesAbi from "../../constants/ERC6551Memories.json";
import itemsAbi from "../../constants/ERC6551MemoriesItems.json";
import Navbar from '../../components/Navbar';
import Loading from "../../components/Loading";
import MemoryInfoSection from '../../components/MemoryInfoSection';
import MemoryItems from '../../components/MemoryItems';

const Memory = () => {
  const router = useRouter();
  const { tokenId } = router.query; 

  const memoriesContractAddress = '0xfDF30D1b5fa83d5cBfF66F4e3fc64Bba7d1f8499';
  const itemsContractAddress = '0x0E45Ce20ECce7Fd93A1399430aE72D80D387fCa9';

  const { contract : memoriesContract } = useContract(memoriesContractAddress, memoriesAbi.abi);
  const { contract : itemsContract } = useContract(itemsContractAddress, itemsAbi.abi);

  const address = useAddress();

  const { data, isLoading: memoryDetailsLoading, error: memoryDetailsError } = useContractRead(memoriesContract, "getIndividualMemory", [tokenId]);
  const { data: nft, isLoading: nftLoading, error: nftError } = useNFT(memoriesContract, String(tokenId));

  const [memoryDetails, setMemoryDetails] = useState(null);

  const { data: ownedItems, isLoading: ownedItemsLoading, error: ownedItemsError} = useOwnedNFTs(itemsContract, memoryDetails ? memoryDetails[2] : null);

  useEffect(() => {
    if (data) {
      setMemoryDetails(data);
      console.log("Owned items : ", ownedItems) 
    }
  }, [data]);

  if (!address) return <div>No wallet connected</div>
  if (memoryDetailsLoading || nftLoading || ownedItemsLoading) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'><Loading /></div>;
  if (memoryDetailsError || nftError || !nft || !memoryDetails || !ownedItems || ownedItemsError) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'>NFT not found</div>;

  return (
    <div>
        <Navbar linkHref={'/'} linkText={'Back to home'}/> 
        <div className='flex flex-row items-center justify-center gap-16 mt-16'>

            <div className='flex flex-col items-start justify-start'>
                <ThirdwebNftMedia 
                    metadata={nft.metadata} 
                    controls={true} 
                    className="!md:h-96 !md:w-96 !h-full !max-h-[800px] !w-full !max-w-[800px] !rounded-lg !object-cover"
                />
                
                <div className='flex flex-row items-center justify-center gap-2 mt-3'>  
                  <h1 className="text-3xl text-gray-800 font-extrabold text-left leading-[26px]">
                    {nft.metadata.name}
                  </h1>
                  <span className="text-gray-500 text-[20px] font-light">by {truncateEthAddress(memoryDetails[1])}</span> 
                </div>  
                
            </div> 

            <MemoryInfoSection 
              memoryTokenId={Number(tokenId)}
              walletAddress={address}
              memoryCreatorWalletAddress={memoryDetails[1]}
              tbaAddress={memoryDetails[2]} 
              memoryDescription={String(nft.metadata.description)} 
              numOfItemsInMemory={ownedItems.length}
            />
        </div>
      
        <h1 className='text-4xl font-bold mt-12 p-10'>View Items</h1>

        <MemoryItems ownedItems={ownedItems as any} />
    </div>

  );
}

export default Memory;
