import useScroll from '@/hooks/useSroll'
import { StoreProps } from '@/utils/types'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Hamburger from 'hamburger-react'
import { useState, type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

const TopBar = (): ReactElement => {
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const cart = useSelector((state: StoreProps) => state.cart.cart)
  const yPosition = useScroll()
  const { pathname } = useLocation()
  const cartItemsLength = Object.keys(cart).length
  const topBarText = pathname.includes('checkout') ? 'text-sym-800' : 'text-[#ffffff] hover:text-indigo-500 transition-color duration-200'
  const topBarHamburgerColor = pathname.includes('checkout') ? '#10100e' : '#ffffff'

  const [hamburgerIsOpen, setHamburgerIsOpen] = useState<boolean>(false)

  return (
    <section className="fixed top-2 w-full flex justify-center z-50">
      <div className={`h-[50px] w-full min-[1440px]:w-web px-3 rounded-[10px] ${yPosition > 50 ? 'bg-[#10100e] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70' : 'bg-transparent'} transition-all duration-200`}>
        <nav className="flex h-full w-full justify-between items-center">
          <Link to={'/'} className="block">
            <h1 className={`leading-none text-[18px] ${topBarText} antialiased cursor-pointer`}>eMOTIONs</h1>
          </Link>
          <div className="flex items-center gap-x-8">
            <div className="hidden sm:flex items-center gap-x-8">
              <Link to={user ? '/profile' : '/sign'} className={`${topBarText} flex items-center gap-x-2 overflow-hidden`}>
                <i className='fa-solid fa-user'></i>
                <p>{user ? `${user.email}` : 'Sign in'}</p>
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
      </div>

      <div className={`absolute top-0 ${hamburgerIsOpen ? 'right-0' : '-right-[300px]'} h-screen w-[300px] bg-[#ffffff] z-20 transition-all duration-200 shadow-md`}>
        <XMarkIcon onClick={() => { setHamburgerIsOpen(false) }} className='w-6 ml-auto mr-5 mt-5 text-[#2E3D49] font-accent hover:rotate-90 hover:text-[#EA0C1D] transition-all duration-200' />
        <div className="h-full flex flex-col py-10 px-5 gap-y-2">
          <Link onClick={() => { setHamburgerIsOpen(false) }} to={user ? '/profile' : '/sign'} className={`text-[#10100e] hover:text-indigo-500 text-[2rem] transition-color duration-200 flex items-center gap-x-2`}>
            <i className='fa-solid fa-user'></i>
            <p className='truncate'>{user ? `${user.email}` : 'Sign in'}</p>
          </Link>
          <Link onClick={() => { setHamburgerIsOpen(false) }} className={`text-[#10100e] hover:text-indigo-500 text-[2rem] transition-color duration-200 flex items-center gap-x-2`} aria-label='checkout' to={'/checkout'}>
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

    </section>
  )

}

export default TopBar
