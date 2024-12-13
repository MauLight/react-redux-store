import { ProductProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"

const url = import.meta.env.VITE_PRODUCTS_BACKEND_URL

export const postProductsAsync = createAsyncThunk(
    'products/postProducts', async (products: { products: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/products`, products)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)
export const postIndividualProductAsync = createAsyncThunk(
    'products/postIndividualProduct', async (product: ProductProps, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/products/one`, product)
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
        products: [] as ProductProps[],
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
                postProductsAsync.fulfilled, (state, action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                    state.products = [...state.products, ...action.payload.products]
                }
            )
            .addCase(
                postProductsAsync.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
            .addCase(
                postIndividualProductAsync.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                postIndividualProductAsync.fulfilled, (state, action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                    state.products = [...state.products, action.payload.product]
                }
            )
            .addCase(
                postIndividualProductAsync.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
    }
})

const productsReducer = productsSlice.reducer
export default productsReducer