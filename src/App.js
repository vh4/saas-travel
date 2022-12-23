import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import { ToastContainer } from 'react-toastify'; //for flash notifications

function App() {
  return (
    <div className="App" >
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
          theme="light"
          />      
       <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>       
    </div>
  );
}

export default App;
