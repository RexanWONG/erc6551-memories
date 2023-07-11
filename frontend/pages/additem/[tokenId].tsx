import { useRouter } from 'next/router';
import { useAddress, useContractWrite, useContract } from "@thirdweb-dev/react";

import Navbar from '../../components/Navbar';
import itemsAbi from '../../constants/ERC6551MemoriesItems.json';
import MintNFTForm from '../../components/MintNFTForm';

const AddItem = () => {
  const router = useRouter(); 
  const { tokenId } = router.query; 

  const itemsContractAddress = '0xC1141d65B3eA5303bFc58453B1dc3A58Fb87af0f';
  const itemsABI = itemsAbi.abi;

  const address = useAddress();
  const { contract } = useContract(itemsContractAddress, itemsABI);
  const { mutateAsync: safeMint } = useContractWrite(contract, "safeMint");

  const handleSafeMint = async (metadataURI: string) => {
    try {
      await safeMint({ args: [address, metadataURI] });
      alert("Minted Item") 
    } catch (error) {
      console.error(error)
    }
  }

  if (!address) return <div>No wallet connected</div>
  
  return (
    <div>
        <Navbar linkHref={`/memory/${tokenId}`} linkText={'Back to memory info'}/> 
        <div className='flex flex-col items-start justify-start p-10'>
            <h1 className='text-4xl font-bold'>Add Item</h1>

            <MintNFTForm 
              contractAddress={itemsContractAddress}
              web3ButtonText={'Add Item!'}
              web3ButtonFunction={() => handleSafeMint}
            />
        </div>
    </div>
    
  )
}

export default AddItem
