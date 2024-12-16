import { createSlice } from '@reduxjs/toolkit'
import { CartItemProps } from '@/utils/types'

const initialCart: CartItemProps[] = []

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCart,
    reducers: {
        addItem: (state, action) => {
            const { id, title, image, price, fullPrice } = action.payload
            const newItem = { id, price, fullPrice, quantity: 1, image, title }
            state.push(newItem)
        },
        removeItem: (state, action) => {
            return state.filter(elem => elem.id !== action.payload)
        },
        changeItemQuantity: (state, action) => {
            const { id, newQuantity } = action.payload
            const itemToUpdate = state.find(product => product.id === id)
            if (itemToUpdate) {
                const updatedItem = {
                    ...itemToUpdate,
                    quantity: newQuantity
                }

                return state.map((product) => product.id === id ? updatedItem : product)
            }
            return state
        },
        resetCart: () => {
            return initialCart
        }
    }
})

export const { addItem, removeItem, changeItemQuantity, resetCart } = cartSlice.actions
const cartReducer = cartSlice.reducer

export default cartReducer