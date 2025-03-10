import { useEffect, useRef, useState, type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useMotionValue, useScroll as hookScroll, useTransform, AnimatePresence } from 'framer-motion'
import Hamburger from 'hamburger-react'

import useScroll from '@/hooks/useSroll'
import Searchbar from './Searchbar'
import { CartItemProps, StoreProps } from '@/utils/types'
import { getAllCollectionsTitlesAsync } from '@/features/collections/collectionsSlice'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import { Modal } from './Modal'
import { animatedGradientText } from '@/utils/styles'
import useOutsideClick from '@/hooks/useClickOutside'
import SimpleProductCard from './SimpleProductCard'

const parentVariants = {
  rest: {},
  hover: {}
}

const childVariants = {
  rest: { opacity: 0, width: 0 },
  hover: {
    opacity: 1, width: '100%',
    transition: { duration: 0.4, type: 'spring', bounce: 0.2 }
  }
}

function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max)
}

function useBoundedScroll(bounds: number) {
  const { scrollY } = hookScroll()
  const scrollYBounded = useMotionValue(0)
  const scrollYBoundedProgress = useTransform(scrollYBounded, [0, bounds], [0, 1])

  useEffect(() => {
    return scrollY.on('change', (current) => {
      const previous = scrollY.getPrevious()
      const diff = previous ? current - previous : current
      const newScrollYBounded = scrollYBounded.get() + diff
      scrollYBounded.set(clamp(newScrollYBounded, 0, bounds))
    })
  }, [bounds, scrollY, scrollYBounded])

  return { scrollYBounded, scrollYBoundedProgress }
}


