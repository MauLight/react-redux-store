import { type ReactNode } from 'react'
import { selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentPageState, productsListState } from '@/utils/recoil'
import { useFetchProductsWithPagination } from '@/hooks/useFetchProductList'

import DashboardCard from './DashboardCard'
import { ProductProps, StoreProps } from '@/utils/types'
import EmptyList from '../common/EmptyList'
import { useSelector } from 'react-redux'

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
    const totalPages = useSelector((state: StoreProps) => state.inventory.rangeProducts.totalPages)

    useFetchProductsWithPagination(currentPage, 9)

    function loadMore(currPage: number) {
        setCurrentPage(currPage)
    }

    return (
        <div className='flex flex-col rounded-[10px] overflow-hidden gap-y-10'>
            <div>
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
            </div>
            <div className="flex justify-center items-center gap-x-2">
                {
                    Array.from({ length: totalPages }).map((_, i) => (
                        <button onClick={() => { loadMore(i + 1) }} key={i} className={`w-[30px] h-[30px] rounded-full border hover:bg-indigo-500 hover:text-[#ffffff] transition-color duration-200 ${currentPage === i + 1 ? 'bg-indigo-500 text-[#ffffff]' : 'bg-[#FFFFFF]'}`}>{i + 1}</button>
                    ))
                }
            </div>
        </div>
    )
}

function Tableheader() {
    return (
        <div className='h-12 w-full grid grid-cols-11 gap-x-5 px-10 border-b bg-sym_gray-400 text-[#ffffff] content-center overflow-x-scroll'>
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
