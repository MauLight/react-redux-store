import { createSlice } from "@reduxjs/toolkit"
import { wishListProduct } from "./types"

const initialState: Array<wishListProduct> = []

export const wishListSlice = createSlice({
    name: 'wishList',
    initialState,
    reducers: {
        addProduct: (state, action) => [...state, action.payload],
        removeProduct: (state, action) => state.filter(product => product.id !== action.payload)
    }
})

export const { addProduct, removeProduct } = wishListSlice.actions
const wishListReducer = wishListSlice.reducer

export default wishListReducer