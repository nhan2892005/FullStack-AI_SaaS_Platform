import SideBar from '@/components/share/SideBar'
import MobileNav from '@/components/share/MobileNav'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react';

const Layout = ({ children }:{ children: React.ReactNode }) => {
  return (
    <main className='root'>
        <SideBar /> 
        <MobileNav />    
        <div className='root-container'>
            <div className='wrapper'>
                {children}
                <Analytics />
            </div>
        </div>

        <Toaster />
    </main>
  )
}

export default Layout