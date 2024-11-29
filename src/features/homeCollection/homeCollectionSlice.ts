interface HomeCollectionProps {
    name: string
    price: number
    img: string
}

export const loadHomeCollectionData = (data: HomeCollectionProps[]) => {
    return {
        type: 'inventory/loadData',
        payload: data,
    };
};

const initialInventory = [
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
    { title: 'Hello World Hat', price: 23.99, discount: 0, image: 'https://static-assets.codecademy.com/Courses/Learn-Redux/codecademy-store/hello-world-hat.jpg' },
]

export const inventoryReducer = (inventory = initialInventory, action: { type: string, payload?: any }) => {
    switch (action.type) {
        case 'inventory/loadData': {
            return action.payload
        }
        default:
            return inventory
    }
}