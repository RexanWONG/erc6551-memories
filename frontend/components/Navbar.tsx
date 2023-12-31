import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from 'next/link'

interface NavbarProps {
  linkHref: string;
  linkText: string;
}

const Navbar: React.FC<NavbarProps> = ({ linkHref, linkText }) => {
  return (
    <nav className="flex items-center justify-between p-5">
        <Link href={'/'}>
          <span className="text-2xl font-light">erc6551-memories</span>
        </Link>
        <div className="flex items-center space-x-2">
            <Link href={linkHref}>
                <button className="bg-black text-white hover:bg-neutral-600 font-light rounded-lg px-4 py-2">
                    {linkText}
                </button>
            </Link>
            
            <ConnectWallet
                theme="light"
                className="bg-black text-white hover:bg-neutral-600 rounded-lg px-4 py-2"
            />
        </div>
    </nav>
  )
}

export default Navbar
