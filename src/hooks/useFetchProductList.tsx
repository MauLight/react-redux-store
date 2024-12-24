import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { getAllProductsAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types';
import { currentPageState } from '@/utils/recoil';

const productsListState = atom<ProductProps[]>({
    key: 'ProductList',
    default: []
})

export const useFetchProducts = (currentPage: number, pageSize: number) => {
    const dispatch: AppDispatch = useDispatch()
    const setProducts = useSetRecoilState(productsListState)

    useEffect(() => {
        const fetchProducts = async () => {
            const { payload } = await dispatch(getAllProductsAsync())
            setProducts(payload.products.slice(0, currentPage * pageSize))
        }

        fetchProducts()
    }, [dispatch, setProducts, currentPage, pageSize])
}

export const infiniteScrollFetch = () => {
    const dispatch: AppDispatch = useDispatch()
    const setProducts = useSetRecoilState(productsListState)
    const setCurrentPage = useSetRecoilState(currentPageState)
    const currentPage = useRecoilValue(currentPageState)

    useEffect(() => {
        const fetchProducts = async () => {
            const { payload } = await dispatch(getAllProductsAsync())
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