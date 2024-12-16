export interface ProductProps {
    id?: string
    description: string
    title: string
    image?: string
    price: number
    fullPrice: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
}

export interface wishListProduct { id: string, productId: string }

export interface StoreProps {
    inventory: {
        products: ProductProps[]
        individualProduct: ProductProps
        productsAreLoading: boolean
        productsHasError: boolean
    }
    userAuth: {
        user: Record<string, any>
        userData: Record<string, any>
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