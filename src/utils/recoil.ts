import { atom } from "recoil"
import { ProductProps } from "./types"

export const productsListState = atom<ProductProps[]>({
    key: 'ProductList',
    default: []
})

export const currentPageState = atom<number>({
    key: 'currentPageState',
    default: 1
})