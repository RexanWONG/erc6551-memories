import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useAddress, useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
import { ethers } from 'ethers';

import Navbar from '../../components/Navbar';
import abi from '../../constants/ERC6551Memories.json';  

const Donate = () => {
  const router = useRouter(); 
  const { tokenId } = router.query; 

  const contractAddress = '0x4Db40DC251EF1Ffd0BeA25CC7Df1D21Efd55Ce31';

  const address = useAddress();
  const { contract } = useContract(contractAddress, abi.abi);
  const { mutateAsync: donateToMemory } = useContractWrite(contract, "donateToMemory");

  const [inputValue, setInputValue] = useState({
    donationAmount: 0
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));    
  };
  
  const handleDonateToMemory = async () => {
    try {
      const donationAmountInWei = ethers.utils.parseEther((inputValue.donationAmount).toString());
      await donateToMemory(
        { 
            args: [tokenId], 
            overrides: {
                value: donationAmountInWei
            } 
        }
      );
      alert("Minted Item!")
      router.push(`/memory/${tokenId}`);

    } catch (error) {  
      alert(error) 
    }
  }

  if (!address) return <div>No wallet connected</div>

  return (
    <div>
        <Navbar linkHref={`/memory/${tokenId}`} linkText={'Back to memory info'} />
        <div className='flex flex-col items-start justify-start p-10'>
            <h1 className='text-4xl font-bold'>Donate to Memory</h1>

            <form className='mt-10'>   
                <div className='mb-10'>
                    <label className='text-2xl font-semibold'>
                        Donation amount (in ETH)
                    </label>
                    <input  
                        type="number"
                        onChange={handleInputChange}
                        className="border border-gray-400 p-2 rounded-md w-full outline-none mt-2"
                        name="donationAmount"
                        required
                    />    
                </div>
            </form>

            <Web3Button
                    theme="light"
                    contractAddress={contractAddress}
                    action={handleDonateToMemory}
                  >
                    Donate {inputValue.donationAmount} ETH!  
            </Web3Button>
        </div>
    </div>
  )
}

export default Donate