import React from "react";
import { IoArrowBack, IoArrowForwardCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { parseTanggal } from "../../helpers/date";
import {TfiArrowCircleLeft} from 'react-icons/tfi'
import { SlArrowRight } from "react-icons/sl";
import { BsArrowLeft } from "react-icons/bs";

export default function HeaderTemplateMobileSearch({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  let departureDate, departureName, arrivalName, adult, child, infant;

  departureDate = searchParams.get("departureDate")
    ? searchParams.get("departureDate")
    : null;
  departureName = searchParams.get("departureName")
    ? searchParams.get("departureName")
    : null;
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
          <div className="flex items-center w-full text-black px-4 py-2">
            <div className="mr-auto" onClick={() => window.history.back()}>
              <BsArrowLeft className="text-gray-800" size={20} />
            </div>
            <div className="flex flex-col items-center text-center mx-auto mt-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{departureName.length > 12 ? departureName.slice(0,12) + '...' : departureName}</span>
                <SlArrowRight className="text-blue-500" size={15} />
                <span>{arrivalName.length > 12 ? arrivalName.slice(0,12) + '...' : arrivalName}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <small>
                  {tanggal_keberangkatan} ~ {" "}
                  {parseInt(adult) + parseInt(child) + parseInt(infant)}{" "}
                  Penumpang
                </small>
              </div>
            </div>
            <div className="ml-auto"></div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
      {/* Footer */}
    </div>
  );
}