const TopBar = ({ announcementBar }: { announcementBar: boolean }): ReactElement => {
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const cart = useSelector((state: StoreProps) => state.cart.cart)
  const collection = useSelector((state: StoreProps) => state.collections.titles)
  const collectionTitles = collection ? collection.filter(collection => collection.isLive) : []
  const readyToPay = useSelector((state: StoreProps) => state.cart.readyToPay)
  const yPosition = useScroll()
  const { pathname } = useLocation()

  const localCart: CartItemProps[] = JSON.parse(localStorage.getItem('marketplace-cart') || '[]')
  const cartItemsLength = Object.keys(cart).length

  //* Topbar height state
  const { scrollYBoundedProgress } = useBoundedScroll(180)

  const height = useTransform(scrollYBoundedProgress, [0, 1], [120, 60])
  const heightCollection = useTransform(useBoundedScroll(100).scrollYBoundedProgress, [0, 1], [30, 0])
  const opacity = useTransform(scrollYBoundedProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYBoundedProgress, [0, 1], [1.1, 0.9])

  const topBarText = pathname.includes('checkout') && !readyToPay ? 'text-sym-800 bg-[#ffffff]' : 'text-[#ffffff] hover:text-indigo-500 transition-color duration-200'
  const topBarHamburgerColor = pathname.includes('checkout') ? '#10100e' : '#ffffff'

  const [hamburgerIsOpen, setHamburgerIsOpen] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const modalRef = useRef(null)

  useOutsideClick(modalRef, () => { setHamburgerIsOpen(false) })

  function handleLogOut() {
    localStorage.removeItem('marketplace-user')
    window.location.reload()
  }

  useEffect(() => {
    async function getCollectionTitles() {
      await dispatch(getAllCollectionsTitlesAsync())
    }

    if (collectionTitles.length === 0) {
      getCollectionTitles()
    }
  }, [])

  return (
    <main className={`${announcementBar ? 'sm:top-12' : 'top-2'} fixed w-full flex justify-center z-50`}>
      <motion.section
        key={0}
        style={{
          height
        }}
        className={`relative h-[50px] w-full max-w-[1440px] rounded-[6px] px-5 sm:py-5`}>

        <div className="h-full w-full flex flex-col justify-center gap-y-2 transition-all duration-400">

          <nav className={`flex h-full w-full justify-between items-center pt-3`}>
            <Link to={'/'} className="block">
              <motion.h1
                style={{ scale }}
                className={`leading-none text-[18px] ${topBarText} antialiased cursor-pointer`}>eMOTIONs</motion.h1>
            </Link>
            <div className="flex items-center gap-x-8">
              <div className='hidden sm:flex'>
                <Searchbar />
              </div>

              {/* Sign, User, Cart */}
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

              {/* Hamburger */}
              <div className="hidden max-sm:flex gap-x-5">
                <button onClick={() => { setOpenModal(!openModal) }} className='sm:hidden flex items-center'>
                  <i className="fa-lg fa-solid fa-magnifying-glass text-sym_gray-100"></i>
                </button>

                <Link className='text-[#fff] text-[1.2rem] flex items-center gap-x-2' aria-label='checkout' to={'/checkout'}>
                  <i className='relative fa-solid fa-cart-shopping cursor-pointer'>
                    {
                      cartItemsLength !== null && cartItemsLength > 0 && (
                        <span className="absolute -top-3 -right-2 w-4 h-4 bg-indigo-500 rounded-full flex justify-center items-center text-[10px] text-[#10100e]">{cartItemsLength}</span>
                      )
                    }
                  </i>
                </Link>

                <Hamburger toggled={hamburgerIsOpen} toggle={() => { setHamburgerIsOpen(true) }} color={topBarHamburgerColor} size={25} direction='left' />
              </div>

            </div>
          </nav>

          <motion.div
            initial={{ scaleX: 0 }}
            style={{ opacity }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2, delay: 0.3 }}
            className={`w-full hidden sm:flex border-b border-gray-300`}></motion.div>
          <AnimatePresence>
            <motion.div
              key={'collection'}
              style={{ opacity, height: heightCollection }}
              className={`w-full hidden sm:flex justify-center gap-x-10 text-[#fff]`}>
              {
                collectionTitles.length > 0 && collectionTitles.map((col, i) => (
                  <motion.div
                    variants={parentVariants}
                    initial="rest"
                    whileHover="hover"
                    className='relative group px-2 z-10'
                    key={`id-${col.id + i}`}>
                    <Link to={'*'}>
                      <p className='z-20 text-[0.9rem]'>{col.title}</p>
                    </Link>
                    <motion.div
                      className='h-full -z-10 absolute top-0 left-0 bg-indigo-500'
                      variants={childVariants}
                    ></motion.div>
                  </motion.div>
                ))
              }
            </motion.div>
          </AnimatePresence>

        </div>

        <motion.div
          key={1}
          transition={{ duration: 0.5 }}
          style={{
            height
          }}
          className={`absolute top-0 left-0 h-[50px] w-full max-w-[1440px] rounded-[6px] ${yPosition > 180 ? 'opacity-100' : 'opacity-0'} -z-10 transition-all duration-500 ease-out`}>
          <motion.div
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, type: 'tween' }}
            className="absolute top-0 left-0 h-full w-full max-w-[1440px] rounded-[6px] glass opacity-100 border border-gray-400">
          </motion.div>
          <motion.div
            key={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, type: 'tween' }}
            className="absolute top-0 left-0 h-full w-full max-w-[1440px] rounded-[6px] bg-[#10100e] -z-10"></motion.div>
        </motion.div>

      </motion.section>

      {/* Mobile menu */}
      <section ref={modalRef} className={`absolute -top-3 ${hamburgerIsOpen ? 'right-0' : '-right-[300px]'} h-screen w-[300px] flex flex-col justify-between pt-10 bg-[#ffffff] z-20 transition-all duration-200 shadow-md`}>
        <div className='flex flex-col gap-y-5'>
          <div className="flex flex-col px-5 gap-y-10">

            <Link onClick={() => { setHamburgerIsOpen(false) }} to={user.email ? '/profile' : '/sign'} className='flex flex-col items-start justify-center gap-y-2'>
              <h1 className={`${animatedGradientText} uppercase`}>Profile</h1>

              <div className='w-full flex flex-col items-center gap-y-2'>
                <div
                  className="w-[50px] h-[50px] flex justify-center items-center border border-gray-200 rounded-full">
                  <i className='fa-sm fa-solid fa-user'></i>
                </div>
                <p className='truncate text-gray-800 font-light antialiased'>{user.email ? `${user.email}` : 'Sign in'}</p>
              </div>

            </Link>

            <div className="w-full border-b border-gray-300"></div>

            <div
              className={`w-full flex flex-col justify-center gap-y-4 text-[#10100e]`}>
              <h1 className={`${animatedGradientText} uppercase`}>Collections</h1>
              <div className='flex flex-col gap-y-2'>
                {
                  collectionTitles.length > 0 && collectionTitles.map((col, i) => (
                    <div
                      className='relative group px-2 z-10'
                      key={`id-${col.id + i}`}>
                      <Link className='flex gap-x-2 items-center' to={'*'}>
                        <i className="fa-solid fa-chevron-right fa-sm text-gray-400"></i>
                        <p className='z-20 text-[0.9rem]'>{col.title}</p>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="w-full border-b border-gray-300"></div>

            <div className="flex flex-col gap-y-4">
              <h1 className={`${animatedGradientText} uppercase`}>Cart</h1>
              <div className='flex flex-col gap-y-2'>
                {
                  cart.length > 0 && cart.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))
                }
                {
                  cart.length === 0 && localCart.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))
                }
              </div>
              <div className='flex justify-center'>
                <Link to={'/checkout'} className='h-8 w-[150px] flex justify-center items-center mt-5 bg-[#10100e] hover:bg-indigo-500 transition-color duration-200 text-[#ffffff]'>Go to Cart</Link>
              </div>
            </div>

          </div>
        </div>
        <div>
          <button className='w-full h-10 font-body text-[1rem] text-[#ffffff] mt-1 uppercase bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200' onClick={handleLogOut}>Log out</button>
        </div>
      </section>

      {/* Search button modal up tp sm breakpoint */}
      <Modal width='w-full' height='h-[500px]' openModal={openModal} handleOpenModal={() => { setOpenModal(!openModal) }}>
        <div>
          <Searchbar closeModal={() => { setOpenModal(!openModal) }} />
        </div>
      </Modal>
    </main>
  )

}

export default TopBar