import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify'; //for flash notifications
import 'react-toastify/dist/ReactToastify.css';

import Plane from "./pages/plane/Plane";
import Kai from "./pages/kai/Kai";

import Profile from "./pages/profile/Profile";
import Transaksi from "./pages/transaksi/Transaksi";
import BookingList from './pages/transaksi/Booking';
import BookingKai from "./pages/kai/Booking";

function App() {
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
        <Routes>
          <Route exact path="/" element={<Plane />}></Route>
          <Route exact path="/train" element={< Kai/>}></Route>
          <Route exact path="/train/booking/:trainNumber" element={< BookingKai/>}></Route>
          <Route path="/transaksi" element={<Transaksi />}></Route>
          <Route path="/booking" element={<BookingList />}></Route>
          <Route path="/profile/view" element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>       
    </div>
  );
}

export default App;
