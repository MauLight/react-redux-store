import axios, { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CartItemProps, TransactionProps } from '@/utils/types'

const url = import.meta.env.VITE_TRANSBANK_BACKEND_URL
const returnUrl = 'http://localhost:3000/confirmation'
const user = localStorage.getItem('store-user') ? JSON.parse(localStorage.getItem('store-user') as string) : {}
const token = user.token

const initialCart: CartItemProps[] = []

export const createTransbankTransactionAsync = createAsyncThunk(
    'cart/createTransbankTransaction', async (paymentInformation: TransactionProps, { rejectWithValue }) => {
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

export const getConfirmationFromTransbankAsync = createAsyncThunk(
    'cart/getConfirmationFromTransbank', async (confirmationData: { token: string, buyOrder: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/transbank/confirm`, confirmationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log(data, 'the data')
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
        transbank: {} as Record<string, any>,
        isLoading: false,
        hasError: false
    },
    reducers: {
        addItem: (state, action) => {
            const { id, title, image, price, fullPrice } = action.payload
            const newItem = { id, price, fullPrice, quantity: 1, image, title }
            state.cart.push(newItem)
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
        resetCart: (state) => {
            state.cart = initialCart
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
                    state.hasError = true
                    state.transbank = action.payload as Record<string, any>
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

export const { addItem, removeItem, changeItemQuantity, resetCart } = cartSlice.actions
const cartReducer = cartSlice.reducer

export default cartReducer