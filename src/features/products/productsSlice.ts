import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"

const url = import.meta.env.VITE_BACKEND_URL

export const postProductsAsync = createAsyncThunk(
    'products/postProducts', async (products: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/admin/products`, products)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productsAreLoading: false,
        productsHasError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                postProductsAsync.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                postProductsAsync.fulfilled, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                }
            )
            .addCase(
                postProductsAsync.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
    }
})

const productsReducer = productsSlice.reducer
export default productsReducer