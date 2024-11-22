import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false, //error
  isOkBalancePelni:false, //calback
  bookDataPelni:null,
  searchDataPelni:null,
};
  
export const bookPelniSlice = createSlice({
  name: "booking/pelni",
  initialState,
  reducers: {
    setisOkBalancePelni: (state, action) => {
      state.isOkBalancePelni = action.payload;
    },
	setDataBookPelni: (state, action) => {
	    state.bookDataPelni = action.payload;
	  },
    setDataSearchPelni: (state, action) => {
	    state.searchDataPelni = action.payload;
	  }
  },
});