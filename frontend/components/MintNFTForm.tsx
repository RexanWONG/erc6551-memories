import { useState } from 'react';
import { Web3Button } from "@thirdweb-dev/react";
import { NFTStorage } from 'nft.storage';
import { ChangeEvent } from 'react';

import Loading from './Loading';

interface MintNFTFormProps {
    contractAddress: string;
    web3ButtonText: string;
    web3ButtonFunction: (metadataURI: string, tokenId?: number) => void;
}

const MintNFTForm: React.FC<MintNFTFormProps> = ({ contractAddress, web3ButtonText, web3ButtonFunction }) => {

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: String(NFT_STORAGE_TOKEN) });

  const [inputValue, setInputValue] = useState({
    name: "",
    description: "",
    metadataURI: ""
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isMetadataURICreated, setIsMetadataURICreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));    
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files) {
        setSelectedImage(event.target.files[0]);
    }
}

const createMetadataURI = async () => {
    try {
      setIsLoading(true);
      setIsMetadataURICreated(false);
  
      if (selectedImage) {
        const metadata = await client.store({
          name: inputValue.name,
          description: inputValue.description,
          image: selectedImage
        });
  
        setInputValue((prev) => ({
          ...prev,
          metadataURI: metadata.url
        }));
  
        setIsLoading(false);
      } else {
        throw new Error("No file selected!");
      }
    } catch (error) {
      alert(`Error with creating metadata: ${error}`);
    } finally {
      setIsMetadataURICreated(true);
    }
  };

  return (
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
        <div className='mt-16'>
            {isMetadataURICreated && (
              <Web3Button
                  theme="light"
                  contractAddress={contractAddress}
                  action={() => web3ButtonFunction(inputValue.metadataURI)}
              >
                  {web3ButtonText}
              </Web3Button>
            
            )}
        </div>
    </div>  
  );
}

export default MintNFTForm;
