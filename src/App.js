import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify'; //for flash notifications
import 'react-toastify/dist/ReactToastify.css';

import Plane from "./pages/plane/Plane";
import Kai from "./pages/kai/Kai";

import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Transaksi from "./pages/transaksi/Transaksi";
import Booking from './pages/transaksi/Booking';

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
          <Route path="/register" element={<Register />}></Route>
          <Route path="/transaksi" element={<Transaksi />}></Route>
          <Route path="/booking" element={<Booking />}></Route>
          <Route path="/profile/view" element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>       
    </div>
  );
}

export default App;
