import { NewUserProps } from "@/utils/types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const url = import.meta.env.VITE_BACKEND_URL2

export const postNewUserAsync = createAsyncThunk(
    'userAuth/postUser', async (user: NewUserProps) => {
        const { data } = await axios.post(`${url}/user`, user)
        return data
    }
)

export const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: {
        user: {},
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
    }
})

const userAuthReducer = userAuthSlice.reducer
export default userAuthReducer