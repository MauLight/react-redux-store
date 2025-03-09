import { type ReactNode } from "react"
import { useDispatch } from "react-redux"
import { addItem } from "@/features/cart/cartSlice"
import { ProductProps } from "@/utils/types"

export const PriceCard = ({ product }: { product: ProductProps }): ReactNode => {
    const dispatch = useDispatch()

    function getPercentage() {
        const percentage = product.discount
        const price = product.price
        const discount = percentage ? (percentage / 100) * price : 0
        return (price - discount)
    }

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.images[0].image,
            price: product.price,
        }
        dispatch(addItem(itemToAdd))
    }

    return (
        <div className="flex justify-end items-center gap-x-10 px-5 py-3 border-t border-sym_gray-600 shadow-sm shadow-sym_gray-800 transition-all duration-300 bg-[#10100e] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 rounded-[20px]">
            <div className="flex flex-col">
                <h1 className='text-[18px] uppercase antialiazed text-[#ffffff] leading-tight'>{product.title}</h1>
                <div className="flex gap-x-2">
                    <p className='text-[12px] uppercase antialiazed text-[#ffffff]'>{`${getPercentage()}$`}</p>
                    {
                        product.discount && (
                            <p className='text-[12px] uppercase antialiazed text-[#ffffff]'>{`${product.price}$`}</p>
                        )
                    }
                </div>
            </div>
            <button onClick={handleAddItemToCart} className='h-[50px] w-[50px] z-50 rounded-full bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center pb-1 cursor-pointer'>
                <i className="fa-solid fa-bag-shopping text-[#ffffff]"></i>
            </button>
        </div>
    )
}