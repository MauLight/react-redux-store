import { addItem } from "@/features/cart/cartSlice"
import { type ReactNode } from "react"
import { useDispatch } from "react-redux"

interface ProductProps {
    title: string
    price: number
    fullPrice: number
    image: string
}

export const PriceCard = ({ product }: { product: ProductProps }): ReactNode => {
    const dispatch = useDispatch()

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.image,
            price: product.price,
            fullPrice: product.fullPrice
        }
        dispatch(addItem(itemToAdd))
    }

    return (
        <div className="flex justify-end items-center gap-x-10 px-5 py-3 border-t border-sym_gray-600 shadow-sm shadow-sym_gray-800 transition-all duration-300 bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 rounded-[20px]">
            <div className="flex flex-col">
                <h1 className='text-[18px] uppercase antialiazed text-[#ffffff] leading-tight'>{product.title}</h1>
                <div className="flex gap-x-2">
                    <p className='text-[12px] uppercase antialiazed text-[#ffffff]'>{`${product.price}$`}</p>
                    <p className='text-[10px] uppercase antialiazed text-gray-100 line-through'>{`${product.fullPrice}$`}</p>
                </div>
            </div>
            <button onClick={handleAddItemToCart} className='h-[50px] w-[50px] z-50 rounded-full bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center pb-1 cursor-pointer'>
                <i className="fa-solid fa-bag-shopping text-[#ffffff]"></i>
            </button>
        </div>
    )
}