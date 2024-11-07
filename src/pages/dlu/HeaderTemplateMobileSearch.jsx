import React from "react";
import { IoArrowBack, IoArrowForwardCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { parseTanggal } from "../../helpers/date";

export default function HeaderTemplateMobileSearch({ children }) {

	const [searchParams, setSearchParams] = useSearchParams();
  const originName = searchParams.get("origin_name");
  const destinationName = searchParams.get("destination_name");
  const startDate = searchParams.get("start_date");

  // const adult = searchParams.get("adult");
  // const child = searchParams.get("child");
  // const infant = searchParams.get("infant");
  // const count_passangers_name = searchParams.get("count_passangers_name");
  

  return (
    <div className="flex flex-col min-h-screen">
      <div>
      <div className="block md:hidden">
        <div className="flex  justify-center items-center w-full text-black p-2.5">
            <div className="ml-2" onClick={() => window.history.back()}>
                <IoArrowBack size={22} />
            </div>
            <div className="flex flex-col items-center justify-center text-center mx-auto">
                <div className="flex space-x-4 items-center justify-center text-xs">
                    <div>{originName}</div>
                    <IoArrowForwardCircle size={24} className="block text-blue-500" />
                    <div>{destinationName}</div>
                </div>
                <div className="text-xs">
                    <small>{parseTanggal(startDate)}</small>
                </div>
                {/* <div className="text-xs">
                 {(parseInt(adult) + parseInt(child) + parseInt(infant)) !== 0 && (
                    <>
                      <small>{parseInt(adult) + parseInt(child) + parseInt(infant)} penumpang</small>
                    </>)}
                    {count_passangers_name > 0 && (
                    <>
                      <small> | </small>
                      <small>{count_passangers_name} kendaraan</small>
                    </>)}
                </div> */}
            </div>
        </div>
      </div>
      </div>
      <div className="flex-grow">
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
