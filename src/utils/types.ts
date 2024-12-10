export interface ProductProps {
    id: string
    title: string
    image: string
    price: number
    fullPrice: number
    quantity: number
    rating?: number
}

export interface wishListProduct { id: string, productId: string }

export interface StoreProps {
    cart: Array<ProductProps>
    homeCollection: {
        collection: Array<ProductProps>
    }
    wishList: Array<wishListProduct>
}