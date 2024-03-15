import React, { useState, useContext } from "react";
import { FaUserCircle, FaListAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import axios from "axios";
import { notification } from "antd";
import { IoExitOutline } from "react-icons/io5";
import { LogoutContent } from "../../../../App";
import { AiOutlineAppstore } from "react-icons/ai";

export default function SidebarMobileUser({ pathSidebar }) {
  const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
  const [dropdownBooking, setDropdownBooking] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { setLogout } = useContext(LogoutContent);
  const navigate = useNavigate();

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

        setLogout({
          type: "LOGOUT",
        });

        navigate("/logout");

      });
  }

  return (
    <aside className="w-full" aria-label="Sidebar">
        {contextHolder}
      <div className="mt-4">
        <ul className="mt-0 space-y-2 relative">
          <>
            <div
              onClick={(e) =>
                dropdownTransaksi === true
                  ? setDropdownTransaksi(false)
                  : setDropdownTransaksi(true)
              }
              className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg `}
            >
              <div className="flex items-center">
                <AiOutlineAppstore className="text-black" size={18} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  List Transaksi
                </span>
              </div>
              {dropdownTransaksi ? (
                <MdOutlineKeyboardArrowDown
                  className="text-black"
                  size={18}
                />
              ) : (
                <MdOutlineKeyboardArrowUp className="text-black" size={18} />
              )}
            </div>
            <div className={`${!dropdownTransaksi ? "block" : "hidden"}`}>
              <Link
                to="/transaksi/kai"
                className={` block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-base text-left font-normal">
                  Kereta
                </div>
              </Link>
              <Link
                to="/transaksi/pesawat"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-left text-base font-normal">
                  Pesawat
                </div>
              </Link>
              <Link
                to="/transaksi/pelni"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-left text-base font-normal">
                  Pelni
                </div>
              </Link>
              <Link
                to="/transaksi/dlu"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-left text-base font-normal">
                  Kapal Dlu
                </div>
              </Link>
            </div>

            {/* <div
              onClick={(e) =>
                dropdownBooking === true
                  ? setDropdownBooking(false)
                  : setDropdownBooking(true)
              }
              className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg `}
            >
              <div className="flex items-center">
                <FaListAlt className="text-blue-500" size={18} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  List Booking
                </span>
              </div>
              {dropdownBooking ? (
                <MdOutlineKeyboardArrowDown
                  className="text-black"
                  size={18}
                />
              ) : (
                <MdOutlineKeyboardArrowUp className="text-black" size={18} />
              )}
            </div> */}
            {/* <div className={`${!dropdownBooking ? "block" : "hidden"}`}>
              <Link
                to="/booking/kai"
                className="block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black"
              >
                <div className="text-black text-left text-base font-normal">
                  Booking Kai
                </div>
              </Link>
              <Link
                to="/booking/pesawat"
                className="block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black"
              >
                <div className="text-black text-left text-base font-normal">
                  Booking Pesawat
                </div>
              </Link>
              <Link
                to="/booking/pelni"
                className="block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black"
              >
                <div className="text-black text-left text-base font-normal">
                  Booking Pelni
                </div>
              </Link>
            </div> */}
            <Link onClick={LogoutHandler}>
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg `}
              >
                {localStorage.getItem('hdrs_c') != 'false' && (
                  <>
                    <div className="flex mt-2">
                      <IoExitOutline className="text-blue-500" size={20} />
                      <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
                    </div>
                  </>
                )}
              </div>
            </Link>
          </>
        </ul>
      </div>
    </aside>
  );
}
