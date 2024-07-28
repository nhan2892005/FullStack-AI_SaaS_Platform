import { Collection } from '@/components/share/Collection'
import { navLinks } from '@/constant'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { getAllImages } from '@/lib/actions/image.action'

const Home = async ({ searchParams }:SearchParamProps) => {
  const page = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.query as string) || ""

  const images = await getAllImages({ page, searchQuery})

  return (
    <>
      <section className='home'>
        <h1 className='home-heading'>Make better with PNhanAI</h1>
        <ul className='flex-center w-full gap-20'>
          {navLinks.slice(1, 5).map((link) => (
            <Link key={link.route} href={link.route} className='flex-center gap-2 flex-col'>
              <li className='flex-center bg-white w-fit rounded-full p-4'>
                <Image src={link.icon} alt={link.label + " image"} width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  )
}

export default Home