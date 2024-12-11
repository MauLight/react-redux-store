import { useState, type ReactElement } from 'react'
import { ProductProps } from '@/features/homeCollection/types'
import { addItem } from '@/features/cart/cartSlice'
import { addWishProduct } from '@/features/wishList/wishListSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

interface ProductCardProps {
  product: ProductProps
}

export const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  const [wishListed, setWishListed] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleAddItemToCart = () => {
    const itemToAdd = {
      title: product.title,
      image: product.image,
      price: product.price,
      fullPrice: product.fullPrice
    }

    dispatch(addItem(itemToAdd))
    toast.success('Item added to cart.')
  }

  const handleWishList = (id: string) => {
    dispatch(addWishProduct(id))
    setWishListed(!wishListed)
  }

  return (
    <div className="group relative h-[700px] col-span-1 flex justify-center overflow-hidden">
      <img src={product.image} alt="mock1" className="w-full h-full object-cover" />


      <div className="w-full absolute bottom-5 flex justify-between px-5 z-10 transition-all duration-300">
        <div className="flex flex-col">
          <h1 className='text-[22px] uppercase neue antialiazed text-[#ffffff] leading-tight'>{product.title}</h1>
          <div className="flex gap-x-2">
            <p className='text-[16px] uppercase neue antialiazed text-[#ffffff]'>{`${product.price}$`}</p>
            <p className='text-[12px] uppercase neue antialiazed text-gray-100 line-through'>{`${product.fullPrice}$`}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-5">
          <button onClick={() => { handleWishList(product.id) }}>
            {
              wishListed ? (
                <i className="fa-solid fa-heart text-indigo-500"></i>
              )
                :
                (
                  <i className="fa-solid fa-heart text-[#ffffff]"></i>
                )
            }
          </button>
          <button onClick={handleAddItemToCart} className='h-[50px] w-[50px] antialiased rounded-full bg-gray-900 border-t border-sym_gray-300 shadow-sm shadow-sym_gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center pb-1 cursor-pointer text-[#ffffff] hover:text-indigo-500'>
            <i className="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>
      <div className="absolute w-full h-full bg-[#10100e] opacity-0 group-hover:opacity-30 z-0 transition-all duration-200"></div>
    </div>
  )
}
