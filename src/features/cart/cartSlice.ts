export const addItem = (itemToAdd: { title: string, image: string, price: number }) => {
    return {
        type: 'cart/addItem',
        payload: itemToAdd
    }
}

export const changeItemQuantity = (name: string, newQuantity: number) => {
    return {
        type: 'cart/changeItemQuantity',
        payload: {
            name,
            newQuantity
        }
    }
}

const initialCart: Record<string, { title: string, price: number, quantity: number }> = {}

export const cartReducer = (cart = initialCart, action: any) => {
    switch (action.type) {
        case 'cart/addItem': {
            const { title, image, price } = action.payload
            const quantity = cart[title] ? cart[title].quantity + 1 : 1

            const newItem = { price, quantity, image }

            return {
                ...cart,
                [title]: newItem
            }
        }
        case 'cart/changeItemQuantity': {
            const { title, newQuantity } = action.payload
            const itemToUpdate = cart[title]

            const updatedItem = {
                ...itemToUpdate,
                quantity: newQuantity
            }

            return {
                ...cart,
                updatedItem
            }
        }
        default:
            return cart
    }
}