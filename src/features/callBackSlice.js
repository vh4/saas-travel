import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isError: false,
  isLoading: false,
  isOk: false,
};

const callbackFetchData = createAsyncThunk(
	"travel/callback",
	async ({ type, id_transaksi }, { rejectWithValue }) => {
	  try {
		const response = await axios.post(
		  `${process.env.REACT_APP_HOST_API}/travel/${type}/callback`,
		  {
			id_transaksi,
		  }
		);
		if (response.data.rc === "00") {
		  return { isOk: true };
		} else {
		  return { isOk: false };
		}
	  } catch (error) {
		  console.error(error);
		  return rejectWithValue(error.response?.data || "An error occurred");
	  }
	}
  );
  
export const callbackSlice = createSlice({
  name: "callback",
  initialState,
  reducers: {
    setOk: (state, action) => {
      state.isOk = action.payload;
    },
    setLoadingCallback: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callbackFetchData.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(callbackFetchData.fulfilled, (state, action) => {
        state.isOk = action.payload.isOk;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(callbackFetchData.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        console.error(action.payload);
      });
  },
});

export {
	callbackFetchData
}
