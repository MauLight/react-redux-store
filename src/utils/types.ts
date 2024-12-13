export interface ProductProps {
    description: string
    title: string
    image: string
    price: number
    fullPrice: number
    rating: number
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
        collectionHasError: boolean
        collectionIsLoading: boolean
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

export interface LoginProps {
    email: string
    password: string
}