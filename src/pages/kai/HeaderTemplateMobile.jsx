import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { TiketContext } from "../../App";

export default function HeaderTemplateMobile({ children, type }) {

  const { pay, dispatch } = React.useContext(TiketContext);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <div className="block md:hidden mb-5">
          <div className="flex space-x-16 items-center w-full text-black px-2 py-[18px] overflow-x-auto whitespace-nowrap">
            <div className="ml-2 flex-shrink-0" onClick={() => window.history.back()}>
              <div className="flex space-x-2 items-center">
                <BsArrowLeft size={18} />
                <div className="text-md font-medium">Previous</div>
              </div>
            </div>
            <div className="flex space-x-6 items-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 items-center flex-shrink-0">
                <div className="py-0.5 px-2 bg-blue-500 text-white text-xs rounded-full">
                  1
                </div>
                <div className="text-xs">Isi Data</div>
              </div>
              <div className="block min-w-[30px] min-h-[2px] bg-gray-300 text-white"></div>
              <div className="flex space-x-2 items-center flex-shrink-0">
                <div className={`py-0.5 px-2 ${type == 'bayar' ? 'bg-blue-500' : 'bg-gray-500'}  text-white text-xs rounded-full`}>
                  2
                </div>
                <div className="text-xs">Bayar</div>
              </div>
              <div className="block min-w-[30px] min-h-[2px] bg-gray-300"></div>
              <div className="flex space-x-2 items-center flex-shrink-0">
                <div className={`py-0.5 px-2 ${pay.isPayed === true ? 'bg-blue-500' : 'bg-gray-500'}  text-white text-xs rounded-full`}>
                  3
                </div>
                <div className="text-xs">Selesai</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
