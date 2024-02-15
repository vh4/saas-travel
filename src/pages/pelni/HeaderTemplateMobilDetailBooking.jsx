import React from "react";
import { IoArrowBack, IoArrowForwardCircle, IoCheckmarkCircle } from "react-icons/io5";
import { MdHorizontalRule } from "react-icons/md";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";

export default function HeaderTemplateMobilDetailBooking({ children }) {

  return (
    <div className="flex flex-col min-h-screen">
      <div>
      <div className="block md:hidden mb-8">
        <div className="flex items-center w-full bg-blue-500 text-white px-2 py-[18px] fixed z-50">
            <div className="ml-2" onClick={() => window.history.back()}>
                <IoArrowBack size={24} />
            </div>
            <div className="flex flex-col items-center justify-center text-center mx-auto">
                <div className="items-center justify-center  text-md">
                <div className="flex justify-start jalur-payment-booking text-xs space-x-2 items-center">
              <div className="flex space-x-2 items-center">
                <IoCheckmarkCircle size={18} className="text-white" />
                <div className="block xl:hidden text-white ">
                  Cari Jadwal
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <IoCheckmarkCircle size={18} className="text-white" />
                <div className="block xl:hidden text-white ">
                  Booking
                </div>
              </div>
              <div className="flex space-x-2 items-center ">
                <RxCrossCircled size={18} className="text-white" />
                <div className="block xl:hidden text-white">Payment</div>
              </div>
            </div>
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
