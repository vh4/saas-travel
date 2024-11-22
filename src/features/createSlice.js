import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './dataTypeSlice';
import { callbackSlice } from './callBackSlice';
import { bookPesawatSlice } from './PesawatSlice';
import { bookKeretaSlice } from './KeretaSlice';
import { bookPelniSlice } from './PelniSlice';

const store = configureStore({
    reducer: {
        type: authSlice.reducer,
        callback:callbackSlice.reducer,
        bookpesawat: bookPesawatSlice.reducer,
        bookkereta: bookKeretaSlice.reducer,
        bookpelni: bookPelniSlice.reducer,
    }
});

export const { setType, setLoading } = authSlice.actions;
export const { setOk, setLoadingCallback } = callbackSlice.actions;
export const { setDataBookPesawat, setisOkBalance, setDataSearchPesawat } = bookPesawatSlice.actions;
export const { setDataBookKereta, setisOkBalanceKereta, setDataSearchKereta } = bookKeretaSlice.actions;
export const { setDataBookPelni, setisOkBalancePelni, setDataSearchPelni} = bookPelniSlice.actions;

export default store;
