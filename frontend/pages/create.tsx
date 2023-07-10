import { useState } from 'react';
import { NFTStorage } from 'nft.storage';
import { Web3Button, useContractWrite, useContract } from "@thirdweb-dev/react";
import { useRouter } from 'next/navigation';

import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import abi from '../constants/ERC6551Memories.json';

const Create = () => {
  const router = useRouter(); 

  const contractAddress = '0x5042f2e43dCbD88bD530Bd07438c05e93C50666f';
  const contractAbi = abi.abi;
  const { contract } = useContract(contractAddress, contractAbi);
  const { mutateAsync: createMemory } = useContractWrite(contract, "createMemory");

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const [inputValue, setInputValue] = useState({
    name: "",
    description: "",
    metadataURI: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isMetadataURICreated, setIsMetadataURICreated] = useState(false);

  const [isLoading, setIsLoading] = useState(false)


  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));    
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  }
  

  const createMetadataURI = async () => {
    try {
      setIsLoading(true)
      setIsMetadataURICreated(false)
      
      const metadata = await client.store({
        name: inputValue.name,
        description: inputValue.description,
        image: selectedImage
      })
      
      inputValue.metadataURI = metadata.url
      setIsLoading(false)
    } catch (error) {
      alert('Error with creating metadata', error);
    } finally {
      setIsMetadataURICreated(true) 
    }
  };

  const handleCreateMemory = async () => {
    try {
      await createMemory({ args: [inputValue.metadataURI] });
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

            <div className='flex flex-row items-center justify-center gap-20'>
              <div className='flex flex-col'>
                <form className='mt-16'>
                  <div className='mb-10'>
                    <label className='text-2xl font-semibold'>
                      Upload thumbnail image
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="border border-gray-400 p-2 rounded-md w-full outline-none mt-2"
                      name="image"
                      required
                    />
                  </div>

                  <div className='mb-10'>
                    <label className='text-2xl font-semibold'>
                      Memory name
                    </label>
                    <input
                      type="text"
                      onChange={handleInputChange}
                      className="border border-gray-400 p-2 rounded-md w-full outline-none mt-2"
                      placeholder="amazing memory"
                      name="name"
                      value={inputValue.name}
                      required
                    />
                  </div>

                  <div className='mb-10'>
                    <label className='text-2xl font-semibold'>
                      Memory Description
                    </label>
                    <input
                      type="text"
                      onChange={handleInputChange}
                      className="border border-gray-400 p-2 rounded-md w-full outline-none mt-2"
                      placeholder="This is a memory!"
                      name="description"
                      value={inputValue.description}
                      required
                    />
                  </div>

                </form>

                <div>
                  <button onClick={createMetadataURI} className="bg-black text-white hover:bg-neutral-600 font-light rounded-lg px-4 py-2 mt-5">
                      Create metadata URI
                  </button>
                </div>
              </div>
              
              <div className='flex flex-col'>
                <div className='flex flex-row items-center justify-center gap-10'>
                    {selectedImage && (
                        <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="preview" 
                        className="h-64 w-64 object-contain mt-4" />
                    )}

                    <div className='flex flex-col'>
                      <h1 className='text-5xl'>{inputValue.name}</h1>
                      <p className='mt-5'>{inputValue.description}</p>
                    </div>
                </div>
                
                {isLoading ? (
                   <div className='flex flex-row items-center justify-start gap-5'>
                    <Loading />
                    <h1>Creating metadata URI...</h1>
                   </div>

                ) : (
                  <h1 className='text-2xl'>{inputValue.metadataURI}</h1>
                )}

              </div>
            </div>
            <div className='mt-16'>
              {isMetadataURICreated && (
                <Web3Button
                  theme="light"
                  contractAddress={contractAddress}
                  action={handleCreateMemory}
                >
                  Create memory!
                </Web3Button>
              )}
            </div>
        </div>
    </div>
    
  )
}

export default Create
