"use client"

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/constant'
import { Button } from '../ui/button'

const SideBar = () => {
  const pathName = usePathname();

  return (
    <aside className='sizebar'>
        <div className='flex size-full flex-col gap-4'>
            <Link href='/' className='sidebar-logo'>
              <Image src="/assets/images/logo-text.svg" alt='logo' width={180} height={28}/>
            </Link>

            <nav className='sidebar-nav'>
                <SignedIn>
                    <ul className='sidebar-nav_elements'>
                        {navLinks.slice(0,6).map((link) => {
                            const isActive = pathName === link.route;

                            return (
                                <li key={link.route} className={`sidebar-nav_element group ${
                                    isActive ? 'bg-purple-gradient text-white': 'text-gray-500'
                                }`}>
                                    <Link href={link.route} className='sidebar-link'>
                                      <Image className={`${isActive && 'brightness-200'}`} src={link.icon} alt='logo' width={24} height={24} />
                                      {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <ul className='sidebar-nav_elements'>
                        {navLinks.slice(6).map((link) => {
                            const isActive = pathName === link.route;

                            return (
                                <li key={link.route} className={`sidebar-nav_element group ${
                                    isActive ? 'bg-purple-gradient text-white': 'text-gray-500'
                                }`}>
                                    <Link href={link.route} className='sidebar-link'>
                                      <Image className={`${isActive && 'brightness-200'}`} src={link.icon} alt='logo' width={24} height={24} />
                                      {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className='flex-center cursor-pointer gap-2 p-4'>
                            <UserButton showName/>
                        </li>
                    </ul>
                </SignedIn>

                <SignedOut>
                    <Button className='button bg-purple-gradient bg-cover'>
                        <SignInButton />
                    </Button>
                </SignedOut>
            </nav>
        </div>
    </aside>
  )
}

export default SideBar