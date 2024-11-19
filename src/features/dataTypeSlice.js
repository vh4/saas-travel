import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateDataType = {
    data: {
        type: 'auth'
    },
    error: false,
    isLoading: true
};

const fetchDataType = createAsyncThunk('travel/type', async () => {
    const response = await axios.get(`${process.env.REACT_APP_HOST_API}/travel/is_type`);
    return { type: response.data.type };
});

export const authSlice = createSlice({
    name: 'type',
    initialState: initialStateDataType, // Assign initialState directly here
    reducers: {
        setType: (state, action) => {
            state.data.type = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataType.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(fetchDataType.fulfilled, (state, action) => {
                state.data.type = action.payload.type;
                state.isLoading = false;
                state.error = false;
            })
            .addCase(fetchDataType.rejected, (state) => {
                state.isLoading = false;
                state.error = true;
            });
    }
});

export { fetchDataType };
