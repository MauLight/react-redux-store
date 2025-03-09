export interface ProductProps {
    id: string
    description: string
    title: string
    brand?: string
    images: Array<{ image: string, image_public_id: string }>
    price: number
    discount?: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
    quantity: number
    tags?: Array<string>
    weight?: number,
    height?: number,
    width?: number,
    length?: number
}
export interface PostProductProps {
    description: string
    title: string
    brand?: string
    images: Array<{ image: string, image_public_id: string }>
    price: number
    discount?: number
    rating?: {
        productId: string
        ratings: Array<number>
        averageRating: number
    }
    quantity: number
    tags?: Array<string>
    weight?: number,
    height?: number,
    width?: number,
    length?: number
}

export interface wishListProduct { id: string, productId: string }
export interface SliderProps { name: string, id: string, speed: number, animation: string, imageList: Array<{ image: string, public_id: string }> }
export interface TemplateProps {
    id: string
    title: string
    preview: string
    hero: {
        layout: string
        image: string
    }
    product: {
        layout: string
        title: string
        button: string
        video: boolean
    }
    card: {
        card: string
        layout: string
        button: string
        preview: string
        image: string
        textLayout: string
        gradient: boolean
    }
}

export interface uiProps {
    global: {
        allowAI: boolean,
        compress: boolean,
        invitees: boolean,
        business: string,
        productType: string
    },
    ui: {
        sorting: Array<string>
    }
    auth: {
        allowGoogle: boolean
        compressImage: boolean
        header: string
        logoUrl: string
        logo_public_id: string
        background: string
        background_public_id: string
    },
    home: {
        topbar: {
            transparent: boolean
            bgColor: string
            logo: string
        }
        hero: {
            header: string
            subHeader: string
            compressImage: boolean
            image: string
            image_public_id: string
        }
    }
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
        searchIsLoading: boolean
        searchHasError: boolean
        errorMessage: string
    }
    collections: {
        collections: CollectionProps[]
        collection: CollectionProps
        nav: string[]
        titles: { title: string, id: string, isLive: boolean }[]
        isLoading: boolean
        hasErrors: boolean
        error: string
    }
    userAuth: {
        user: Record<string, any>
        client: Record<string, any>
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
        currConfig: uiProps
        sliders: Array<SliderProps>
        currSlider: SliderProps
        currSliderId: string
        templates: Array<TemplateProps>
        currentTemplate: TemplateProps
        currentTemplateId: string
        uiIsLoading: boolean
        uiHasError: boolean
        createdAt?: string
        updatedAt?: string
        id?: string
    },
    errors: {
        errors: ErrorsProps[],
        isLoading: boolean
        hasError: boolean
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
    description: string
    title: string
    image: string
    price: number
    discount: number
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
    discount?: number
}

export interface RegionProps {
    ineRegionCode: number,
    regionId: string
    regionName: string
}

export interface DropdownProps {
    id?: string
    value: any
    setValue: any
    list: string[]
    defaultValue?: any
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

export interface DecodedProps {
    email: string
    exp: number
    iat: number
    id: string
    role: 'admin',
    wizard: boolean
}

export interface ErrorsProps {
    clientId: string
    actionType: string
    createdAt: string
    id: string
    message: string
    updatedAt: string
}