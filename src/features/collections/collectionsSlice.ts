import { CollectionProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL

export const getAllCollectionsAsync = createAsyncThunk(
    'products/getAllCollections', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/products/col/collections`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getAllCollectionsTitlesAsync = createAsyncThunk(
    'products/getAllCollectionsTitles', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/products/col/titles`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getCollectionByTitleAsync = createAsyncThunk(
    'products/getCollectionByTitle', async (title: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/products/col/bytitle/title/${title}`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postNewCollectionAsync = createAsyncThunk(
    'products/postNewCollection', async ({ title }: { title: string }, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token

        try {
            const { data } = await axios.post(`${url}/products/col/collections`, { title }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateCollectionByIdAsync = createAsyncThunk(
    'products/updateCollectionById', async ({ id, productId }: { id: string, productId: string }, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.put(`${url}/products/col/collections/${id}`, { productId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateCollectionDeleteProductByIdAsync = createAsyncThunk(
    'products/updateCollectionDeleteProductById', async ({ id, productId }: { id: string, productId: string }, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.put(`${url}/products/col/collections/delete/${id}`, { productId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateCollectionByIdInBulkAsync = createAsyncThunk(
    'products/updateCollectionByIdInBulk', async ({ id, productIds }: { id: string, productIds: string[] }, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.put(`${url}/products/col/inbulk/${id}`, productIds, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const deleteCollectionByIdAsync = createAsyncThunk(
    'products/deleteCollectionById', async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${url}/products/col/collections/${id}`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const collectionsSlice = createSlice({
    name: 'collections',
    initialState: {
        collections: [] as CollectionProps[],
        collection: {} as CollectionProps,
        nav: [] as string[],
        titles: [] as Array<{ title: string, id: string }>,
        isLoading: false,
        hasErrors: false,
        error: ''
    },
    reducers: {
        addCollectionToNav: (state, action) => {
            state.nav = [...state.nav, action.payload]
        },
        resetErrorState: (state) => {
            state.hasErrors = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllCollectionsAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                getAllCollectionsAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                getAllCollectionsAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collections = action.payload.collections
                }
            )
            .addCase(
                getAllCollectionsTitlesAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                getAllCollectionsTitlesAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                getAllCollectionsTitlesAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.titles = action.payload.titles
                }
            )
            .addCase(
                getCollectionByTitleAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                getCollectionByTitleAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                getCollectionByTitleAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.collection
                }
            )
            .addCase(
                updateCollectionByIdAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                updateCollectionByIdAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                updateCollectionByIdAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.updatedCollection
                    toast.success('Product added to collection succesfully.')
                }
            )
            .addCase(
                updateCollectionDeleteProductByIdAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                updateCollectionDeleteProductByIdAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                updateCollectionDeleteProductByIdAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.updatedCollection
                    toast.success('Product removed from collection succesfully.')
                }
            )
            .addCase(
                updateCollectionByIdInBulkAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                updateCollectionByIdInBulkAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                updateCollectionByIdInBulkAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.updatedCollection
                    toast.success('Collection updated succesfully.')
                }
            )
            .addCase(
                postNewCollectionAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                postNewCollectionAsync.rejected, (state, action) => {
                    console.log(action.payload, 'this is the error payload')
                    state.isLoading = false
                    state.hasErrors = true
                    state.error = (action.payload as { error: string }).error
                }
            )
            .addCase(
                postNewCollectionAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.newCollection
                    state.collections = [...state.collections, action.payload.newCollection]
                    state.titles = [...state.titles, action.payload.newCollection.title]
                    console.log([...state.titles, action.payload.newCollection.title])
                    toast.success('Collection posted succesfully.')
                }
            )
            .addCase(
                deleteCollectionByIdAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasErrors = false
                }
            )
            .addCase(
                deleteCollectionByIdAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                deleteCollectionByIdAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = {} as CollectionProps
                    state.collections = state.collections.filter(collection => collection.id !== action.payload.deletedCollection.id)
                    state.titles = state.titles.filter(title => title !== action.payload.deletedCollection.title)
                    toast.success('Collection posted succesfully.')
                }
            )
    }
})

export const { addCollectionToNav, resetErrorState } = collectionsSlice.actions
const collectionsReducer = collectionsSlice.reducer
export default collectionsReducer