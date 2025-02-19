import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"

const url = import.meta.env.VITE_BACKEND_URL

export const getAllErrorsAsync = createAsyncThunk(
    'errors/getAllErrors', async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${url}/errors`)
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const errorsSlice = createSlice({
    name: 'errorsSlice',
    initialState: {
        errors: [] as any[],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllErrorsAsync.pending, (state, _action) => {
                state.isLoading = true
                state.hasError = false
            })
            .addCase(getAllErrorsAsync.rejected, (state, _action) => {
                state.isLoading = false
                state.hasError = true
            })
            .addCase(getAllErrorsAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.hasError = false
                if (action.payload) {
                    state.errors = action.payload.errors
                }
            })
    }
})

const errorsReducer = errorsSlice.reducer
export default errorsReducer
