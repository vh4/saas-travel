import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { parseDate } from "../../helpers/date";
import {SlArrowRight} from 'react-icons/sl'

export default function HeaderTemplateMobileSearch({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const originName = searchParams.get("originName");
  const destinationName = searchParams.get("destinationName");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const laki = searchParams.get("laki");
  const wanita = searchParams.get("wanita");
  const tanggal_keberangkatan = parseDate(startDate);
  const tanggal_tujuan = parseDate(endDate);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <div className="block md:hidden">
          <div className="flex items-center w-full text-black px-4 py-2">
            <div className="mr-auto" onClick={() => window.history.back()}>
              <IoArrowBack size={22} />
            </div>
            <div className="flex flex-col items-center text-center mx-auto mt-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{originName.length > 12 ? originName.slice(0,12) + '...' : originName}</span>
                <SlArrowRight className="text-blue-500" size={15} />
                <span>{destinationName.length > 12 ? destinationName.slice(0,12) + '...' : destinationName}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <small>
                {tanggal_keberangkatan} s.d {tanggal_tujuan} ⍟{" "}
                  {parseInt(laki) + parseInt(wanita)}{" "}
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
