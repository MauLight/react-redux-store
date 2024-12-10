import { createSlice } from "@reduxjs/toolkit"
import { wishListProduct } from "./types"
import { v4 as uuidv4 } from 'uuid'

const initialState: Array<wishListProduct> = []

export const wishListSlice = createSlice({
    name: 'wishList',
    initialState,
    reducers: {
        addWishProduct: (state, action) => {
            console.log('here!')
            const newListedItem = { id: uuidv4(), productId: action.payload }
            console.log(newListedItem)
            return [...state, newListedItem]
        },
        removeWishProduct: (state, action) => state.filter(product => product.id !== action.payload)
    }
})

export const { addWishProduct, removeWishProduct } = wishListSlice.actions
const wishListReducer = wishListSlice.reducer

export default wishListReducer