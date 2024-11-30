import Hamburger from 'hamburger-react'
import { type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface TopBarProps {
  cart: Record<string, { price: number, quantity: number, image: string }>
}

export const TopBar = ({ cart }: TopBarProps): ReactElement => {

  const { pathname } = useLocation()
  const cartItemsLength = Object.keys(cart).length
  const topBarText = pathname.includes('checkout') ? 'text-sym-800' : 'text-[#ffffff]'
  const topBarHamburgerColor = pathname.includes('checkout') ? '#10100e' : '#ffffff'

  return (
    <div className="w-full flex justify-center">
      <div className="absolute top-0 h-[50px] w-web bg-transparent z-20">
        <div className="flex h-full w-full justify-between items-center">
          <div className="block">
            <h1 className={`neue-bold leading-none text-[18px] ${topBarText} antialiased`}>eMOTIONs</h1>
          </div>
          <div className="flex items-center gap-x-2">
            <Link to={'/checkout'}>
              <i className={`relative fa-solid fa-lg ${topBarText} fa-cart-shopping cursor-pointer`}>
                {
                  cartItemsLength !== null && cartItemsLength > 0 && (
                    <span className="absolute -top-4 -right-2 w-4 h-4 bg-indigo-500 rounded-full flex justify-center items-center text-[10px] text-[#ffffff]">{cartItemsLength}</span>
                  )
                }
              </i>
            </Link>
            <Hamburger color={topBarHamburgerColor} size={25} direction='left' />
          </div>
        </div>
      </div>
    </div>
  )
}
