import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_USERS_BACKEND_URL
//const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
//const token = user.token

interface authPanelProps {
    allowGoogle: boolean
    compressImages: boolean
    logoUrl: string
    background: string
}

interface homePanelProps {
    hero: {
        header: string
        subHeader: string
        image: string
    },
    slider: {
        savedSliders: Array<string> //Slider list names
        sliderSpeed: number
        currentSlider: Array<string> //Current slider contains ordered list of images
    },
    collection: {
        collections: Array<string> // Collection list names
        defaultSorting: number
    },
    products: {
        itemsPerRow: number
        defaultSorting: number //This applies to home page
    }
}

export const postListToWishlistAsync = createAsyncThunk(
    'wishlist/postListToWishlist', async (newWishlist: string[], { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token

        if (newWishlist.length === 0) {
            return
        }

        try {
            const { data } = await axios.post(`${url}/wishlist/list`, { id: user.id, newWishlist }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        auth: {
            allowGoogle: false,
            compressImages: false,
            logoUrl: '',
            background: ''
        },
        authIsLoading: false,
        authHasError: false,
        home: {} as homePanelProps,
        homeIsLoading: false,
        homeHasError: false
    },
    reducers: {
        updateAuthAllowGoogle: (state, action) => {
            state.auth.allowGoogle = action.payload
        },
        updateAuthCompressImages: (state, action) => {
            state.auth.compressImages = action.payload
        },
        updateAuthLogoUrl: (state, action) => {
            state.auth.logoUrl = action.payload
        },
        updateAuthBackground: (state, action) => {
            state.auth.background = action.payload
        },
        updateHeroHeroHeader: (state, action) => {
            state.home.hero.header = action.payload
        },
        updateHeroSubheader: (state, action) => {
            state.home.hero.subHeader = action.payload
        },
        updateHeroImage: (state, action) => {
            state.home.hero.image = action.payload
        },
        updateSliderSavedSliders: (state, action) => {
            state.home.slider.savedSliders = action.payload
        },
        updateSliderSliderSpeed: (state, action) => {
            state.home.slider.sliderSpeed = action.payload
        },
        updateSliderCurrentSlider: (state, action) => {
            state.home.slider.currentSlider = action.payload
        },
        updateCollectionCollections: (state, action) => {
            state.home.collection.collections = action.payload
        },
        updateCollectionsDefaultSorting: (state, action) => {
            state.home.collection.defaultSorting = action.payload
        },
        updateProductsItemsPerRow: (state, action) => {
            state.home.products.itemsPerRow = action.payload
        },
        updateProdcutsDefaultSorting: (state, action) => {
            state.home.products.defaultSorting = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
    }
})

export const {
    updateAuthAllowGoogle,
    updateAuthCompressImages,
    updateAuthLogoUrl,
    updateAuthBackground,
    updateHeroHeroHeader,
    updateHeroSubheader,
    updateHeroImage,
    updateSliderSavedSliders,
    updateSliderSliderSpeed,
    updateSliderCurrentSlider,
    updateCollectionCollections,
    updateCollectionsDefaultSorting,
    updateProductsItemsPerRow,
    updateProdcutsDefaultSorting
} = uiSlice.actions
const uiReducer = uiSlice.reducer

export default uiReducer