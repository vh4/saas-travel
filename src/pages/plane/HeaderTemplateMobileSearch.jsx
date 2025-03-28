import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseTanggal } from "../../helpers/date";
import { SlArrowRight } from "react-icons/sl";
import { BsArrowLeft } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi2";

export default function HeaderTemplateMobileSearch({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

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
      <div className="w-full fixed z-50 bg-white border-b border-gray-200">
        <div className="block xl:hidden">
          <div className="grid grid-cols-12 w-full text-black px-4 py-2">
            <div className="flex items-center">
              <div className="mr-auto" onClick={() => window.history.back()}>
                <BsArrowLeft className="text-gray-800" size={20} />
              </div>
            </div>
            <div className="col-span-10 flex flex-col items-center text-center mx-auto mt-2">
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
            <div className="col-span-1 mr-auto flex items-center justify-end cursor-pointer" onClick={() => navigate('/')}>
                <HiOutlineHome className="text-gray-700" size={23} />
              </div>
            <div className="ml-auto"></div>
          </div>
        </div>
      </div>
      <div className="flex-grow mt-16">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
      {/* Footer */}
    </div>
  );
}
