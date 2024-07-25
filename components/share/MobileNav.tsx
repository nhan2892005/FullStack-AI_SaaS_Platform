"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { usePathname } from 'next/navigation'
import { navLinks } from '@/constant'
import { Button } from '../ui/button'
  

const MobileNav = () => {
  const pathName = usePathname();
  return (

    <header className="header">
        <Link href='/' className="flex item-center gap-2 md:py-2">
            <Image src="/assets/images/logo-text.svg" alt='logo' width={180} height={28}/>
        </Link>

        <nav className="flex gap-2">
            <SignedIn>
                <UserButton />
                <Sheet>
                  <SheetTrigger>
                    <img src='/assets/icons/menu.svg' alt="menu" width={32} height={32} className="cursor-pointer"/>
                  </SheetTrigger>
                    <SheetContent className="sheet-content sm:w-64">
                      <>
                        <Image src='/assets/images/logo-text.svg' alt='logo' width={152} height={23}/>
                        <ul className='header-nav_elements'>
                          {navLinks.map((link) => {
                            const isActive = pathName === link.route;

                            return (
                                <li key={link.route} className={`${
                                    isActive && 'gradient-text'
                                } p-18 flex whitespace-nowrap text-dark-700`}>
                                    <Link href={link.route} className='sidebar-link cursor-pointer'>
                                      <Image src={link.icon} alt='logo' width={24} height={24} />
                                      {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                      </>
                    </SheetContent>
                </Sheet>

            </SignedIn>

            <SignedOut>
              <Button className='button bg-purple-gradient bg-cover'>
                    <SignInButton />
              </Button>
            </SignedOut>
        </nav>
    </header>
  )
}

export default MobileNav