import React from "react";
import Footer from "../../pages/partials/Footer";

const ManyRequest = () => {

  return (
    <>
		<div className="flex flex-col min-h-screen">
		<div class="flex-grow flex items-center">
			<div class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
				<div class="max-w-md">
					<div class="text-5xl font-dark font-bold">429</div>
					<p
					class="text-2xl md:text-3xl font-light leading-normal"
					>Maaf, Terlalu banyak request. </p>
				<p class="mb-8">Jangan khawatir, Silahkan tekan tombol dibawah untuk reload page.</p>
				
				<button onClick={() => window.location.reload()} class="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700">back to book</button>
			</div>
			<div class="max-w-md">
				<img src={'/manyrequest.jpeg'} alt="manyrequest.jpeg.jpeg"/>
			</div>
		</div>
		</div>
		<Footer />
		</div>
    </>
  );
};

export default ManyRequest;
