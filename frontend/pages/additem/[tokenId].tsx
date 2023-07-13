import { useRouter } from 'next/router';
import { useAddress, useContractRead, useContractWrite, useContract, useTransferNFT, Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import abi from '../../constants/ERC6551MemoriesItems.json';
import MintNFTForm from '../../components/MintNFTForm';

const AddItem = () => {
  const router = useRouter(); 
  const { tokenId } = router.query; 

  const contractAddress = '0x51B483f43e8Bd7D3404B662d7f735EcA22Fc3d41';

  const address = useAddress();
  const { contract } = useContract(contractAddress, abi.abi);

  const { data: itemTokenId } = useContractRead(contract, "getTokenIdByAddress", [address]);
  const { data: memoryDetails } = useContractRead(contract, "getIndividualMemory", [tokenId]);
  const { mutateAsync: mintItem } = useContractWrite(contract, "mintItem");
  const {mutateAsync: transferNFT, isSuccess: isTransferSuccess} = useTransferNFT(contract);

  const [isItemMinted, setIsItemMinted] = useState(false)
  
  const handleMintItem = async (metadataURI: string) => {
    try {
      await mintItem({ args: [metadataURI] });
      alert("Minted Item!")
      setIsItemMinted(true)
    } catch (error) {
      alert(error) 
    }
  }

  useEffect(() => {
    if(isTransferSuccess) {
      alert("Item added successfully!");
      router.push(`/memory/${tokenId}`);
    }
  }, [isTransferSuccess, router]);

  if (!address) return <div>No wallet connected</div>

  return (
    <div>
        <Navbar linkHref={`/memory/${tokenId}`} linkText={'Back to memory info'}/> 
        <div className='flex flex-col items-start justify-start p-10'>
            <h1 className='text-4xl font-bold'>Add Item to Memory</h1>

            <MintNFTForm 
              contractAddress={contractAddress}
              web3ButtonText={'Mint Item'}
              web3ButtonFunction={handleMintItem}
            />

            <div className='mt-16'>
              {isItemMinted ? (
                <div className='flex flex-col'>
                  <h1>Item's NFT Token ID : {Number(itemTokenId)}</h1>
                  
                  <Web3Button
                    theme="light"
                    contractAddress={contractAddress}
                    action={() =>
                      transferNFT({
                        to: memoryDetails[2], 
                        tokenId: Number(itemTokenId), 
                      })
                    }
                  >
                    Add Item! 
                  </Web3Button>
                </div>
              ) : (
                <h1>Once your item has been minted, you can add your item!</h1>
              )}
            </div>
            
        </div>
    </div>
  )
}

export default AddItem
