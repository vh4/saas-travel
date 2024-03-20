import React, {createContext, useEffect, useReducer, useState} from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";

import TransaksiKai from "./pages/transaksi/TransaksiKai";
import TransaksiPesawat from "./pages/transaksi/TransaksiPesawat";
import TransaksiPelni from "./pages/transaksi/TransaksiPelni";
import TransaksiDlu from "./pages/transaksi/TransaksiDlu";

// import BookingKaiList from "./pages/booking/KaiBooking";
// import BookingPesawatList from "./pages/booking/PesawatBooking";
// import BookingPelniList from "./pages/booking/BookingPelni";

import SearchKai from "./pages/kai/Search";
import SearchPlane from "./pages/plane/Search";

import SearchPelni from "./pages/pelni/Search";
import BookingPelni from "./pages/pelni/Booking";
import PaymentPelni from "./pages/pelni/Pembayaran";

import SearchDlu from "./pages/dlu/Search";
import BookingDlu from "./pages/dlu/Booking"
import Pembayaran from "./pages/dlu/Pembayaran"

import BookingKai from "./pages/kai/Booking";
import KonfirmasiKai from "./pages/kai/Konfirmasi";
import PembayaranKai from "./pages/kai/Pembayaran"; 
import MainPage from "./pages/main/Main"
import TiketKai from "./pages/kai/Tiket";

import BookingKaiTransit from "./pages/kai/BookingTransit";
import BayarTransit from "./pages/kai/BayarTransit"

import BookingPesawat from "./pages/plane/Booking";
import PembayaranPesawat from "./pages/plane/Pembayaran";
import TiketPesawat from "./pages/plane/Tiket";
import Page404 from "./pages/partials/404";
import Logout from "./pages/Logout";
import KonfirmasiTransit from "./pages/kai/KonfirmasiTransit";
import axios from "axios";

export const TiketContext = createContext();
export const NavContext = createContext();
export const LogoutContent = createContext();
export const LoginContent = createContext();
export const HolidaysContext = createContext();

const NormalizeRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

 useEffect(() => {
    const path = location.pathname.replace(/\/\/+/g, '/');
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

function App() {

  const initialStatePembayaran = {
    isPayed: false,
  }

  const initialStateNavigation = {
    isActive: 0,

  }

  const initialStateLogout = {
    IsLogout: false,

  }

  const initialStateLogin = {
    setLogin: false,
    setShowModal: true,

  }

  const initialStateHolidays = []; // Initial state for holidays

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_API}/travel/holidays`);
        dispatchHolidays({ type: 'SET_HOLIDAYS', payload: response.data });
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
  }, []);
  
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
        case 'LOGOUT': return{
          IsLogout: true
        }
        case 'LOGIN': return{
          setLogin: true,
          setShowModal:false,
        } 
      }
  }

  const holidaysReducer = (state, action) => {
    switch (action.type) {
      case 'SET_HOLIDAYS':
        return action.payload;
      default:
        return state;
    }
  };

  const [pay, dispatch] =  useReducer(reducer, initialStatePembayaran);
  const [logout, setLogout] =  useReducer(reducer, initialStateLogout);
  const [nav, setNav] =  useReducer(reducer, initialStateNavigation);
  const [loginComponent, setLoginComponent] =  useReducer(reducer, initialStateLogin);
  const [holidays, dispatchHolidays] = useReducer(holidaysReducer, initialStateHolidays);

  return (
    <div className="App">
       <BrowserRouter>
       <HolidaysContext.Provider value={{ holidays, dispatchHolidays }}>
          <LogoutContent.Provider value={{logout,setLogout}} >
          <TiketContext.Provider value={{pay,dispatch}}>
            <NavContext.Provider value={{nav,setNav}}>
              <LoginContent.Provider value={{loginComponent, setLoginComponent}}>
                <Routes>
                  <Route exact path="/" element={<MainPage />}></Route>
                  <Route path="/train/search" element={< SearchKai/>}></Route>
                  <Route path="/flight/search" element={< SearchPlane/>}></Route>
                  <Route path="/pelni/search" element={< SearchPelni/>}></Route>
                  <Route path="/pelni/booking/:id" element={< BookingPelni/>}></Route>
                  <Route path="/pelni/payment/:id" element={< PaymentPelni/>}></Route>
                  <Route path="/dlu/search" element={< SearchDlu/>}></Route>
                  <Route path="/dlu/booking/:id" element={< BookingDlu/>}></Route>
                  <Route path="/dlu/payment/:id" element={< Pembayaran/>}></Route>
                  <Route path="/flight/booking/:id" element={< BookingPesawat/>}></Route>
                  <Route path="/flight/payment/" element={< PembayaranPesawat/>}></Route>
                  <Route path="/flight/tiket-pesawat" element={< TiketPesawat/>}></Route>
                  <Route path="/train/booking/:id" element={< BookingKai/>}></Route>
                  <Route path="/train/booking/transit/:id" element={< BookingKaiTransit/>}></Route>
                  <Route path="/train/konfirmasi" element={< KonfirmasiKai/>}></Route>
                  <Route path="/train/konfirmasi/transit" element={< KonfirmasiTransit/>}></Route>
                  <Route path="/train/bayar" element={< PembayaranKai/>}></Route>
                  <Route path="/train/bayar/transit" element={< BayarTransit/>}></Route>
                  <Route path="/train/tiket-kai" element={< TiketKai/>}></Route>
                  <Route path="/transaksi/kai" element={<TransaksiKai />}></Route>
                  <Route path="/transaksi/pesawat" element={<TransaksiPesawat />}></Route>
                  <Route path="/transaksi/pelni" element={<TransaksiPelni />}></Route>
                  <Route path="/transaksi/dlu" element={<TransaksiDlu />}></Route>

                  {/* <Route path="/booking/kai" element={<BookingKaiList />}></Route> */}
                  {/* <Route path="/booking/pesawat" element={<BookingPesawatList />}></Route> */}
                  {/* <Route path="/booking/pelni" element={<BookingPelniList />}></Route> */}
                  <Route path="/logout" element={<Logout />}></Route>
                  <Route path="/*" element={<Page404 />} />
                </Routes>
              </LoginContent.Provider>
            </NavContext.Provider>  
          </TiketContext.Provider>  
          </LogoutContent.Provider>
       </HolidaysContext.Provider>
      </BrowserRouter>     
    </div>
  );
}

export default App;
