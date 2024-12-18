import { ProductProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_PRODUCTS_BACKEND_URL
// const token = JSON.parse(localStorage.getItem('store-user') !== null ? localStorage.getItem('store-user') as string : '')

export const getAllProductsAsync = createAsyncThunk(
    'products/getAllProducts', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/products`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getProductById = createAsyncThunk(
    'products/getProductById', async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/products/${id}`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const deleteProductById = createAsyncThunk(
    'products/deleteProductById', async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${url}/products/${id}`)
            toast.success('Product deleted succesfully.')
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postProductsAsync = createAsyncThunk(
    'products/postProducts', async (products: { products: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/products`, products)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            toast.error((error as AxiosError).message)
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

export const postProductRating = createAsyncThunk(
    'products/postProductRating', async (rating: { productId: string, rating: number }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/products/rate`, rating)
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
        individualProduct: {},
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
            .addCase(
                getAllProductsAsync.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                getAllProductsAsync.fulfilled, (state, action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                    state.products = action.payload.products
                }
            )
            .addCase(
                getAllProductsAsync.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
            .addCase(
                getProductById.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                getProductById.fulfilled, (state, action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                    state.individualProduct = action.payload.product
                }
            )
            .addCase(
                getProductById.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
            .addCase(
                deleteProductById.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                deleteProductById.fulfilled, (state, action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                    state.products = action.payload.products
                }
            )
            .addCase(
                deleteProductById.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
            .addCase(
                postProductRating.pending, (state, _action) => {
                    state.productsAreLoading = true
                    state.productsHasError = false
                }
            )
            .addCase(
                postProductRating.fulfilled, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = false
                }
            )
            .addCase(
                postProductRating.rejected, (state, _action) => {
                    state.productsAreLoading = false
                    state.productsHasError = true
                }
            )
    }
})

const productsReducer = productsSlice.reducer
export default productsReducer