import { configureStore } from '@reduxjs/toolkit'

import homeCollectionReducer from '../features/homeCollection/homeCollectionSlice'
import cartReducer from '@/features/cart/cartSlice'
import wishListReducer from '@/features/wishList/wishListSlice'
import { useDispatch } from 'react-redux'

const store = configureStore({
    reducer: {
        homeCollection: homeCollectionReducer,
        cart: cartReducer,
        wishList: wishListReducer
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store