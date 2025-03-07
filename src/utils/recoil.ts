import { atom, selector } from "recoil"
import { ProductProps } from "./types"

export const productsListState = atom<ProductProps[]>({
    key: 'ProductList',
    default: []
})

export const currentPageState = atom<number>({
    key: 'currentPageState',
    default: 1
})

export const paginatedProductsSelector = selector({
    key: 'paginatedProductsSelector',
    get: async ({ get }) => {
        const products = get(productsListState)
        const currentPage = get(currentPageState)
        return products.slice(0, currentPage * pageSize)
    }
})