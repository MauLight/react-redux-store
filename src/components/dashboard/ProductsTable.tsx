import { type ReactNode } from 'react'
import { selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentPageState, productsListState } from '@/utils/recoil'
import { useFetchProducts } from '@/hooks/useFetchProductList'

import DashboardCard from './DashboardCard'
import { ProductProps } from '@/utils/types'

const pageSize = 10

const paginatedProductsSelector = selector({
    key: 'paginatedProductsSelector',
    get: async ({ get }) => {
        const products = get(productsListState)
        const currentPage = get(currentPageState)
        return products.slice(0, currentPage * pageSize)
    }
})

function ProductsTable(): ReactNode {
    const products = useRecoilValue(paginatedProductsSelector)
    const setCurrentPage = useSetRecoilState(currentPageState)
    const currentPage = useRecoilValue(currentPageState)

    useFetchProducts(currentPage, pageSize)

    function loadMore() {
        setCurrentPage((prev) => prev + 1)
    }

    return (
        <div className='flex flex-col'>
            <Tableheader />
            {
                products.length > 0 ? products.map((product: ProductProps) => (
                    <DashboardCard key={product.id} product={product} />
                ))
                    :
                    (
                        <p>No items to display.</p>
                    )
            }
            <button onClick={loadMore} className="w-full h-10 px-5 border-b bg-[#ffffff] text-[#10100e] hover:bg-[#10100e] hover:text-[#ffffff] transition-color duration-200">
                Load More
            </button>
        </div>
    )
}

function Tableheader() {
    return (
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
    )
}

export default ProductsTable
