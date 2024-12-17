import { deleteProductById } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types'
import { type ReactNode } from 'react'
import { useDispatch } from 'react-redux'

export default function DashboardCard({ product }: { product: ProductProps }): ReactNode {
    const dispatch: AppDispatch = useDispatch()

    async function handleDeleteProduct() {
        await dispatch(deleteProductById(product.id))
    }

    return (
        <div className='h-20 w-full grid grid-cols-9 gap-x-5 px-10 border-b bg-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate'>{product.id}</p>
            <p className='text-balance truncate uppercase'>{product.title}</p>
            <p className='col-span-2 text-balance font-light truncate line-clamp-2'>{product.description}</p>
            <p className='text-balance truncate'>{product.price}</p>
            <p className='text-balance truncate'>{product.fullPrice}</p>
            <a target='_blank' aria-label='image' href={product.image} className='text-balance font-light truncate'>{product.image}</a>
            <p className='text-balance truncate'>{product.rating?.averageRating}</p>
            <button onClick={handleDeleteProduct} className='h-10 px-5 w-[100px] bg-[#10100e] text-[#ffffff] hover:bg-red-500 transition-color duration-200'>Delete</button>
        </div>
    )
}
