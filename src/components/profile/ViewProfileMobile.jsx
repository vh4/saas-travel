import React from "react";
import { CiBookmarkCheck, CiCircleList } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { PiTicketThin } from "react-icons/pi";

export default function ProfileMobile() {
  return (
    <>
      {/* Background & Image */}
      <div
        className="min-w-max relative min-h-[200px] overflow-hidden"
        style={{
          background: `
            linear-gradient(90deg, rgba(191,190,204,1) 21%, rgba(208,208,219,1) 61%, rgba(248,254,255,1) 83%)
          `,
        }}
      >
        <img
          src="/back.jpg"
          alt="Profile Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>


      {/* Content Container */}
      <div className="-mt-32">
        <div className="relative z-10 flex justify-center">
          <div className="p-5 w-full max-w-xl xl:w-1/2">
            <div className="bg-gray-100 flex p-4 h-full items-center border-t border-gray-200 shadow-md rounded-lg">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
                viewBox="0 0 24 24"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <path d="M22 4L12 14.01l-3-3"></path>
              </svg>
              <span className="font-medium">
                Welcome, Aplikasi travel v1.0.0
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <div className="relative z-10 flex justify-center">
          <div className="mx-4 p-5 w-full max-w-xl bg-white border-t border-gray-200 shadow-md rounded-lg">
            <ul className="list-none space-y-2">
              {/* Booking Saya */}
              <a href="/booking" className="block">
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CiBookmarkCheck size={24} className="text-blue-500" />
                    <span className="text-sm text-gray-900">Booking Saya</span>
                  </div>
                  <IoIosArrowForward size={24} className="text-gray-600" />
                </div>
              </a>

              {/* E-Ticket */}
              <a href="/transaksi" className="block">
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <PiTicketThin size={24} className="text-blue-500" />
                    <span className="text-sm text-gray-900">E-Ticket</span>
                  </div>
                  <IoIosArrowForward size={24} className="text-gray-600" />
                </div>
              </a>

              {/* List Penumpang */}
              <a href="/transaksi/history_idpel" className="block">
                <div className="p-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CiCircleList size={24} className="text-blue-500" />
                    <span className="text-sm text-gray-900">List Penumpang</span>
                  </div>
                  <IoIosArrowForward size={24} className="text-gray-600" />
                </div>
              </a>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
