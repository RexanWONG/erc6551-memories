import { useState } from 'react';
import Navbar from '../components/Navbar';
import { NFTStorage } from 'nft.storage'
import Loading from '../components/Loading';

const Create = () => {
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  const [inputValue, setInputValue] = useState({
    name: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [metadataURI, setMetadataURI] = useState('')

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
      setIsLoading(true); 
      
      const metadata = await client.store({
        name: inputValue.name,
        description: "This is a memory!",
        image: selectedImage
      })
      
      setMetadataURI(metadata.url);
    } catch (error) {
      alert('Error with creating metadata', error);
    } finally {
      setIsLoading(false); // Set isLoading back to false after the API call completes
    }
  };

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
                      Upload Image
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="border border-gray-400 p-2 rounded-md w-full outline-none mt-2"
                      name="image"
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

                    <h1 className='text-5xl'>{inputValue.name}</h1>
                </div>
                {isLoading ? (
                   <div className='flex flex-row items-center justify-start gap-5'>
                    <Loading />
                    <h1>Creating metadata URI...</h1>
                   </div>

                ) : (
                  <h1 className='text-2xl'>{metadataURI}</h1>
                )}

              </div>
              

            </div>
        </div>
    </div>
    
  )
}

export default Create
