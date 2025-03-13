import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false, //error
  isOkBalance:false, //calback
  bookData:null,
  searchData:null,
  bookDataLanjutBayarPesawat:null,
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
    setBookDataLanjutBayarPesawat: (state, action) => {
	    state.bookDataLanjutBayarPesawat = action.payload;
	  }
  },
});