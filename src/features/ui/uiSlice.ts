import { SliderProps, TemplateProps } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL
//const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
//const token = user.token

export const classicTemplate = {
    title: 'classic',
    preview: '',
    card: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-10 px-10 bg-[#ffffff]',
        card: 'col-span-1 overflow-hidden rounded-[20px] flex flex-col',
        image: 'h-[480px] z-10',
        textLayout: 'w-full h-[120px] py-10 flex justify-between px-10 z-20 transition-all duration-300 text-[1rem] min-[400px]:text-[1.5rem] bg-[#ffffff] antialiazed text-[#10100e] leading-tight',
        gradient: false
    }
}

export const modernTemplate = {
    title: 'modern',
    preview: '',
    card: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3',
        card: 'h-full col-span-1 overflow-hidden',
        image: '',
        textLayout: 'w-full absolute bottom-5 flex justify-between px-5 z-10 transition-all duration-300 text-[1rem] min-[400px]:text-[22px] uppercase antialiazed text-[#ffffff] leading-tight',
        gradient: true
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
            console.log(data)
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

export const getSliderByIdAsync = createAsyncThunk(
    'ui/getSliderById', async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/sliders/${id}`,
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
export const updateSliderConfigurationAsync = createAsyncThunk(
    'ui/updateSliderConfiguration', async ({ id, newConfiguration }: { id: string, newConfiguration: { name: string, imageList: Array<string>, speed: number, animation: string } }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/administrator/sliders/${id}`, { newConfiguration },
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

export const getAllTemplatesAsync = createAsyncThunk(
    'ui/getAllTemplates', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/templates`,
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

export const getTemplateByIdAsync = createAsyncThunk(
    'ui/getTemplateById', async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/templates/${id}`,
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
        currConfig: {
            global: {
                compress: true,
                invitees: false
            },
            auth: {
                allowGoogle: false,
                compressImage: true,
                header: '',
                logoUrl: '',
                logo_public_id: '',
                background: '',
                background_public_id: ''
            },
            home: {
                hero: {
                    header: '',
                    subHeader: '',
                    compressImage: true,
                    image: '',
                    image_public_id: ''
                },
            }
        },
        sliders: [] as Array<string>,
        currSlider: {} as SliderProps,
        templates: [] as Array<string>,
        currTemplate: {} as TemplateProps,
        uiIsLoading: false,
        uiHasError: false,
        id: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getUIConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currConfig = action.payload.ui.currConfig
                    state.id = action.payload.id
                }
            )
            .addCase(
                postNewUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                postNewUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                postNewUIConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currConfig = action.payload.ui
                }
            )
            .addCase(
                updateUIConfigurationAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                updateUIConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                updateUIConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currConfig = action.payload.updatedUI
                    toast.success('UI updated succesfully.')
                }
            )
            .addCase(
                getAllSlidersAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getAllSlidersAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getAllSlidersAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.sliders = action.payload.sliders

                }
            )
            .addCase(
                getSliderByIdAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getSliderByIdAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getSliderByIdAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currSlider = action.payload.slider

                }
            )
            .addCase(
                postNewSliderAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                postNewSliderAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                postNewSliderAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    const newSlider: SliderProps = action.payload.newSlider
                    state.sliders = [...state.sliders, newSlider.id]
                    toast.success('New Slider created succesfully')
                }
            )
            .addCase(
                updateSliderConfigurationAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                updateSliderConfigurationAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                updateSliderConfigurationAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currSlider = action.payload.updatedSlider
                    toast.success('Slider updated succesfully')
                }
            )
            .addCase(
                getAllTemplatesAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getAllTemplatesAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getAllTemplatesAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.templates = action.payload.templates
                }
            )
            .addCase(
                getTemplateByIdAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                getTemplateByIdAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                getTemplateByIdAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currTemplate = action.payload.template
                }
            )
    }
})

const uiReducer = uiSlice.reducer

export default uiReducer