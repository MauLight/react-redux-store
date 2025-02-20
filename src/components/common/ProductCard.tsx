import { useState, type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { postToWishlistAsync } from '@/features/wishList/wishListSlice'
import { addItem } from '@/features/cart/cartSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'

export const ProductCard = ({ product, imageList }: { product: ProductProps, imageList?: any }): ReactElement => {
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: StoreProps) => state.userAuth.user)
  const { currentTemplate } = useSelector((state: StoreProps) => state.ui)

  const { pathname } = useLocation()
  const isCollection = !pathname.includes('product')

  const [wishListed, setWishListed] = useState<boolean>(false)

  const handleAddItemToCart = () => {

    dispatch(addItem(product))
  }

  const handleWishList = async (id: string) => {
    const { payload } = await dispatch(postToWishlistAsync({ userId: user.id, productId: id }))
    if (payload && payload.message) {
      setWishListed(true)
    }
  }

  function getPercentage() {
    const percentage = product.discount
    const price = product.price
    const discount = percentage ? (percentage / 100) * price : 0
    return (price - discount)
  }

  return (
    <section className={`group relative ${pathname === '/collection' ? 'h-[460px]' : currentTemplate.card ? currentTemplate.card.card : 'h-[700px] col-span-1 overflow-hidden'}`}>

      <div className={currentTemplate.card ? currentTemplate.card.image : 'h-[550px]'}>
        <img key={product.id} src={imageList ? imageList[0].image : product.images ? product.images[0].image : 0} alt="product" className="w-full h-full object-cover" />
      </div>

      {
        isCollection && (
          <div className={currentTemplate.card ? currentTemplate.card.textLayout : "w-full absolute bottom-5 flex justify-between px-5 z-10 transition-all duration-300 text-[1rem] min-[400px]:text-[22px] uppercase antialiazed text-[#ffffff] leading-tight"}>
            <Link to={`/product/${product.id}`} className="flex flex-col">
              <h1 aria-label={product.title} className=''>{product.title}</h1>
              <div className="flex gap-x-2">
                <p className='text-[16px] uppercase antialiazed'>{`${getPercentage()}$`}</p>
                {
                  product.discount !== undefined && product.discount > 0 && (
                    <p className='text-[12px] uppercase antialiazed text-gray-100 line-through'>{`${product.price}$`}</p>
                  )
                }
              </div>
            </Link>
            <div className="flex items-center gap-x-5">
              <button aria-label='wishlist' onClick={() => { handleWishList(product.id as string) }}>
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
              <button aria-label='add to cart' onClick={handleAddItemToCart} className='h-[50px] w-[50px] antialiased rounded-full bg-gray-900 border-t border-sym_gray-300 shadow-sm shadow-sym_gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center cursor-pointer text-[#ffffff] hover:text-indigo-500'>
                <i className="fa-solid fa-sm fa-cart-plus"></i>
              </button>
            </div>
          </div>
        )
      }
      {
        currentTemplate.card && currentTemplate.card.gradient && (
          <div className='w-full h-full absolute top-0 left-0 bg-gradient-to-t from-[#10100e] to-transparent opacity-30'></div>
        )
      }
      <Link to={`/product/${product.id}`} className="absolute top-0 left-0 w-full sm:h-full bg-[#10100e] opacity-0 group-hover:opacity-30 z-0 transition-all duration-200" />
    </section>
  )
}
