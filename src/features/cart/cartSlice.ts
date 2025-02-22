import axios, { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CartItemProps, TransactionProps } from '@/utils/types'
import { toast } from 'react-toastify'

const url = import.meta.env.VITE_BACKEND_URL
const returnUrl = 'http://localhost:3000/confirmation'
const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
const token = user.token

const initialCart: CartItemProps[] = []

export const createTransbankTransactionAsync = createAsyncThunk(
    'cart/createTransbankTransaction', async (paymentInformation: TransactionProps, { rejectWithValue }) => {
        console.log(token, 'this is the token')
        try {
            const { data } = await axios.post(`${url}/transbank`, { ...paymentInformation, returnUrl }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateOrderAddressAsync = createAsyncThunk(
    'cart/updateOrderAddress', async (addressData: { address: Record<string, any>, buyOrder: string, additional: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/transbank/address`, addressData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getConfirmationFromTransbankAsync = createAsyncThunk(
    'cart/getConfirmationFromTransbank', async (confirmationData: { token: string, buyOrder: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/transbank/confirm`, { ...confirmationData, userId: user.id }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: initialCart,
        readyToPay: false,
        transbank: {} as Record<string, any>,
        isLoading: false,
        hasError: false,
        total: 0,
        totalWithCourier: 0,
        courierFee: {}
    },
    reducers: {
        postTotal: (state, action) => {
            state.total = action.payload
        },
        postCourierTotal: (state, action) => {
            state.totalWithCourier = action.payload
        },
        postCourierFee: (state, action) => {
            state.courierFee = action.payload
        },
        addItem: (state, action) => {
            const { id, title, images, price, discount, description = '' } = action.payload

            const wasAdded = state.cart.find((product) => product.id === id)
            if (wasAdded) return

            const newItem = { id, price, description, discount, quantity: 1, image: images[0].image, title }
            state.cart.push(newItem)
            toast.success('Item added to cart.')
        },
        removeItem: (state, action) => {
            state.cart = state.cart.filter(elem => elem.id !== action.payload)
        },
        changeItemQuantity: (state, action) => {
            const { id, newQuantity } = action.payload
            const itemToUpdate = state.cart.find(product => product.id === id)
            if (itemToUpdate) {
                const updatedItem = {
                    ...itemToUpdate,
                    quantity: newQuantity
                }

                state.cart = state.cart.map((product) => product.id === id ? updatedItem : product)
            }
            return state
        },
        fillCart: (state, action) => {
            state.cart = action.payload
        },
        resetCart: (state) => {
            state.cart = initialCart
        },
        setReadyToPay: (state) => {
            state.readyToPay = true
        },
        setNotReadyToPay: (state) => {
            state.readyToPay = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                createTransbankTransactionAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                createTransbankTransactionAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                createTransbankTransactionAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasError = false
                    state.transbank = action.payload as Record<string, any>
                }
            )
            .addCase(
                updateOrderAddressAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                updateOrderAddressAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                updateOrderAddressAsync.fulfilled, (state, _action) => {
                    state.isLoading = false
                    state.hasError = false
                }
            )
            .addCase(
                getConfirmationFromTransbankAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                getConfirmationFromTransbankAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                getConfirmationFromTransbankAsync.fulfilled, (state, action) => {
                    if (action.payload.status === 'AUTHORIZED') {
                        state.isLoading = false
                        state.hasError = false
                    } else {
                        state.isLoading = false
                        state.hasError = true
                    }
                }
            )
    }
})

export const { fillCart, postTotal, postCourierTotal, postCourierFee, addItem, removeItem, changeItemQuantity, resetCart, setReadyToPay, setNotReadyToPay } = cartSlice.actions
const cartReducer = cartSlice.reducer

export default cartReducer