import { uiProps } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL
//const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
//const token = user.token

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

export const getUIConfigurationAsync = createAsyncThunk(
    'ui/getUIConfiguration', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/ui`,
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // }
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postNewUIConfigurationAsync = createAsyncThunk(
    'ui/postNewUIConfiguration', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/administrator/ui`,
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // }
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateUIConfigurationAsync = createAsyncThunk(
    'ui/updateUIConfiguration', async ({ id, newConfiguration }: { id: string, newConfiguration: Record<string, any> }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/administrator/ui/${id}`, newConfiguration,
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // }
            )
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
        ui: {
            auth: {
                allowGoogle: false,
                compressImages: false,
                header: '',
                logoUrl: '',
                background: ''
            },
            home: {
                hero: {
                    header: '',
                    subHeader: '',
                    image: ''
                }

            } as homePanelProps
        },
        authIsLoading: false,
        authHasError: false,
        homeIsLoading: false,
        homeHasError: false,
        currUI: {} as uiProps,
        uiIsloading: false,
        uiHasError: false
    },
    reducers: {
        updateAuthAllowGoogle: (state, action) => {
            state.ui.auth.allowGoogle = action.payload
        },
        updateAuthCompressImages: (state, action) => {
            state.ui.auth.compressImages = action.payload
        },
        updateAuthLogoUrl: (state, action) => {
            state.ui.auth.logoUrl = action.payload
        },
        updateAuthHeader: (state, action) => {
            state.ui.auth.header = action.payload
        },
        updateAuthBackground: (state, action) => {
            state.ui.auth.background = action.payload
        },
        updateHeroHeroHeader: (state, action) => {
            state.ui.home.hero.header = action.payload
        },
        updateHeroSubheader: (state, action) => {
            state.ui.home.hero.subHeader = action.payload
        },
        updateHeroImage: (state, action) => {
            state.ui.home.hero.image = action.payload
        },
        updateSliderSavedSliders: (state, action) => {
            state.ui.home.slider.savedSliders = action.payload
        },
        updateSliderSliderSpeed: (state, action) => {
            state.ui.home.slider.sliderSpeed = action.payload
        },
        updateSliderCurrentSlider: (state, action) => {
            state.ui.home.slider.currentSlider = action.payload
        },
        updateCollectionCollections: (state, action) => {
            state.ui.home.collection.collections = action.payload
        },
        updateCollectionsDefaultSorting: (state, action) => {
            state.ui.home.collection.defaultSorting = action.payload
        },
        updateProductsItemsPerRow: (state, action) => {
            state.ui.home.products.itemsPerRow = action.payload
        },
        updateProdcutsDefaultSorting: (state, action) => {
            state.ui.home.products.defaultSorting = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsloading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsloading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getUIConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsloading = false
                    state.uiHasError = false
                    state.currUI = action.payload.ui
                }
            )
            .addCase(
                postNewUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsloading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                postNewUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsloading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                postNewUIConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsloading = false
                    state.uiHasError = false
                    state.currUI = action.payload.ui
                }
            )
            .addCase(
                updateUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsloading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                updateUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsloading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                updateUIConfigurationAsync.fulfilled, (state, action) => {
                    console.log(action.payload.updatedUI, 'this is the update')
                    state.uiIsloading = false
                    state.uiHasError = false
                    state.currUI = action.payload.updatedUI
                }
            )
    }
})

export const {
    updateAuthAllowGoogle,
    updateAuthCompressImages,
    updateAuthHeader,
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