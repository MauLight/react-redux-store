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
    Background: string
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
        auth: {} as authPanelProps,
        authIsLoading: false,
        authHasError: false,
        home: {} as homePanelProps,
        homeIsLoading: false,
        homeHasError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
    }
})

export const { } = uiSlice.actions
const uiReducer = uiSlice.reducer

export default uiReducer