import { getAllProductsAsync } from '@/features/products/productsSlice'
import { useFetchProductsWithPagination } from '@/hooks/useFetchProductList'
import { AppDispatch } from '@/store/store'
import { currentPageState, productsListState } from '@/utils/recoil'
import { useLayoutEffect, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { selector, useRecoilValue, useSetRecoilState } from 'recoil'
import DashboardCard from '../DashboardCard'
import { ProductProps, StoreProps } from '@/utils/types'
import { useSelector } from 'react-redux'

const pageSize = 5

const paginatedProductsSelector = selector({
    key: 'paginatedProductsSelector',
    get: async ({ get }) => {
        const products = get(productsListState)
        const currentPage = get(currentPageState)
        return products.slice(0, currentPage * pageSize)
    }
})

export default function AddProductsToCollection({ addProducts, removeProducts }: { addProducts: (productId: string) => Promise<void>, removeProducts: (productId: string) => Promise<void> }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const products = useRecoilValue(paginatedProductsSelector)
    const setCurrentPage = useSetRecoilState(currentPageState)
    const currentPage = useRecoilValue(currentPageState)
    const totalPages = useSelector((state: StoreProps) => state.inventory.rangeProducts.totalPages)

    useFetchProductsWithPagination(currentPage, 5)

    async function getProducts() {
        const { payload } = await dispatch(getAllProductsAsync())
        return payload
    }

    function loadMore(currPage: number) {
        setCurrentPage(currPage)
    }

    useLayoutEffect(() => {
        if (products.length === 0) {
            getProducts()
        }
    }, [])

    return (
        <div className='flex flex-col gap-y-10 px-5'>
            <h1>Choose products to add to collection:</h1>
            <div className="w-full flex flex-col overflow-y-scroll">
                {
                    products.length > 0 && products.map((product: ProductProps) => (
                        <DashboardCard
                            isCollection
                            key={product.id}
                            product={product}
                            addProducts={addProducts}
                            removeProducts={removeProducts}
                        />
                    ))
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
