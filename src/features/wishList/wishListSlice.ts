import { WishlistItem } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_USERS_BACKEND_URL
const user = localStorage.getItem('store-user') ? JSON.parse(localStorage.getItem('store-user') as string) : {}
const token = user.token

export const postToWishlistAsync = createAsyncThunk(
    'wishlist/postToWishlist', async (wishlistItem: { userId: string, productId: string }, { rejectWithValue }) => {
        if (!user.token) {
            const invitedWishlist = JSON.parse(localStorage.getItem('marketplace-invitedWishlist') || '[]')
            if (invitedWishlist.length > 0) {
                const wasWishlisted = invitedWishlist.find((elem: string) => elem === wishlistItem.productId)
                if (!wasWishlisted) {
                    const updatedInvitedWishlist = [...invitedWishlist, wishlistItem.productId]
                    localStorage.setItem('marketplace-invitedWishlist', JSON.stringify(updatedInvitedWishlist))
                } else {
                    toast.error('Item was already wishlisted.')
                }
            } else {
                const updatedInvitedWishlist = [wishlistItem.productId]
                localStorage.setItem('marketplace-invitedWishlist', JSON.stringify(updatedInvitedWishlist))
            }
            toast.success('Item added to wishlist.')
            return
        }

        try {
            const { data } = await axios.post(`${url}/wishlist`, wishlistItem, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            toast.success('Item added to wishlist.')
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postListToWishlistAsync = createAsyncThunk(
    'wishlist/postListToWishlist', async (newWishlist: { userId: string, productId: string }[], { rejectWithValue }) => {
        const user = localStorage.getItem('store-user') ? JSON.parse(localStorage.getItem('store-user') as string) : {}
        const token = user.token

        if (newWishlist.length === 0) {
            return
        }

        console.log('newWishlist', user.id)

        try {
            const { data } = await axios.post(`${url}/wishlist/list`, { id: user.id, newWishlist }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
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
            const { data } = await axios.post(`${url}/wishlist/delete`, wishlistItem, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

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
        wishlist: [] as WishlistItem[],
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
                    if (action.payload) {
                        state.wishlist = action.payload.wishlist
                        toast.success('Item added to wishlist.')
                    }
                    state.isLoading = false
                    state.hasError = false
                }
            )
            .addCase(
                postListToWishlistAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                postListToWishlistAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                postListToWishlistAsync.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.wishlist = action.payload.updatedWishlist
                        localStorage.removeItem('marketplace-invitedWishlist')
                    }
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