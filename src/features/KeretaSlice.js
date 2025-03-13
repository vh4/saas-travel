import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isErrorKereta: false, //error
  isOkBalanceKereta:false, //calback
  bookDataKereta:null,
  searchDataKereta:null,
  bookDataLanjutBayarKereta:null,
};
  
export const bookKeretaSlice = createSlice({
  name: "booking/kereta",
  initialState,
  reducers: {
    setisOkBalanceKereta: (state, action) => {
      state.isOkBalanceKereta = action.payload;
    },
	  setDataBookKereta: (state, action) => {
	    state.bookDataKereta = action.payload;
	  },
    setDataSearchKereta: (state, action) => {
	    state.searchDataKereta = action.payload;
	  },
    setBookDataLanjutBayarKereta: (state, action) => {
	    state.bookDataLanjutBayarKereta = action.payload;
	  }
  },
});