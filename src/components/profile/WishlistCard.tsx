import { type ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types'
import { deleteFromWishlistAsync } from '@/features/wishList/wishListSlice'
import { addItem } from '@/features/cart/cartSlice'

interface CheckoutCardProps {
    product: ProductProps
    userId: string
}

const WishlistCard = ({ product, userId }: CheckoutCardProps): ReactElement => {
    const dispatch: AppDispatch = useDispatch()

    async function handleRemoveItemFromWishlist() {
        await dispatch(deleteFromWishlistAsync({ userId, productId: product.id as string }))
    }

    function handleAddItemToCart() {
        dispatch(addItem(product))
    }

    function getPercentage() {
        const percentage = product.discount
        const price = product.price
        const discount = percentage ? (percentage / 100) * price : 0
        return (price - discount)
    }

    return (
        <section className="grid grid-cols-5 border-b border-[#10100e] pb-3 sm:h-[220px]">
            <div className="col-span-1 border w-[200px] h-[200px] overflow-hidden">
                <img src={product.image} alt="mock1" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-4 h-full flex flex-col justify-start items-between px-5">
                <div className="w-full flex justify-between">
                    <div className="flex flex-col">
                        <h1 className='text-[0.9rem] min-[400px]:text-[1rem] sm:text-[2rem] text-[#10100e] uppercase'>{product.title}</h1>
                        <div className="flex">
                            <p className='text-[0.9rem] min-[400px]:text-xl font-semiBold text-[#10100e] uppercase'>{`${getPercentage()}$`}</p>
                            {
                                product.discount !== undefined && product.discount > 0 && (
                                    <p className='text-[0.8rem] min-[400px]:text-md text-[#10100e] uppercase line-through'>{`${product.price}$`}</p>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex flex-col max-[400px]:items-end gap-y-2">
                        <button onClick={handleAddItemToCart} className="h-10 flex items-center gap-x-1 cursor-pointer text-[18px] px-2 leading-none text-[#ffffff] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            <i className='relative fa-solid fa-cart-shopping cursor-pointer' />
                            <p className='hidden min-[500px]:flex text-[18px] pb-0 leading-none'>Add to Cart</p>
                        </button>
                        <button onClick={handleRemoveItemFromWishlist} className="h-10 flex items-center gap-x-1 py-1 cursor-pointer text-[#10100e] hover:text-red-600 transition-color duration-200">
                            <i className="fa-solid fa-trash-can pb-[3.5px]"></i>
                            <p className='hidden min-[500px]:flex text-[18px] pb-0 leading-none'>Remove</p>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WishlistCard