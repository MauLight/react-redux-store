export interface ProductProps {
    id?: string
    description: string
    title: string
    brand?: string
    image?: string
    price: number
    discount?: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
    quantity?: number
    tags?: Array<string>
    weight?: number,
    height?: number,
    width?: number,
    length?: number
}

export interface wishListProduct { id: string, productId: string }
export interface SliderProps { title: string, id: string, speed: number, animation: string, images: Array<string> }

export interface uiProps {
    auth: {
        allowGoogle: boolean
        compressImage: boolean
        header: string
        logoUrl: string
        background: string
    },
    home: {
        hero: {
            header: string
            subHeader: string
            compressImage: boolean
            image: string
        },
        slider: {
            savedSliders: Array<SliderProps>
            currSlider: SliderProps
        }
    }
    createdAt: string
    updatedAt: string
    id: string
}
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
        errorMessage: string
    }
    collections: {
        collections: CollectionProps[]
        collection: CollectionProps
        nav: string[]
        titles: string[]
        isLoading: boolean
        hasErrors: boolean
    }
    userAuth: {
        user: Record<string, any>
        userData: UserProps
        isLoading: boolean
        hasError: boolean
        getUserIsLoading: boolean,
        getUserHasError: boolean,
        errorMessage: string
    }
    cart: {
        cart: Array<CartItemProps>,
        readyToPay: boolean
        transbank: Record<string, any>
        isLoading: boolean
        hasError: boolean
        total: number
        totalWithCourier: number
        courierFee: Record<string, any>
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
    courier: {
        counties: any[],
        regions: any[],
        quote: QuotesProps[]
        isLoading: boolean,
        hasError: boolean
    },
    ui: {
        currUI: uiProps
        uiIsLoading: boolean
        uiHasError: boolean
    }
}

export interface NewUserProps {
    firstname: string
    lastname: string
    email: string
    phone?: number
    password: string
}

export interface UserProps {
    id: string
    firstname: string
    lastname: string
    email: string
    phone: string
    street: string
    street_number: string
    house_number: string
    city: string
    state: string
    country: string
    zipcode: string
    wishlist: Array<ProductProps>
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
    isBuilder?: boolean
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

export interface CollectionProps {
    id: string
    title: string,
    discount: number,
    products: Array<ProductProps>
}

export interface OnSubmitFormValues {
    title: string
    brand?: string
    description: string
    image?: string
    price: number
    discount: number
}

export interface RegionProps {
    ineRegionCode: number,
    regionId: string
    regionName: string
}

export interface DropdownProps {
    id?: string
    value: string
    setValue: any
    list: string[]
    defaultValue?: string
    loading?: boolean
    error?: boolean
}

export interface QuotesProps {
    additionalServices: any[]
    conditions: string
    deliveryType: number
    didUseVolumetricWeight: boolean
    finalWeight: string
    serviceDescription: string
    serviceTypeCode: number
    serviceValue: string
}

export interface BillingAddressProps {
    country: string
    state: string
    city: string
    street: string
    street_number: string
    house_number?: string
    zipcode: string
}