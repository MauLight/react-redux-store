import useScroll from '@/hooks/useSroll'
import { StoreProps } from '@/utils/types'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Hamburger from 'hamburger-react'
import { useState, type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Searchbar from './Searchbar'

const TopBar = ({ announcementBar }: { announcementBar: boolean }): ReactElement => {
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const cart = useSelector((state: StoreProps) => state.cart.cart)
  const readyToPay = useSelector((state: StoreProps) => state.cart.readyToPay)
  const yPosition = useScroll()
  const { pathname } = useLocation()
  const cartItemsLength = Object.keys(cart).length

  const topBarText = pathname.includes('checkout') && !readyToPay ? 'text-sym-800 bg-[#ffffff]' : 'text-[#10100e] text-[1.1rem] hover:text-indigo-500 transition-color duration-200'
  const topBarHamburgerColor = pathname.includes('checkout') ? '#10100e' : '#ffffff'

  const [hamburgerIsOpen, setHamburgerIsOpen] = useState<boolean>(false)

  function handleLogOut() {
    localStorage.removeItem('marketplace-user')
    window.location.reload()
  }

  return (
    <main className={`${announcementBar ? 'top-8' : 'top-2'} fixed w-full bg-[#ffffff] border-b flex justify-center z-50`}>
      <section className={`h-[70px] w-full min-[1440px]:w-web px-3 rounded-[10px] ${yPosition > 50 ? '' : ''} transition-all duration-200`}>
        <nav className="flex h-full w-full justify-between items-center">
          <Link to={'/'} className="block">
            <h1 className={`leading-none text-[18px] ${topBarText} antialiased cursor-pointer`}>eMOTIONs</h1>
          </Link>
          <div className="flex items-center gap-x-8">
            <Searchbar />
            <div className="hidden sm:flex items-center gap-x-8 shrink-0">
              <Link to={user.email ? '/profile' : '/login'} className={`${topBarText} flex items-center gap-x-2 overflow-hidden`}>
                <i className='fa-solid fa-user'></i>
                <p className='w-[120px] truncate'>{user.email ? `${user.email}` : 'Sign in'}</p>
              </Link>
              <Link className={`${topBarText} flex items-center gap-x-2`} aria-label='checkout' to={'/checkout'}>
                <i className='relative fa-solid fa-cart-shopping cursor-pointer'>
                  {
                    cartItemsLength !== null && cartItemsLength > 0 && (
                      <span className="absolute -top-4 -right-2 w-4 h-4 bg-indigo-500 rounded-full flex justify-center items-center text-[10px] text-[#ffffff]">{cartItemsLength}</span>
                    )
                  }
                </i>
                <p>Your cart</p>
              </Link>
            </div>
            <Hamburger toggled={hamburgerIsOpen} toggle={() => { setHamburgerIsOpen(true) }} color={topBarHamburgerColor} size={25} direction='left' />
          </div>
        </nav>
      </section>

      <section className={`absolute -top-2 ${hamburgerIsOpen ? 'right-0' : '-right-[300px]'} h-screen w-[300px] flex flex-col justify-between bg-[#ffffff] z-20 transition-all duration-200 shadow-md`}>
        <div className='flex flex-col gap-y-5'>
          <XMarkIcon onClick={() => { setHamburgerIsOpen(false) }} className='w-6 ml-auto mr-5 mt-5 text-[#2E3D49] font-accent hover:rotate-90 hover:text-[#EA0C1D] transition-all duration-200' />
          <div className="flex flex-col px-5 gap-y-2">
            <Link onClick={() => { setHamburgerIsOpen(false) }} to={user.email ? '/profile' : '/sign'} className='text-[#10100e] hover:text-indigo-500 text-[1.5rem] transition-color duration-200 flex items-center gap-x-2'>
              <i className='fa-solid fa-user'></i>
              <p>{user.email ? `${user.email}` : 'Sign in'}</p>
            </Link>
            <Link onClick={() => { setHamburgerIsOpen(false) }} className='text-[#10100e] hover:text-indigo-500 text-[1.5rem] transition-color duration-200 flex items-center gap-x-2' aria-label='checkout' to={'/checkout'}>
              <i className='relative fa-solid fa-cart-shopping cursor-pointer'>
                {
                  cartItemsLength !== null && cartItemsLength > 0 && (
                    <span className="absolute -top-4 -right-2 w-4 h-4 bg-indigo-500 rounded-full flex justify-center items-center text-[10px] text-[#10100e]">{cartItemsLength}</span>
                  )
                }
              </i>
              <p>Your cart</p>
            </Link>
          </div>
        </div>
        <div>
          <button className='w-full h-10 font-body text-[1rem] text-[#ffffff] mt-1 uppercase bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200' onClick={handleLogOut}>Log out</button>
        </div>
      </section>

    </main>
  )

}

export default TopBar