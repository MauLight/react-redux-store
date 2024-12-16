import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_USERS_BACKEND_URL

export const postToWishlistAsync = createAsyncThunk(
    'wishlist/postToWishlist', async (wishlistItem: { userId: string, productId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/auth/wishlist`, wishlistItem)
            toast.success('Item added to wishlist.')
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const deleteFromWishlistAsync = createAsyncThunk(
    'wishlist/deleteFromWishlist', async (wishlistItem: { userId: string, productId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/auth/wishlist/delete`, wishlistItem)
            toast.success('Item deleted from wishlist.')
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const wishListSlice = createSlice({
    name: 'wishList',
    initialState: {
        wishlist: [],
        isLoading: false,
        hasError: false
    },
    reducers: {
        postWishlistFromUser: (state, action) => {
            state.wishlist = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                postToWishlistAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                postToWishlistAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                postToWishlistAsync.fulfilled, (state, action) => {
                    state.wishlist = action.payload.wishlist
                    state.isLoading = false
                    state.hasError = false
                }
            )
            .addCase(
                deleteFromWishlistAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                deleteFromWishlistAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                deleteFromWishlistAsync.fulfilled, (state, action) => {
                    state.wishlist = action.payload.wishlist
                    state.isLoading = false
                    state.hasError = false
                }
            )
    }
})

export const { postWishlistFromUser } = wishListSlice.actions
const wishListReducer = wishListSlice.reducer

export default wishListReducer