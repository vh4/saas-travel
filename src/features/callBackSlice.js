import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isError: false,
  isLoading: false,
  isOk: false,
  username: null,
  merchant: null,
  total_komisi: null,
  komisi_mitra: null,
  komisi_merchant: null,
  saldo_terpotong_mitra: null,
  saldo_terpotong_merchant: null,
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

    if (response.data.rc == "00") {

      const data = response.data.data;

		  return { 
        isOk: true,  
        username: data.username,
        merchant: data.merchant,
        total_komisi: data.total_komisi,
        komisi_mitra: data.komisi_mitra,
        komisi_merchant: data.komisi_merchant,
        saldo_terpotong_mitra: data.saldo_terpotong_mitra,
        saldo_terpotong_merchant: data.saldo_terpotong_merchant,
      };
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
        if(action.payload.isOk == true){
          console.log(action.payload.username);
          state.username = action.payload.username;
          state.merchant = action.payload.merchant;
          state.total_komisi = action.payload.total_komisi;
          state.komisi_mitra = action.payload.komisi_mitra;
          state.komisi_merchant = action.payload.komisi_merchant;
          state.saldo_terpotong_mitra = action.payload.saldo_terpotong_mitra;
          state.saldo_terpotong_merchant = action.payload.saldo_terpotong_merchant;
        }
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
