import React, { useState, useEffect } from "react";
import { FaUserCircle, FaListAlt, FaInbox } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import axios from "axios";
import { Button, notification } from "antd";
import { MdOutlineTrain } from "react-icons/md";
import { GiCommercialAirplane } from "react-icons/gi";
import { IoBoatOutline, IoExitOutline } from "react-icons/io5";

export default function SidebarMobileUser({ pathSidebar }) {
  const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
  const [dropdownBooking, setDropdownBooking] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const suksesLogout = () => {
    api["success"]({
      message: "Successfully!",
      description: "Successfully, anda berhasil logout.",
    });
  };

  const LogoutHandler = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      })
      .then(() => {
        localStorage.clear();
        suksesLogout();
      });
  }

  return (
    <aside className="w-full" aria-label="Sidebar">
        {contextHolder}
      <div className="mt-4">
        <ul className="mt-0 space-y-2 relative">
          <>
            <Link to="/profile/view">
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
              >
                <div className="flex">
                  <FaUserCircle className="text-orange-500" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                </div>
              </div>
            </Link>

            <div
              onClick={(e) =>
                dropdownTransaksi === true
                  ? setDropdownTransaksi(false)
                  : setDropdownTransaksi(true)
              }
              className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
            >
              <div className="flex items-center">
                <FaListAlt className="text-cyan-500" size={18} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  List Transaksi
                </span>
              </div>
              {dropdownTransaksi ? (
                <MdOutlineKeyboardArrowDown
                  className="text-gray-500"
                  size={18}
                />
              ) : (
                <MdOutlineKeyboardArrowUp className="text-gray-500" size={18} />
              )}
            </div>
            <div className={`${!dropdownTransaksi ? "block" : "hidden"}`}>
              <Link
                to="/transaksi/kai"
                className={` block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}
              >
                <div className="text-gray-500 text-left text-base font-normal">
                  Transaksi Kai
                </div>
              </Link>
              <Link
                to="/transaksi/pesawat"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}
              >
                <div className="text-gray-500 text-left text-base font-normal">
                  Transaksi Pesawat
                </div>
              </Link>
            </div>

            <div
              onClick={(e) =>
                dropdownBooking === true
                  ? setDropdownBooking(false)
                  : setDropdownBooking(true)
              }
              className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
            >
              <div className="flex items-center">
                <FaListAlt className="text-blue-500" size={18} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  List Booking
                </span>
              </div>
              {dropdownBooking ? (
                <MdOutlineKeyboardArrowDown
                  className="text-gray-500"
                  size={18}
                />
              ) : (
                <MdOutlineKeyboardArrowUp className="text-gray-500" size={18} />
              )}
            </div>
            <div className={`${!dropdownBooking ? "block" : "hidden"}`}>
              <Link
                to="/booking/kai"
                className="block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500"
              >
                <div className="text-gray-500 text-left text-base font-normal">
                  Booking Kai
                </div>
              </Link>
              <Link
                to="/booking/pesawat"
                className="block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500"
              >
                <div className="text-gray-500 text-left text-base font-normal">
                  Booking Pesawat
                </div>
              </Link>
            </div>
            <Link to="/kai">
              <div
                className={`mt-2 mb-2 flex cursor-pointer items-center p-1 text-base font-normal text-gray-500 rounded-lg `}
              >
                <div className="flex">
                  <MdOutlineTrain className="text-fuchsia-500" size={24} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Kereta</span>
                </div>
              </div>
            </Link>
            <Link to="/pesawat">
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
              >
                <div className="flex">
                  <GiCommercialAirplane className="text-blue-500" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Pesawat</span>
                </div>
              </div>
            </Link>
            <Link to="/pelni">
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
              >
                <div className="flex">
                  <IoBoatOutline className="text-red-500" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Kapal</span>
                </div>
              </div>
            </Link>
            <Link onClick={LogoutHandler}>
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg `}
              >
                <div className="flex mt-2">
                  <IoExitOutline className="text-blue-500" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
                </div>
              </div>
            </Link>
          </>
        </ul>
      </div>
    </aside>
  );
}
