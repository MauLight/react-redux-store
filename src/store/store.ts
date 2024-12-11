import { configureStore } from '@reduxjs/toolkit'

import homeCollectionReducer from '../features/homeCollection/homeCollectionSlice'
import cartReducer from '@/features/cart/cartSlice'
import wishListReducer from '@/features/wishList/wishListSlice'
import { useDispatch } from 'react-redux'
import userAuthReducer from '@/features/userAuth/userAuthSlice'

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        homeCollection: homeCollectionReducer,
        cart: cartReducer,
        wishList: wishListReducer
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store