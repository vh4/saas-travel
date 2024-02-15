import React from "react";
import { IoArrowBack, IoArrowForwardCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { parseTanggal, parseTanggalPelni } from "../../helpers/date";

export default function HeaderTemplateMobileSearch({ children }) {

	const [searchParams, setSearchParams] = useSearchParams();

	let departure,
  departureDate,
	departureName,
	arrival,
	arrivalName,
	adult,
	child,
	infant;

  const origin = searchParams.get("origin");
  const originName = searchParams.get("originName");

  const destination = searchParams.get("destination");
  const destinationName = searchParams.get("destinationName");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const laki = searchParams.get("laki");
  const wanita = searchParams.get("wanita");
 
  const tanggal_keberangkatan = parseTanggalPelni(startDate);
  const tanggal_tujuan = parseTanggalPelni(endDate);


  return (
    <div className="flex flex-col min-h-screen">
      <div>
      <div className="block md:hidden">
        <div className="flex items-center w-full bg-blue-500 text-white p-2.5 fixed z-50">
            <div onClick={() => window.history.back()} className="ml-2">
                <IoArrowBack size={24} />
            </div>
            <div className="flex flex-col items-center justify-center text-center mx-auto">
                <div className="flex space-x-4 items-center justify-center  text-md">
                    <div>{originName.split('(')[0]}</div>
                    <IoArrowForwardCircle size={24} className="block " />
                    <div>{destinationName.split('(')[0]}</div>
                </div>
                <div className="text-xs">
                    <small>{tanggal_keberangkatan} s.d {tanggal_tujuan} | {parseInt(laki) + parseInt(wanita)}{" "} Penumpang</small>
                </div>
            </div>
        </div>
      </div>
      </div>
      <div className="flex-grow mt-8">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
      {/* <footer className="border-t text-sm text-black py-6">
        <div className="container mx-auto">
          <p className="text-center">
            © 2015-2023 rajabiller.com. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
