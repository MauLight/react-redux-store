import { useLayoutEffect, type ReactNode } from 'react'
import IndividualProduct from '@/components/dashboard/IndividualProduct'
import ProductsByJSON from '@/components/dashboard/ProductsByJSON'
import { useDispatch, useSelector } from 'react-redux'
import { ProductProps, StoreProps } from '@/utils/types'
import { AppDispatch } from '@/store/store'
import { getAllProductsAsync } from '@/features/products/productsSlice'
import DashboardCard from '@/components/dashboard/DashboardCard'

export default function Dashboard(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const products = useSelector((state: StoreProps) => state.inventory.products)
    useLayoutEffect(() => {
        if (products.length === 0) {
            dispatch(getAllProductsAsync())
        }
    }, [])

    return (
        <section className='w-screen flex flex-col gap-y-10 bg-[#ffffff] pb-20'>
            <div className='flex flex-col py-10'>
                <div className='h-20 w-full grid grid-cols-9 gap-x-5 px-10 border-b bg-[#10100e] text-[#ffffff] content-center overflow-x-scroll'>
                    <p className='text-balance truncate uppercase'>Id</p>
                    <p className='text-balance truncate uppercase'>Title</p>
                    <p className='col-span-2 text-balance truncate uppercase'>Description</p>
                    <p className='text-balance truncate uppercase'>Price</p>
                    <p className='text-balance truncate uppercase'>FullPrice</p>
                    <p className='text-balance truncate uppercase'>Image</p>
                    <p className='text-balance truncate uppercase'>Rating</p>
                    <p className='text-balance truncate uppercase'>Action</p>
                </div>
                {
                    products.length > 0 && products.map((product: ProductProps) => (
                        <DashboardCard key={product.id} product={product} />
                    ))
                }
            </div>
            <div className='grid grid-cols-7 border-y border-sym_gray-400'>
                <IndividualProduct />
                <ProductsByJSON />
            </div>
        </section>
    )
}
