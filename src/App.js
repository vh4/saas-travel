import React, {createContext, useReducer} from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify'; //for flash notifications
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./pages/profile/Profile";
import Transaksi from "./pages/transaksi/Transaksi";
import BookingList from './pages/transaksi/Booking';
import BookingKai from "./pages/kai/Booking";
import SearchKai from "./pages/kai/Search";
import KonfirmasiKai from "./pages/kai/Konfirmasi";
import PembayaranKai from "./pages/kai/Pembayaran"; 
import MainPage from "./pages/main/Main"
import TiketKai from "./pages/kai/Tiket";

export const KaiContext = createContext();


function App() {

  const initialStatePembayaran = {
    isPayed: false,
  }

  const reducer = (state, action) => {
      switch(action.type) {
        case 'PAY_TRAIN': return {
          isPayed: true,
        }
      }
  }

  const [pay, dispatch] =  useReducer(reducer, initialStatePembayaran);
  
  return (
    <div className="App" >
       <BrowserRouter>
       <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />  
      <KaiContext.Provider value={{pay,dispatch}}>
        <Routes>
          <Route exact path="/" element={<MainPage />}></Route>
          <Route path="/train/search" element={< SearchKai/>}></Route>
          <Route path="/train/booking/:trainNumber" element={< BookingKai/>}></Route>
          <Route path="/train/konfirmasi/:trainNumber" element={< KonfirmasiKai/>}></Route>
          <Route path="/train/bayar/:trainNumber" element={< PembayaranKai/>}></Route>
          <Route path="/train/tiket-kai" element={< TiketKai/>}></Route>
          <Route path="/transaksi" element={<Transaksi />}></Route>
          <Route path="/booking" element={<BookingList />}></Route>
          <Route path="/profile/view" element={<Profile />}></Route>
        </Routes>
        </KaiContext.Provider>  
      </BrowserRouter>     
    </div>
  );
}

export default App;
