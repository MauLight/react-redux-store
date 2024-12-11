import useScroll from '@/hooks/useSroll'
import { StoreProps } from '@/utils/types'
import Hamburger from 'hamburger-react'
import { type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

export const TopBar = (): ReactElement => {
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const cart = useSelector((state: StoreProps) => state.cart)
  const yPosition = useScroll()
  const { pathname } = useLocation()
  const cartItemsLength = Object.keys(cart).length
  const topBarText = pathname.includes('checkout') ? 'text-sym-800' : 'text-[#ffffff] hover:text-indigo-500 transition-color duration-200'
  const topBarHamburgerColor = pathname.includes('checkout') ? '#10100e' : '#ffffff'

  console.log(user)

  return (
    <div className="fixed top-2 w-full flex justify-center z-50">
      <div className={`h-[50px] w-web px-3 rounded-[10px] ${yPosition > 50 ? 'bg-[#10100e] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70' : 'bg-transparent'} transition-all duration-200`}>
        <nav className="flex h-full w-full justify-between items-center">
          <div className="block">
            <h1 className={`neue-bold leading-none text-[18px] ${topBarText} antialiased cursor-pointer`}>eMOTIONs</h1>
          </div>
          <div className="flex items-center gap-x-8">
            <div className="flex items-center gap-x-5">
              <Link to={'/sign'} className={`${topBarText} flex items-center gap-x-2 overflow-hidden`}>
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
            <Hamburger color={topBarHamburgerColor} size={25} direction='left' />
          </div>
        </nav>
      </div>
    </div>
  )
}
