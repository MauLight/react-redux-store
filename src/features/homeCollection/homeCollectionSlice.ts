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
    {
        title: 'Into the unknown',
        price: 1680,
        discount: 1400,
        image: 'https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp'
    }
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