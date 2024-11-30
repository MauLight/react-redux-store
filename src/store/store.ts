import { createStore, combineReducers } from 'redux'

import { inventoryReducer } from '../features/homeCollection/homeCollectionSlice'
import { cartReducer } from '@/features/cart/cartSlice'

const reducers = {
    inventory: inventoryReducer,
    cart: cartReducer
}

export const store = createStore(combineReducers(reducers))