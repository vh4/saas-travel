import React from "react";
import { IoArrowBack, IoArrowForwardCircle } from "react-icons/io5";
import { MdHorizontalRule } from "react-icons/md";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";

export default function HeaderTemplateMobileBooking({ children }) {

  return (
    <div className="flex flex-col min-h-screen">
      <div>
      <div className="block md:hidden mb-4">
        <div className="flex items-center w-full text-black px-2 py-[18px]">
            <div className="ml-2" onClick={() => window.history.back()}>
                <IoArrowBack size={24} />
            </div>
            <div className="flex flex-col items-center justify-center text-center mx-auto">
                <div className="flex space-x-2 items-center justify-center  text-md">
                <div className="flex justify-start jalur-payment-booking text-xs space-x-2 items-center">
              <div className="flex space-x-2 items-center">
                <RxCrossCircled size={18} className="text-black" />
                <div className="block xl:hidden text-black ">
                  Booking
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <RxCrossCircled size={18} className="text-black" />
                <div className="block xl:hidden text-black ">
                  Konfirmasi
                </div>
              </div>
              <div className="flex space-x-2 items-center ">
                <RxCrossCircled size={18} className="text-black" />
                <div className="block xl:hidden text-black">Payment</div>
              </div>
            </div>
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
