import React, {createContext, useEffect, useReducer} from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./pages/profile/Profile";

import TransaksiKai from "./pages/transaksi/TransaksiKai";
import TransaksiPesawat from "./pages/transaksi/TransaksiPesawat";

import BookingKaiList from "./pages/booking/KaiBooking";
import BookingPesawatList from "./pages/booking/PesawatBooking";

import SearchKai from "./pages/kai/Search";
import SearchPlane from "./pages/plane/Search";

import SearchPelni from "./pages/pelni/Search";
import BookingPelni from "./pages/pelni/Booking";
import PaymentPelni from "./pages/pelni/Pembayaran";

import BookingKai from "./pages/kai/Booking";
import KonfirmasiKai from "./pages/kai/Konfirmasi";
import PembayaranKai from "./pages/kai/Pembayaran"; 
import MainPage from "./pages/main/Main"
import TiketKai from "./pages/kai/Tiket";

import BookingPesawat from "./pages/plane/Booking";
import PembayaranPesawat from "./pages/plane/Pembayaran";
import TiketPesawat from "./pages/plane/Tiket";

export const TiketContext = createContext();
export const NavContext = createContext();


function App() {

  const initialStatePembayaran = {
    isPayed: false,
  }

  const initialStateNavigation = {
    isActive: 0,

  }

  const reducer = (state, action) => {
      switch(action.type) {
        case 'PAY_TRAIN': return {
          isPayed: true,
        }
        case 'PAY_FLIGHT': return {
          isPayed: true,
        }
        case 'NAVIGATION':return{
          isActive:action.isActive
        }
      }
  }

  const [pay, dispatch] =  useReducer(reducer, initialStatePembayaran);
  const [nav, setNav] =  useReducer(reducer, initialStateNavigation);

  return (
    <div className="App">
       <BrowserRouter>
      <TiketContext.Provider value={{pay,dispatch}}>
      <NavContext.Provider value={{nav,setNav}}>
        <Routes>
          <Route exact path="/" element={<MainPage />}></Route>
          <Route path="/train/search" element={< SearchKai/>}></Route>
          <Route path="/flight/search" element={< SearchPlane/>}></Route>
          <Route path="/pelni/search" element={< SearchPelni/>}></Route>
          <Route path="/pelni/booking" element={< BookingPelni/>}></Route>
          <Route path="/pelni/payment" element={< PaymentPelni/>}></Route>
          <Route path="/flight/booking/:PesawatNumber" element={< BookingPesawat/>}></Route>
          <Route path="/flight/payment/:PesawatNumber" element={< PembayaranPesawat/>}></Route>
          <Route path="/flight/tiket-pesawat" element={< TiketPesawat/>}></Route>
          <Route path="/train/booking/:trainNumber" element={< BookingKai/>}></Route>
          <Route path="/train/konfirmasi/:trainNumber" element={< KonfirmasiKai/>}></Route>
          <Route path="/train/bayar/:trainNumber" element={< PembayaranKai/>}></Route>
          <Route path="/train/tiket-kai" element={< TiketKai/>}></Route>
          <Route path="/transaksi/kai" element={<TransaksiKai />}></Route>
          <Route path="/transaksi/pesawat" element={<TransaksiPesawat />}></Route>
          <Route path="/booking/kai" element={<BookingKaiList />}></Route>
          <Route path="/booking/pesawat" element={<BookingPesawatList />}></Route>
          <Route path="/profile/view" element={<Profile />}></Route>
        </Routes>
        </NavContext.Provider>  
        </TiketContext.Provider>  
      </BrowserRouter>     
    </div>
  );
}

export default App;
