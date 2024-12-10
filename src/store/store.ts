import { configureStore } from '@reduxjs/toolkit'

import homeCollectionReducer from '../features/homeCollection/homeCollectionSlice'
import cartReducer from '@/features/cart/cartSlice'
import wishListReducer from '@/features/wishList/wishListSlice'

const store = configureStore({
    reducer: {
        homeCollection: homeCollectionReducer,
        cart: cartReducer,
        wishList: wishListReducer
    }
})

export default store