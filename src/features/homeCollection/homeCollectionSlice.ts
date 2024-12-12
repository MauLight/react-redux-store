import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

const url = import.meta.env.VITE_BACKEND_URL

import { ProductProps } from './types'

export const getHomeCollectionAsync = createAsyncThunk(
    'homeCollection/getHomeCollection', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/home`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const homeCollectionSlice = createSlice({
    name: 'home collection',
    initialState: {
        collection: [] as ProductProps[],
        isCollectionLoading: false,
        collectionHasError: false
    },
    reducers: {},
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

const homeCollectionReducer = homeCollectionSlice.reducer

export default homeCollectionReducer