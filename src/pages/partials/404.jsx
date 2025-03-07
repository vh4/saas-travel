import React, { useEffect } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router";

const Page404 = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center">
        <div className="flex-grow flex items-center xl:items-stretch"> {/* Gunakan xl:items-stretch hanya pada tampilan mobile */}
          <div className="container flex flex-col xl:flex-row items-center justify-center px-5 text-black">
            <div className="max-w-md text-center">
              <div className="text-2xl font-dark">404</div>
              <p className="text-md xl:text-xl font-light leading-normal mb-4">
                Maaf, page tidak ditemukan.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-4 inline py-2 text-xs leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
              >
                Back to Homepage
              </button>
            </div>
            <div className="max-w-md">
              <img src={'/404.png'} alt="404.jpeg" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page404;
