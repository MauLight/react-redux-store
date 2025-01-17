import { type ReactNode } from 'react'
import { selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentPageState, productsListState } from '@/utils/recoil'
import { useFetchProducts } from '@/hooks/useFetchProductList'

import DashboardCard from './DashboardCard'
import { ProductProps } from '@/utils/types'
import EmptyList from '../common/EmptyList'

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
        <div className='flex flex-col rounded-[10px] overflow-hidden'>
            <Tableheader />
            {
                products.length > 0 ? products.map((product: ProductProps) => (
                    <DashboardCard key={product.id} product={product} />
                ))
                    :
                    (
                        <EmptyList legend='There are no items to display.' />
                    )
            }
            <button disabled={!products.length} onClick={loadMore} className={`w-full h-10 px-5 border-b ${!products.length ? 'bg-sym_gray-200 text-sym_gray-500 cursor-not-allowed' : 'bg-[#ffffff] text-[#10100e] hover:bg-[#10100e] hover:text-[#ffffff]'} transition-color duration-200`}>
                Load More
            </button>
        </div>
    )
}

function Tableheader() {
    return (
        <div className='h-20 w-full grid grid-cols-11 gap-x-5 px-10 border-b bg-sym_gray-400 text-[#ffffff] content-center overflow-x-scroll'>
            <p className='text-balance truncate uppercase'>Id</p>
            <p className='col-span-2 text-balance truncate uppercase'>Title</p>
            <p className='text-balance truncate uppercase'>Brand</p>
            <p className='col-span-2 text-balance truncate uppercase'>Description</p>
            <p className='text-balance truncate uppercase'>Price</p>
            <p className='text-balance truncate uppercase'>Discount</p>
            <p className='text-balance truncate uppercase'>Image</p>
            <p className='text-balance truncate uppercase'>Rating</p>
            <p className='text-balance truncate uppercase'>Actions</p>
        </div>
    )
}

export default ProductsTable
