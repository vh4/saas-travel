import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseTanggal } from "../../helpers/date";
import {SlArrowRight} from 'react-icons/sl'
import { BsArrowLeft } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi2";

export default function HeaderTemplateMobileSearch({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

  const date = searchParams.get("date");
  const stasiunBerangkat = searchParams.get("stasiunBerangkat");
  const stasiunTujuan = searchParams.get("stasiunTujuan");
  const adult = searchParams.get("adult");
  const infant = searchParams.get("infant");

  const tanggal_keberangkatan_kereta = parseTanggal(date);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full fixed z-50 bg-white border-b border-gray-200">
        <div className="block xl:hidden">
          <div className="grid grid-cols-12 w-full text-black px-4 py-2">
            <div className="col-span-1 flex items-center space-x-4 cursor-pointer"> 
              <div className="mr-auto" onClick={() => window.history.back()}>
                <BsArrowLeft size={22} />
              </div>
            </div>
            <div className="col-span-10 flex flex-col items-center text-center mx-auto mt-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{stasiunBerangkat.length > 12 ? stasiunBerangkat.slice(0,12) + '...' : stasiunBerangkat}</span>
                <SlArrowRight className="text-blue-500" size={15} />
                <span>{stasiunTujuan.length > 12 ? stasiunTujuan.slice(0,12) + '...' : stasiunTujuan}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <small>
                  {tanggal_keberangkatan_kereta} ~ {" "}
                  {parseInt(adult) + parseInt(infant)}{" "}
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
