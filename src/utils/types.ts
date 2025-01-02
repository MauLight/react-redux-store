export interface ProductProps {
    id: string
    description: string
    title: string
    image: string
    price: number
    fullPrice: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
    quantity?: number
}

export interface wishListProduct { id: string, productId: string }

export interface StoreProps {
    inventory: {
        products: ProductProps[]
        rangeProducts: {
            products: ProductProps[]
            totalProducts: number
            totalPages: number
            currentPage: number
        }
        individualProduct: ProductProps
        sortedProducts: ProductProps[]
        productsAreLoading: boolean
        productsHasError: boolean
    }
    userAuth: {
        user: Record<string, any>
        userData: Record<string, any>
        isLoading: boolean
        hasError: boolean
    }
    cart: {
        cart: Array<CartItemProps>,
        readyToPay: boolean
        transbank: Record<string, any>
        isLoading: boolean
        hasError: boolean
    }
    homeCollection: {
        collection: Array<ProductProps>
        collectionHasError: boolean
        collectionIsLoading: boolean
    }
    wishList: {
        wishlist: Array<ProductProps>,
        isLoading: boolean,
        hasError: boolean
    }
}

export interface NewUserProps {
    firstname: string
    lastname: string
    email: string
    phone: number
    password: string
}

export interface UserProps {
    id: string
    firstname: string
    lastname: string
    email: string
    phone: number
    address: string
}

export interface UserToBeUpdatedProps {
    firstname: string,
    lastname: string,
    street: string,
    city: string,
    state: string,
    country: string,
    phone: string
}

export interface LoginProps {
    email: string
    password: string
}

export interface CartItemProps {
    id: string
    title: string
    image: string
    price: number
    fullPrice: number
    quantity: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
}

export interface TransactionProps {
    sessionId: string
    amount: number
    returnUrl?: string
}

export interface WishlistItem { userId: string, productId: string }