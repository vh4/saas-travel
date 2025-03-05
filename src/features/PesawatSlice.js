import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false, //error
  isOkBalance:false, //calback
  bookData:null,
  searchData:null,
  bookDataLanjutBayar:null,
};
  
export const bookPesawatSlice = createSlice({
  name: "booking/pesawat",
  initialState,
  reducers: {
    setisOkBalance: (state, action) => {
      state.isOkBalance = action.payload;
    },
	  setDataBookPesawat: (state, action) => {
	    state.bookData = action.payload;
	  },
    setDataSearchPesawat: (state, action) => {
	    state.searchData = action.payload;
	  },
    setBookDataLanjutBayar: (state, action) => {
	    state.bookDataLanjutBayar = action.payload;
	  }
  },
});