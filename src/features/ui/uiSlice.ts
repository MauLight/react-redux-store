import { SliderProps } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL
//const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
//const token = user.token

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

export const getAllSlidersAsync = createAsyncThunk(
    'ui/getAllSliders', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/sliders`,
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

export const postNewSliderAsync = createAsyncThunk(
    'ui/postNewSlider', async ({ sliderName }: { sliderName: string }, { rejectWithValue }) => {
        console.log(sliderName, 'This is the slider name in the client.')
        try {
            const { data } = await axios.post(`${url}/administrator/sliders/client`, { name: sliderName },
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
        currUI: {
            auth: {
                allowGoogle: false,
                compressImage: true,
                header: '',
                logoUrl: '',
                background: ''
            },
            home: {
                hero: {
                    header: '',
                    subHeader: '',
                    compressImage: true,
                    image: ''
                },
                slider: {
                    savedSliders: [],
                    currSlider: {}
                }
            }
        },
        sliders: [] as SliderProps[],
        uiIsloading: false,
        uiHasError: false
    },
    reducers: {},
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
                    state.uiIsloading = false
                    state.uiHasError = false
                    state.currUI = action.payload.updatedUI
                    toast.success('UI updated succesfully.')
                }
            )
            .addCase(
                getAllSlidersAsync.pending, (state, _action) => {
                    state.uiIsloading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getAllSlidersAsync.rejected, (state, _action) => {
                    state.uiIsloading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getAllSlidersAsync.fulfilled, (state, action) => {
                    state.uiIsloading = false
                    state.uiHasError = false
                    state.sliders = action.payload.sliders

                }
            )
            .addCase(
                postNewSliderAsync.pending, (state, _action) => {
                    state.uiIsloading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                postNewSliderAsync.rejected, (state, _action) => {
                    state.uiIsloading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                postNewSliderAsync.fulfilled, (state, action) => {
                    state.uiIsloading = false
                    state.uiHasError = false
                    const newSlider: SliderProps = action.payload.newSlider
                    state.sliders = [...state.sliders, newSlider]
                    toast.success('New Slider created succesfully')
                }
            )
    }
})

const uiReducer = uiSlice.reducer

export default uiReducer