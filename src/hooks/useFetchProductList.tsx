import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { getAllProductsAsync, getProductsByRangeAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { currentPageState } from '@/utils/recoil'

const productsListState = atom<ProductProps[]>({
    key: 'ProductList',
    default: []
})

export const useFetchProducts = (currentPage: number, pageSize: number) => {
    const dispatch: AppDispatch = useDispatch()
    const products = useSelector((state: StoreProps) => state.inventory.products)
    const setProducts = useSetRecoilState(productsListState)

    useEffect(() => {
        const fetchProducts = async () => {
            const { payload } = await dispatch(getAllProductsAsync())
            setProducts(payload.products.slice(0, currentPage * pageSize))
        }

        if (!products.length) fetchProducts()
        else {
            setProducts(products.slice(0, currentPage * pageSize))
        }

    }, [products, dispatch, setProducts, currentPage, pageSize])
}

export const infiniteScrollFetch = () => {
    const dispatch: AppDispatch = useDispatch()
    const currPage = useSelector((state: StoreProps) => state.inventory.rangeProducts.currentPage)
    const totalPages = useSelector((state: StoreProps) => state.inventory.rangeProducts.totalPages)
    const setProducts = useSetRecoilState(productsListState)
    const setCurrentPage = useSetRecoilState(currentPageState)
    const currentPage = useRecoilValue(currentPageState)

    useEffect(() => {
        if (currPage === totalPages && currPage !== 0) {
            return
        }
        const fetchProducts = async () => {
            const { payload } = await dispatch(getProductsByRangeAsync({ page: currentPage, rangeSize: 9 }))
            setProducts((prevProducts) => [...prevProducts, ...payload.products])
        }

        fetchProducts()
    }, [dispatch, setProducts, currentPage])

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
            setCurrentPage((prevPage) => prevPage + 1)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [setCurrentPage])
}