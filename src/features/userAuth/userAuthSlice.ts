import { LoginProps, NewUserProps, UserToBeUpdatedProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_BACKEND_URL
const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
const token = user.token

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
            localStorage.setItem('marketplace-user', JSON.stringify(data))
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const postLoginClientAsync = createAsyncThunk(
    'userAuth/postLoginClient', async (user: LoginProps, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${url}/auth/admin`, user)
            localStorage.setItem('marketplace-admin', JSON.stringify(data))
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getUserByIdAsync = createAsyncThunk(
    'userAuth/getUserById', async (id: string, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        if (!id) {
            return
        }

        try {
            const { data } = await axios.get(`${url}/auth/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const updateUserByIdAsync = createAsyncThunk(
    'userAuth/updateUserById', async (updatedUser: UserToBeUpdatedProps, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${url}/auth/user/${user.id}`, updatedUser, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
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
        client: {},
        userData: {},
        isLoading: false,
        hasError: false,
        getUserIsLoading: false,
        getUserHasError: false,
        errorMessage: ''
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
            .addCase(postLoginClientAsync.pending, (state, _action) => {
                state.hasError = false
                state.isLoading = true
            })
            .addCase(postLoginClientAsync.fulfilled, (state, action) => {
                state.client = action.payload
                state.hasError = false
                state.isLoading = false
            })
            .addCase(postLoginClientAsync.rejected, (state, _action) => {
                state.hasError = true
                state.isLoading = false
            })
            .addCase(getUserByIdAsync.pending, (state, _action) => {
                state.getUserHasError = false
                state.getUserIsLoading = true
            })
            .addCase(getUserByIdAsync.fulfilled, (state, action) => {
                if (action.payload.user) state.userData = action.payload.user
                state.getUserHasError = false
                state.getUserIsLoading = false
            })
            .addCase(getUserByIdAsync.rejected, (state, action) => {
                state.getUserHasError = true
                state.getUserIsLoading = false
                state.errorMessage = action.payload as string
            })
            .addCase(updateUserByIdAsync.pending, (state, _action) => {
                state.hasError = false
                state.isLoading = true
            })
            .addCase(updateUserByIdAsync.fulfilled, (state, action) => {
                state.userData = action.payload.updatedUser
                state.hasError = false
                state.isLoading = false
            })
            .addCase(updateUserByIdAsync.rejected, (state, _action) => {
                state.hasError = true
                state.isLoading = false
            })
    }
})

const userAuthReducer = userAuthSlice.reducer
export default userAuthReducer