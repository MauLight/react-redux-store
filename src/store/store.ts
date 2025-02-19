import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import homeCollectionReducer from '../features/homeCollection/homeCollectionSlice'
import cartReducer from '@/features/cart/cartSlice'
import wishListReducer from '@/features/wishList/wishListSlice'
import userAuthReducer from '@/features/userAuth/userAuthSlice'
import productsReducer from '@/features/products/productsSlice'
import collectionsReducer from '@/features/collections/collectionsSlice'
import courierReducer from '@/features/courier/courierSlice'
import errorReportingMiddleware from './middleware'
import uiReducer from '@/features/ui/uiSlice'
import errorsReducer from '@/features/errors/errorsSlice'

const store = configureStore({
    reducer: {
        ui: uiReducer,
        userAuth: userAuthReducer,
        homeCollection: homeCollectionReducer,
        cart: cartReducer,
        wishList: wishListReducer,
        inventory: productsReducer,
        collections: collectionsReducer,
        courier: courierReducer,
        errors: errorsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorReportingMiddleware),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store