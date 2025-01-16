import { CollectionProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL

export const getAllCollectionsAsync = createAsyncThunk(
    'products/getAllCollections', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/collections`)
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
            const { data } = await axios.get(`${url}/collections/titles`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getCollectionByTitleAsync = createAsyncThunk(
    'products/getCollectionByTitle', async (title, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/collections/title/${title}`)
            return data
        } catch (error) {
            console.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postNewCollectionAsync = createAsyncThunk(
    'products/postNewCollection', async (collection, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token

        try {
            const { data } = await axios.post(`${url}/collections`, collection, {
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
    'products/updateCollectionById', async (id, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.get(`${url}/collections/${id}`, {
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
            const { data } = await axios.put(`${url}/collections/inbulk/${id}`, productIds, {
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
            const { data } = await axios.delete(`${url}/collections/${id}`)
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
        titles: [] as Array<string>,
        isLoading: false,
        hasErrors: false
    },
    reducers: {
        addCollectionToNav: (state, action) => {
            state.nav = [...state.nav, action.payload]
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
                    toast.success('Collection updated succesfully.')
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
                postNewCollectionAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasErrors = true
                }
            )
            .addCase(
                postNewCollectionAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasErrors = false
                    state.collection = action.payload.newCollection
                    state.collections = [...state.collections, action.payload.newCollection]
                    state.titles = [...state.titles, action.payload.newCollection.title]
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

export const { addCollectionToNav } = collectionsSlice.actions
const collectionsReducer = collectionsSlice.reducer
export default collectionsReducer