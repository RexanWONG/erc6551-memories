import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAddress, ThirdwebNftMedia, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import truncateEthAddress from 'truncate-eth-address'

import abi from "../../constants/ERC6551Memories.json";
import Navbar from '../../components/Navbar';
import Loading from "../../components/Loading";

const Memory = () => {
  const router = useRouter();
  const { tokenId } = router.query; 

  const contractAddress = '0xED377fE7104e5657BF3b8C5B2D0B8158332D641F';

  const { contract } = useContract(contractAddress, abi.abi);
  const address = useAddress();

  const { data: memory, isLoading: memoryLoading, error: memoryError } = useContractRead(contract, "getIndividualMemory", [tokenId]);
  const { data: nft, isLoading: nftLoading, error: nftError } = useNFT(contract, String(tokenId));

  if (!address) return <div>No wallet connected</div>
  if (memoryLoading || nftLoading) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'><Loading /></div>;
  if (memoryError || nftError || !nft || !memory) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'>NFT not found</div>;

  return (
    <div>
        <Navbar linkHref={'/'} linkText={'Back to home'}/> 
        <div className='flex flex-row items-center justify-center gap-16 mt-16'>
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
                  <span className="text-gray-500 text-[20px] font-light">by {truncateEthAddress(memory[1])}</span>
                </h1>
            </div>
            
            <div className='flex flex-col items-start justify-start'>
                <div className='flex flex-row items-center justify-center gap-32'>
                  <p className='text-gray-500 text-[20px]'>{truncateEthAddress(memory[2])}</p>
                    {address === memory[1] ? (
                      <Link href={`/additem/${memory[0]}`}>
                        <button className="bg-black text-white hover:bg-neutral-600 font-light rounded-lg px-4 py-2">
                          Add item
                        </button>
                      </Link>
                    ) : (
                      <h1>no hello</h1>
                    )}
                </div>
            </div>
            
        </div>
    </div>

  );
}

export default Memory;
