import { useContractWrite, useContract } from "@thirdweb-dev/react";
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import abi from '../constants/ERC6551Memories.json';
import MintNFTForm from '../components/MintNFTForm';

const Create = () => {
  const router = useRouter(); 

  const contractAddress = '0x4Db40DC251EF1Ffd0BeA25CC7Df1D21Efd55Ce31';
  const contractAbi = abi.abi;

  const { contract } = useContract(contractAddress, contractAbi);
  const { mutateAsync: createMemory } = useContractWrite(contract, "createMemory");

  const handleCreateMemory = async (metadataURI: string) => {
    try {
      await createMemory({ args: [metadataURI] });
      alert("Memory Created!") 
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
        <Navbar linkHref={'/'} linkText={'Back to home'}/> 
        <div className='flex flex-col items-start justify-start p-10'>
            <h1 className='text-4xl font-bold'>Create Memory</h1>

            <MintNFTForm 
              contractAddress={contractAddress}
              web3ButtonText={'Create Memory!'}
              web3ButtonFunction={handleCreateMemory}
            />
        </div>
    </div>
    
  )
}

export default Create
