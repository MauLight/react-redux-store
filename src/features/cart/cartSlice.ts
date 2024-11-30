import { v4 as uuidv4 } from 'uuid'

interface CartItemProps { id: string, title: string, image: string, price: number, fullPrice: number, quantity: number }

export const addItem = (itemToAdd: { title: string, image: string, price: number, fullPrice: number }) => {
    return {
        type: 'cart/addItem',
        payload: itemToAdd
    }
}

export const changeItemQuantity = (id: string, newQuantity: number) => {
    return {
        type: 'cart/changeItemQuantity',
        payload: {
            id,
            newQuantity
        }
    }
}

const initialCart: CartItemProps[] = []

export const cartReducer = (cart = initialCart, action: any) => {
    switch (action.type) {
        case 'cart/addItem': {
            const { title, image, price, fullPrice } = action.payload


            const newItem = { id: `cart-${uuidv4}`, price, fullPrice, quantity: 1, image, title }

            return [...cart, newItem]
        }
        case 'cart/changeItemQuantity': {
            const { id, newQuantity } = action.payload
            const itemToUpdate = cart.find(elem => elem.id === id)

            const updatedItem = {
                ...itemToUpdate,
                quantity: newQuantity
            }

            const filteredCart = cart.filter(elem => elem.id !== id)

            return [
                ...filteredCart,
                updatedItem
            ]
        }
        default:
            return cart
    }
}