import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import axios from "axios";
import { notification } from "antd";
import { IoExitOutline } from "react-icons/io5";
import { LogoutContent } from "../../../../App";
import { AiOutlineAppstore } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { fetchDataType } from "../../../../features/dataTypeSlice";

export default function SidebarMobileUser() {
  const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { setLogout } = useContext(LogoutContent);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const type = useSelector((state) => state.type.data.type);
  const isLoading = useSelector((state) => state.type.isLoading);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const urlForLogin = window.location.pathname;

  const location = useLocation();
  // Get the last segment of the path
  let lastSegment = location.pathname.split("/").filter(Boolean).pop();
      lastSegment = lastSegment == 'kai' ? 'kereta' : lastSegment;

  useEffect(() => {

        dispatch(fetchDataType());
    
      }, [dispatch, type]); //

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
  };

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
                <MdOutlineKeyboardArrowDown className="text-black" size={18} />
              ) : (
                <MdOutlineKeyboardArrowUp className="text-black" size={18} />
              )}
            </div>
            <div className={`${!dropdownTransaksi ? "block" : "hidden"}`}>
              {(isLoading || type === "auth" || type === "kereta") && (
                <div className="">
                  {isLoading ? (
                    <Skeleton height={20} width={150} />
                  ) : (
                    <Link
                      to="/transaksi/kai"
                      className={` block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
                    >
                      <div className="text-black text-base text-left font-normal">
                        Kereta
                      </div>
                    </Link>
                  )}
                </div>
              )}
              {(isLoading || type === "auth" || type === "pesawat") && (
                <div className="">
                  {isLoading ? (
                    <Skeleton height={20} width={150} />
                  ) : (
                    <Link
                      to="/transaksi/pesawat"
                      className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
                    >
                      <div className="text-black text-left text-base font-normal">
                        Pesawat
                      </div>
                    </Link>
                  )}
                </div>
              )}
              {(isLoading || type === "auth" || type === "pelni") && (
                <div className="">
                  {isLoading ? (
                    <Skeleton height={20} width={150} />
                  ) : (
                    <Link
                      to="/transaksi/pelni"
                      className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
                    >
                      <div className="text-black text-left text-base font-normal">
                        Pelni
                      </div>
                    </Link>
                  )}
                </div>
              )}
              <Link
                to="/transaksi/history_idpel"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-left text-base font-normal">
                  Data Penumpang
                </div>
              </Link>
              {/* <Link
                to="/transaksi/dlu"
                className={`block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}
              >
                <div className="text-black text-left text-base font-normal">
                  Kapal Dlu
                </div>
              </Link> */}
            </div>
            <Link onClick={LogoutHandler}>
              <div
                className={`flex cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg `}
              >
                {localStorage.getItem("hdrs_c") != "false" && (
                  <>
                    <div className="flex mt-2">
                      <IoExitOutline className="text-blue-500" size={20} />
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Logout
                      </span>
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
