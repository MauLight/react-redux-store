import { createStore, combineReducers } from 'redux'

import { inventoryReducer } from '../features/homeCollection/homeCollectionSlice'

const reducers = {
    inventory: inventoryReducer
}

export const store = createStore(combineReducers(reducers))