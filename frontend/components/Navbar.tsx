"use client"

import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-5">
        <div>
          <span className="text-2xl font-light">erc6551-memories</span>
        </div>
        <div>
          <ConnectWallet
            theme="light"
            className="bg-black text-white hover:bg-neutral-600 font-bold rounded"
          />
        </div>
      </nav>
  )
}

export default Navbar