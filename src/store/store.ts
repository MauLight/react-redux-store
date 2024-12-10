import { configureStore } from '@reduxjs/toolkit'

import homeCollectionReducer from '../features/homeCollection/homeCollectionSlice'
import cartReducer from '@/features/cart/cartSlice'

const store = configureStore({
    reducer: {
        homeCollection: homeCollectionReducer,
        cart: cartReducer
    }
})

export default store