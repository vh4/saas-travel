import React from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router";

const Page404 = () => {

  const navigate = useNavigate();

  return (
    <>
		<div className="flex flex-col min-h-screen">
		<div class="flex-grow flex items-center">
			<div class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
				<div class="max-w-md">
					<div class="text-5xl font-dark font-bold">404</div>
					<p
					class="text-2xl md:text-3xl font-light leading-normal"
					>Maaf, page tidak ditemukan. </p>
				<p class="mb-8">Jangan khawatir, Anda bisa mencari menu lain di halaman beranda kami.</p>
				
				<button onClick={() => navigate('/')} class="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700">back to homepage</button>
			</div>
			<div class="max-w-md">
				<img src={'/404.jpeg'} alt="404.jpeg"/>
			</div>
		</div>
		</div>
		<Footer />
		</div>
    </>
  );
};

export default Page404;
