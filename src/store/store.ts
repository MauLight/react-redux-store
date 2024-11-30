import { createStore, combineReducers } from 'redux'

import { homeCollectionReducer } from '../features/homeCollection/homeCollectionSlice'
import { cartReducer } from '@/features/cart/cartSlice'

const reducers = {
    homeCollection: homeCollectionReducer,
    cart: cartReducer
}

export const store = createStore(combineReducers(reducers))