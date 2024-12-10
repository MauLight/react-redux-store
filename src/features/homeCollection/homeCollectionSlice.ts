import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL
console.log(url)

import { ProductProps } from './types'

export const loadHomeCollectionData = (data: ProductProps[]) => {
    return {
        type: 'inventory/loadData',
        payload: data,
    };
};

export const getHomeCollectionAsync = createAsyncThunk(
    'homeCollection/getHomeCollection', async () => {
        const { data } = await axios.get(`${url}/home`)
        console.log(data, '1. data')
        return data
    }
)

export const homeCollectionSlice = createSlice({
    name: 'home collection',
    initialState: {
        collection: [] as ProductProps[],
        isCollectionLoading: false,
        collectionHasError: false
    },
    reducers: {
        loadData: (_state, action) => {
            return action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getHomeCollectionAsync.pending, (state, _action) => {
                    state.collectionHasError = false
                    state.isCollectionLoading = true
                }
            )
            .addCase(
                getHomeCollectionAsync.fulfilled, (state, action) => {
                    state.collection = action.payload as ProductProps[]
                    state.collectionHasError = false
                    state.isCollectionLoading = false
                }
            )
            .addCase(
                getHomeCollectionAsync.rejected, (state, _action) => {
                    state.collectionHasError = true
                    state.isCollectionLoading = false
                }
            )
    }
})

export const { loadData } = homeCollectionSlice.actions
const homeCollectionReducer = homeCollectionSlice.reducer

export default homeCollectionReducer