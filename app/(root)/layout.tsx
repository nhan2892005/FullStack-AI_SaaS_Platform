import SideBar from '@/components/share/SideBar'
import MobileNav from '@/components/share/MobileNav'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'

const Layout = ({ children }:{ children: React.ReactNode }) => {
  return (
    <main className='root'>
        <SideBar /> 
        <MobileNav />    
        <div className='root-container'>
            <div className='wrapper'>
                {children}
            </div>
        </div>

        <Toaster />
    </main>
  )
}

export default Layout