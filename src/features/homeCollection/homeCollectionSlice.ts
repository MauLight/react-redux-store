import { v4 as uuidv4 } from 'uuid'
import { createSlice } from '@reduxjs/toolkit'

import { ProductProps } from './types'

export const loadHomeCollectionData = (data: ProductProps[]) => {
    return {
        type: 'inventory/loadData',
        payload: data,
    };
};

const initialInventory = [
    {
        id: `col-${uuidv4()}`,
        title: 'Into the unknown',
        price: 1400,
        fullPrice: 1680,
        image: 'https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp'
    },
    {
        id: `col-${uuidv4()}`,
        title: 'Radiant Skyline',
        price: 1400,
        fullPrice: 1680,
        image: 'https://res.cloudinary.com/maulight/image/upload/v1732918603/e-commerce/home_3.webp'
    },
    {
        id: `col-${uuidv4()}`,
        title: 'Face of the deep',
        price: 1400,
        fullPrice: 1680,
        image: 'https://res.cloudinary.com/maulight/image/upload/v1732918602/e-commerce/home_1.webp'
    },
    {
        id: `col-${uuidv4()}`,
        title: 'A vintage sunset',
        price: 1180,
        fullPrice: 1416,
        image: 'https://res.cloudinary.com/maulight/image/upload/v1732918603/e-commerce/home_2.webp'
    },
]

export const homeCollectionSlice = createSlice({
    name: 'home collection',
    initialState: initialInventory,
    reducers: {
        loadData: (_state, action) => {
            return action.payload
        }
    }
})

export const { loadData } = homeCollectionSlice.actions
const homeCollectionReducer = homeCollectionSlice.reducer

export default homeCollectionReducer