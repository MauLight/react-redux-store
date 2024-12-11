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
    userAuth: {
        user: Record<string, any>
        isLoading: boolean
        hasError: boolean
    }
    cart: Array<ProductProps>
    homeCollection: {
        collection: Array<ProductProps>
    }
    wishList: Array<wishListProduct>
}

export interface NewUserProps {
    firstname: string
    lastname: string
    email: string
    phone: number
    address: string
    password: string
}