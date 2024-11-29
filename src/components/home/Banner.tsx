import { ReactNode, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/functions'

interface ProductProps {
  title: string
  price: number
  discount: number
  image: string
}

const PriceCard = ({ product }: { product: ProductProps }) => {
  return (
    <div className="flex justify-end items-center gap-x-10 px-5 py-2 transition-all duration-300 z-10 bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 rounded-[10px]">
      <div className="flex flex-col">
        <h1 className='text-[18px] uppercase neue antialiazed text-[#ffffff] leading-tight'>{product.title}</h1>
        <div className="flex gap-x-2">
          <p className='text-[12px] uppercase neue antialiazed text-[#ffffff]'>{`${product.price}$`}</p>
          <p className='text-[10px] uppercase neue antialiazed text-gray-100 line-through'>{`${product.discount}$`}</p>
        </div>
      </div>
      <button className='h-[50px] w-[50px] rounded-full bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center pb-1 z-30 cursor-pointer'>
        <i className="fa-solid fa-bag-shopping text-[#ffffff]"></i>
      </button>
    </div>
  )
}

const BannerContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="h-[25%]"></div>
      <div className="flex flex-col">
        <motion.h1
          variants={fadeIn('top', 0.2)}
          initial={'hidden'}
          whileInView={'show'}
          className='aktiv text-[240px] leading-none uppercase animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text z-10'>Emotions</motion.h1>
        <div
          className="w-full flex justify-between mt-2 px-5 z-20">
          <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>Captured</p>
          <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>In</p>
          <p className='text-[16px] neue text-[#ffffff] z-10 uppercase'>Time</p>
        </div>
      </div>
      <div className="grow"></div>
      <div className="w-full flex justify-end pb-5 z-10">
        {
          children
        }
      </div>
    </div>
  )
}


export const Banner = (): ReactElement => {
  const product = {
    title: 'Into the unknown',
    price: 1680,
    discount: 1400,
    image: 'https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp'
  }

  return (
    <div className="relative w-full h-full min-h-[900px] flex flex-col items-center overflow-hidden">
      <div className="w-[1440px] h-[900px] flex justify-center items-center bg-[#fdfdfd] overflow-hidden">
        <BannerContent>
          <PriceCard product={product} />
        </BannerContent>
        <img src='https://res.cloudinary.com/maulight/image/upload/v1732922082/e-commerce/kx2betzo07jrpgq9i077.webp' alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-10' />
        <img src={product.image} alt="banner" className='absolute -bottom-32 w-full object-none object-bottom z-0' />
      </div>
    </div>
  )
}