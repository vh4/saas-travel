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
  errorMessage: null, // Tambahan untuk menyimpan pesan error
};

const callbackFetchData = createAsyncThunk(
  "travel/callback",
  async ({ type, id_transaksi }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/${type}/callback`,
        { id_transaksi }
      );

      if (response.data?.rc === "00") {
        return {
          isOk: true,
          username: response.data.username,
          merchant: response.data.merchant,
          total_komisi: response.data.total_komisi,
          komisi_mitra: response.data.komisi_mitra,
          komisi_merchant: response.data.komisi_merchant,
          saldo_terpotong_mitra: response.data.saldo_terpotong_mitra,
          saldo_terpotong_merchant: response.data.saldo_terpotong_merchant,
        };
      }

      return { isOk: false };
    } catch (error) {
      console.error("Error in callbackFetchData:", error);
      return rejectWithValue(
        error.response?.data?.message || "An unexpected error occurred"
      );
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
        state.errorMessage = null; // Reset pesan error saat loading
      })
      .addCase(callbackFetchData.fulfilled, (state, action) => {
        state.isOk = action.payload.isOk;

        if (action.payload.isOk === true) {
          Object.assign(state, {
            username: action.payload.username,
            merchant: action.payload.merchant,
            total_komisi: action.payload.total_komisi,
            komisi_mitra: action.payload.komisi_mitra,
            komisi_merchant: action.payload.komisi_merchant,
            saldo_terpotong_mitra: action.payload.saldo_terpotong_mitra,
            saldo_terpotong_merchant: action.payload.saldo_terpotong_merchant,
          });
        }

        state.isError = false;
        state.isLoading = false;
      })
      .addCase(callbackFetchData.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.errorMessage = action.payload || "Unknown error occurred"; // Simpan pesan error
        console.error("Error in callbackFetchData:", action.payload);
      });
  },
});

export default callbackSlice.reducer;
export { callbackFetchData };
