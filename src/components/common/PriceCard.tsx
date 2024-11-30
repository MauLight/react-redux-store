import { addItem } from "@/features/cart/cartSlice"
import { type ReactNode } from "react"

interface ProductProps {
    title: string
    price: number
    discount: number
    image: string
}

export const PriceCard = ({ product, dispatch }: { product: ProductProps, dispatch: any }): ReactNode => {

    const handleAddItemToCart = () => {
        const itemToAdd = {
            title: product.title,
            image: product.image,
            price: product.discount
        }
        dispatch(addItem(itemToAdd))
    }

    return (
        <div className="flex justify-end items-center gap-x-10 px-5 py-2 transition-all duration-300 bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 rounded-[10px]">
            <div className="flex flex-col">
                <h1 className='text-[18px] uppercase neue antialiazed text-[#ffffff] leading-tight'>{product.title}</h1>
                <div className="flex gap-x-2">
                    <p className='text-[12px] uppercase neue antialiazed text-[#ffffff]'>{`${product.price}$`}</p>
                    <p className='text-[10px] uppercase neue antialiazed text-gray-100 line-through'>{`${product.discount}$`}</p>
                </div>
            </div>
            <button onClick={handleAddItemToCart} className='h-[50px] w-[50px] z-50 rounded-full bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 flex justify-center items-center pb-1 cursor-pointer'>
                <i className="fa-solid fa-bag-shopping text-[#ffffff]"></i>
            </button>
        </div>
    )
}