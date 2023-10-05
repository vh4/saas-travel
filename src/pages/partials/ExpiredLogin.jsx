import React from "react";
import { useNavigate } from "react-router";
import Footer from "./Footer";

const ExpiredLogin = () => {

	const navigate = useNavigate();

	return(
		<>
			<div className="flex flex-col min-h-screen">
			<div class="flex-grow flex items-center">
				<div class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
					<div class="max-w-md">
						<div class="text-5xl font-dark font-bold">401</div>
						<p
						class="text-2xl md:text-3xl font-light leading-normal"
						>Maaf, session sudah habis. </p>
					<p class="mb-8">Session anda sudah expired, silahkan login kembali.</p>
					
					<button onClick={() => navigate('/')} class="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700">back to homepage</button>
				</div>
				<div class="max-w-md">
					<img src={'/expired.jpeg'} alt="expired.jpeg"/>
				</div>
			</div>
			</div>
			<Footer />
			</div>
		</>
	)
}

export default ExpiredLogin