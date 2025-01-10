import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const url = import.meta.env.VITE_COURIER_BACKEND_URL

export const getCoverageFromCourierAsync = createAsyncThunk(
    'courier/getCoverageFromCourier', async ({ regionCode, type }: { regionCode: string, type: number }, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.get(`${url}/courier?regionCode=${regionCode}&type=${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const getRegionsFromCourierAsync = createAsyncThunk(
    'courier/getRegionsFromCourier', async (_, { rejectWithValue }) => {
        const user = localStorage.getItem('marketplace-user') ? JSON.parse(localStorage.getItem('marketplace-user') as string) : {}
        const token = user.token
        try {
            const { data } = await axios.get('http://testservices.wschilexpress.com/georeference/api/v1/regions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return data
        } catch (error) {
            toast.error((error as AxiosError).message)
            return rejectWithValue((error as AxiosError).response?.data || (error as AxiosError).message)
        }
    }
)

export const courierSlice = createSlice({
    name: 'courier',
    initialState: {
        counties: [],
        regions: [],
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getRegionsFromCourierAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                getRegionsFromCourierAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                getRegionsFromCourierAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasError = false
                    state.regions = action.payload.regions
                }
            )
            .addCase(
                getCoverageFromCourierAsync.pending, (state, _action) => {
                    state.isLoading = true
                    state.hasError = false
                }
            )
            .addCase(
                getCoverageFromCourierAsync.rejected, (state, _action) => {
                    state.isLoading = false
                    state.hasError = true
                }
            )
            .addCase(
                getCoverageFromCourierAsync.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.hasError = false
                    const response = action.payload.data.coverageAreas
                    const counties = response.map((county: Record<string, string>) => county.coverageName)
                    state.counties = counties
                }
            )
    }
}
)

const courierReducer = courierSlice.reducer
export default courierReducer