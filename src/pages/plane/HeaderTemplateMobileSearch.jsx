import React from "react";
import { IoArrowBack, IoArrowForwardCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { parseTanggal } from "../../helpers/date";

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

	departure = searchParams.get("departure")
	? searchParams.get("departure")
	: null;

  departureDate = searchParams.get("departureDate")
	? searchParams.get("departureDate")
	: null;

	departureName = searchParams.get("departureName")
	? searchParams.get("departureName")
	: null;
	arrival = searchParams.get("arrival") ? searchParams.get("arrival") : null;
	arrivalName = searchParams.get("arrivalName")
	? searchParams.get("arrivalName")
	: null;

	adult = searchParams.get("adult") ? searchParams.get("adult") : 0;
	child = searchParams.get("child") ? searchParams.get("child") : 0;
	infant = searchParams.get("infant") ? searchParams.get("infant") : 0;
  
  const tanggal_keberangkatan = parseTanggal(departureDate);


  return (
    <div className="flex flex-col min-h-screen">
      <div>
      <div className="block md:hidden">
        <div className="flex items-center w-full bg-blue-500 text-white p-2 fixed z-50">
            <div className="ml-2" onClick={() => window.history.back()}>
                <IoArrowBack size={24} />
            </div>
            <div className="flex flex-col items-center justify-center text-center mx-auto">
                <div className="flex space-x-4 items-center justify-center font-bold text-md">
                    <div>{departureName} ({departure})</div>
                    <IoArrowForwardCircle size={24} className="block font-bold" />
                    <div>{arrivalName} ({arrival})</div>
                </div>
                <div className="text-xs font-semibold">
                    <small>{tanggal_keberangkatan} | {parseInt(adult) + parseInt(child) + parseInt(infant)}{" "} Penumpang</small>
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
      <footer className="border-t text-sm text-gray-500 py-6">
        <div className="container mx-auto">
          <p className="text-center">
            © 2015-2023 rajabiller.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
