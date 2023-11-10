import React from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center">
        <div className="flex-grow flex items-center md:items-stretch"> {/* Gunakan md:items-stretch hanya pada tampilan mobile */}
          <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
            <div className="max-w-md text-center">
              <div className="text-4xl font-dark font-bold">404</div>
              <p className="text-2xl md:text-3xl font-light leading-normal">
                Maaf, page tidak ditemukan.
              </p>
              <p className="mb-8">
                Jangan khawatir, Anda bisa mencari menu lain di halaman beranda kami.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
              >
                Back to Homepage
              </button>
            </div>
            <div className="max-w-md">
              <img src={'/404.jpeg'} alt="404.jpeg" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page404;
