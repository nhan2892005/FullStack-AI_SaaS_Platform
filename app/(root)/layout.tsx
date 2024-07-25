import SideBar from '@/components/share/SideBar'
import MobileNav from '@/components/share/MobileNav'
import React from 'react'

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
    </main>
  )
}

export default Layout