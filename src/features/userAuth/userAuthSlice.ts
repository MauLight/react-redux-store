import { LoginProps, NewUserProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL2
const user = localStorage.getItem('store-user') ? JSON.parse(localStorage.getItem('store-user') as string) : {}

export const postNewUserAsync = createAsyncThunk(
    'userAuth/postUser', async (user: NewUserProps, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/auth/create`, user)
            toast.success('User created succesfully.')
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postLoginAsync = createAsyncThunk(
    'userAuth/postLogin', async (user: LoginProps, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/auth`, user)
            localStorage.setItem('store-user', JSON.stringify(data))
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: {
        user,
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postNewUserAsync.pending, (state, _action) => {
                state.hasError = false
                state.isLoading = true
            })
            .addCase(postNewUserAsync.fulfilled, (state, _action) => {
                state.hasError = false
                state.isLoading = false
            })
            .addCase(postNewUserAsync.rejected, (state, _action) => {
                state.hasError = true
                state.isLoading = false
            })
            .addCase(postLoginAsync.pending, (state, _action) => {
                state.hasError = false
                state.isLoading = true
            })
            .addCase(postLoginAsync.fulfilled, (state, action) => {
                state.user = action.payload
                state.hasError = false
                state.isLoading = false
            })
            .addCase(postLoginAsync.rejected, (state, _action) => {
                state.hasError = true
                state.isLoading = false
            })
    }
})

const userAuthReducer = userAuthSlice.reducer
export default userAuthReducer