import { useState } from 'react';
import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import { Web3Button, useAddress, useContractWrite, useContract, useNFT } from "@thirdweb-dev/react";

import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import itemsAbi from '../../constants/ERC6551MemoriesItems.json';

const AddItem = () => {
  const router = useRouter(); 
  const { tokenId } = router.query; 

  const itemsContractAddress = '0xC1141d65B3eA5303bFc58453B1dc3A58Fb87af0f';
  const itemsABI = itemsAbi.abi;

  const { contract } = useContract(itemsContractAddress, itemsABI);

  const address = useAddress();

  const { data: nft, isLoading: nftLoading, error: nftError } = useNFT(contract, String(tokenId));

  const { mutateAsync: safeMint } = useContractWrite(contract, "safeMint");

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
      alert('Error with creating metadata');
    } finally {
      setIsMetadataURICreated(true) 
    }
  };

  const handleSafeMint = async () => {
    try {
      await safeMint({ args: [address, inputValue.metadataURI] });
      alert("Minted Item") 
    } catch (error) {
      console.error(error)
    }
  }

  if (!address) return <div>No wallet connected</div>
  if (nftLoading) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'><Loading /></div>;
  if (nftError || !nft) return <div className='flex items-center justify-center h-64 bg-gray-200 rounded-lg'>NFT not found</div>;
  
  return (
    <div>
        <Navbar linkHref={`/memory/${tokenId}`} linkText={'Back to memory info'}/> 
        <div className='flex flex-col items-start justify-start p-10'>
            <h1 className='text-4xl font-bold'>Add Item</h1>

            <div className='flex flex-row items-center justify-center gap-20'>
              <div className='flex flex-col'>
                <form className='mt-16'>
                  <div className='mb-10'>
                    <label className='text-2xl font-semibold'>
                      Upload image
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
                      Item name
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
                      Item Description
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
                   <div className='flex flex-row items-center justify-start gap-5 mt-5'>
                    <Loading />
                    <h1>Creating metadata URI...</h1>
                   </div>

                ) : (
                  <h1 className='text-2xl mt-5'>{inputValue.metadataURI}</h1>
                )}

              </div>
            </div>
            <div className='mt-16'>
              {isMetadataURICreated && (
                <Web3Button
                  theme="light"
                  contractAddress={itemsContractAddress}
                  action={handleSafeMint}
                >
                  Mint Item!
                </Web3Button>
              )}
            </div>
        </div>
    </div>
    
  )
}

export default AddItem
