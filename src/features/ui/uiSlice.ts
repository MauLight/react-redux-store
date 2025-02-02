import { SliderProps, TemplateProps } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL
const admin = localStorage.getItem('marketplace-admin') ? JSON.parse(localStorage.getItem('marketplace-admin') as string) : {}

export const classicTemplate = {
    title: 'classic',
    preview: 'https://res.cloudinary.com/maulight/image/upload/v1737986747/classic.png',
    hero: {
        layout: 'relative h-[900px] w-full bg-gray-100 p-10 overflow-hidden',
        image: 'h-full grid grid-cols-3 overflow-hidden rounded-[15px]'
    },
    product: {
        layout: 'flex gap-x-5 bg-[#ffffff] p-10 rounded-[10px] border',
        title: 'text-[1.5rem] min-[500px]:text-[2.5rem] font-light text-sym_gray-600 text-balance',
        button: 'h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] rounded-[5px]',
        video: false
    },
    card: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-10 px-10 py-20 bg-gray-100',
        card: 'h-[600px] col-span-1 overflow-hidden rounded-[15px] flex flex-col',
        image: 'h-[480px] z-10',
        textLayout: 'w-full h-[120px] py-10 flex justify-between px-10 z-20 transition-all duration-300 text-[1rem] min-[400px]:text-[1.5rem] bg-[#ffffff] antialiazed text-[#10100e] leading-tight',
        gradient: false
    }
}

export const techTemplate = {
    title: 'tech',
    preview: 'https://res.cloudinary.com/maulight/image/upload/v1737986746/tech.png',
    hero: {
        layout: 'relative h-[900px] w-full bg-[#ffffff] p-12 overflow-hidden',
        image: 'h-full grid grid-cols-3 overflow-hidden'
    },
    product: {
        layout: 'flex gap-x-5 bg-[#ffffff] p-10',
        title: 'text-[1.5rem] min-[500px]:text-[2.5rem] font-light text-sym_gray-600 text-balance',
        button: 'h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]',
        video: false
    },
    card: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3 gap-12 px-12 py-20 bg-[#ffffff]',
        card: 'h-[500px] col-span-1 overflow-hidden flex flex-col hover:shadow-xl',
        image: 'h-[380px] z-10',
        textLayout: 'w-full h-[120px] py-10 flex justify-between px-10 z-20 transition-all duration-300 text-[1rem] min-[400px]:text-[1.5rem] bg-[#ffffff] antialiazed text-[#10100e] leading-tight',
        gradient: false
    }
}

export const modernTemplate = {
    title: 'modern',
    preview: 'https://res.cloudinary.com/maulight/image/upload/v1737986959/modern.png',
    hero: {
        layout: 'relative h-[900px] w-full overflow-hidden',
        image: 'h-full grid grid-cols-3 overflow-hidden'
    },
    product: {
        layout: 'flex gap-x-5 bg-[#ffffff] p-10',
        title: 'text-[1.5rem] min-[500px]:text-[2.5rem] font-light text-sym_gray-600 text-balance uppercase',
        button: 'h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]',
        video: true
    },
    card: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 min-[1440px]:grid-cols-3',
        card: 'h-[700px] col-span-1 overflow-hidden',
        image: 'h-full',
        textLayout: 'w-full absolute bottom-5 flex justify-between px-5 z-10 transition-all duration-300 text-[1rem] min-[400px]:text-[22px] uppercase antialiazed text-[#ffffff] leading-tight',
        gradient: true
    }
}

export const getUIConfigurationAsync = createAsyncThunk(
    'ui/getUIConfiguration', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/administrator/ui`
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postNewUIConfigurationAsync = createAsyncThunk(
    'ui/postNewUIConfiguration', async ({ business, productType, templateTitle }: { business: string, productType: string, templateTitle: string }, { rejectWithValue }) => {
        const admin = localStorage.getItem('marketplace-admin') ? JSON.parse(localStorage.getItem('marketplace-admin') as string) : {}
        try {
            const { data } = await axios.post(`${url}/administrator/ui`, { business, productType, templateTitle },
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
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
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateCurrentTemplateAsync = createAsyncThunk(
    'ui/updateCurrentTemplate', async ({ uiId, templateId }: { uiId: string, templateId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/administrator/ui/template/${uiId}`, { templateId },
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateCurrentSliderAsync = createAsyncThunk(
    'ui/updateCurrentSlider', async ({ uiId, sliderId }: { uiId: string, sliderId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/administrator/ui/slider/${uiId}`, { sliderId },
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
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
            const { data } = await axios.get(`${url}/administrator/sliders`
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
            const { data } = await axios.get(`${url}/administrator/sliders/${id}`
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
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
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
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const deleteSliderAsync = createAsyncThunk(
    'ui/deleteSlider', async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${url}/administrator/sliders/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`,
                        'Content-Type': 'application/json'
                    }
                }
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
            const { data } = await axios.get(`${url}/administrator/templates`
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
            const { data } = await axios.get(`${url}/administrator/templates/${id}`
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
                allowAI: false,
                compress: true,
                invitees: false,
                business: '',
                productType: ''
            },
            ui: {
                sorting: []
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
                topbar: {
                    transparent: true,
                    bgColor: '',
                    logo: ''
                },
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
        currSliderId: '',
        currSlider: {} as SliderProps | {},
        templates: [] as Array<TemplateProps>,
        currentTemplateId: '',
        currentTemplate: {} as TemplateProps,
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
                    state.id = action.payload.ui.id
                    state.currConfig = action.payload.ui.currConfig
                    state.currSliderId = action.payload.ui.currSlider
                    state.currentTemplateId = action.payload.ui.currentTemplate
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
                    state.id = action.payload.ui.id
                    state.currConfig = action.payload.ui.currConfig
                    state.currSliderId = action.payload.ui.currSlider
                    state.currentTemplateId = action.payload.ui.currentTemplate
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
                    state.currConfig = action.payload.updatedUI.currConfig
                    toast.success('UI updated succesfully.')
                }
            )
            .addCase(
                updateCurrentTemplateAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                updateCurrentTemplateAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                    toast.error('There was an error updating UI configuration.')
                }
            )
            .addCase(
                updateCurrentTemplateAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currentTemplateId = action.payload.updatedUI.currentTemplate
                    toast.success('UI template updated succesfully.')
                }
            )
            .addCase(
                updateCurrentSliderAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                updateCurrentSliderAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                    toast.error('There was an error updating UI configuration.')
                }
            )
            .addCase(
                updateCurrentSliderAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currSliderId = action.payload.updatedUI.currSlider
                    toast.success('Slider updated succesfully.')
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
                deleteSliderAsync.pending, (state, _action) => {
                    state.uiIsLoading = true
                    state.uiHasError = false
                }
            )
            .addCase(
                deleteSliderAsync.rejected, (state, _action) => {
                    state.uiIsLoading = false
                    state.uiHasError = true
                }
            )
            .addCase(
                deleteSliderAsync.fulfilled, (state, action) => {
                    state.uiIsLoading = false
                    state.uiHasError = false
                    state.currSliderId = action.payload.slider.id
                    state.currSlider = action.payload.slider
                    state.sliders = state.sliders.filter((slider) => slider !== action.payload.slider.id)
                    toast.success('Slider deleted succesfully')
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
                    state.currentTemplate = action.payload.template
                }
            )
    }
})

const uiReducer = uiSlice.reducer

export default uiReducer