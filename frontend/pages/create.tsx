import React from 'react'
import Link from 'next/link'
import { ConnectWallet } from "@thirdweb-dev/react";
import Navbar from '../components/Navbar';


const Create = () => {
  return (
    <div>
        <Navbar linkHref={'/'} linkText={'Back to home'}/> 
    </div>
    // <div className='flex flex-col items-start justify-start p-10'>
        
    //     <h1 className='text-4xl font-bold'>Create Memory</h1>
    // </div>
  )
}

export default Create