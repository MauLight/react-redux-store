import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { atom, useSetRecoilState } from 'recoil';
import { getAllProductsAsync } from '@/features/products/productsSlice';
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types';

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