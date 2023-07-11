import { useRouter } from 'next/router';
import { useAddress, useContractWrite, useContract } from "@thirdweb-dev/react";

import Navbar from '../../components/Navbar';
import itemsAbi from '../../constants/ERC6551MemoriesItems.json';
import MintNFTForm from '../../components/MintNFTForm';
import AddItemAfterMinted from '../../components/AddItemAfterMinted';

const AddItem = () => {
  const router = useRouter(); 
  const { tokenId } = router.query; 

  const itemsContractAddress = '0x5F591d8Ac37D7B888dfa285bf0CE7904a2BEa6c8';
  const itemsABI = itemsAbi.abi;

  const address = useAddress();
  const { contract } = useContract(itemsContractAddress, itemsABI);
  const { mutateAsync: mintItem } = useContractWrite(contract, "mintItem");

  const handleMintItem = async (metadataURI: string) => {
    try {
      await mintItem({ args: [metadataURI] });
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
              web3ButtonFunction={() => handleMintItem}
            />

            {/* <AddItemAfterMinted tokenId={tokenId} itemTokenId={} */}
        </div>
    </div>
  )
}

export default AddItem
