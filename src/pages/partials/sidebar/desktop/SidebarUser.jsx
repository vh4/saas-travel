import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { IoGridOutline } from "react-icons/io5";
import { IoAirplaneOutline, IoBoatOutline } from "react-icons/io5";
import { BsTrainFront } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataType } from "../../../../features/dataTypeSlice";
import Skeleton from "react-loading-skeleton";
import { CiBoxList } from "react-icons/ci";

export default function SidebarUser({ pathSidebar }) {
  const [dropdownTransaksi, setDropdownTransaksi] = useState(false);

  const dispatch = useDispatch();
  const type = useSelector((state) => state.type.data.type);
  const isLoading = useSelector((state) => state.type.isLoading);
  const location = useLocation();
  // Get the last segment of the path
  let lastSegment = location.pathname.split("/").filter(Boolean).pop();
      lastSegment = lastSegment == 'kai' ? 'kereta' : lastSegment;

  useEffect(() => {

    dispatch(fetchDataType());

  }, [dispatch, type]); //

  const user =
    localStorage.getItem("v_") != "undefined" &&
    localStorage.getItem("v_") !== null
      ? JSON.parse(localStorage.getItem("v_"))
      : null;

  useEffect(() => {
    if (user === null || user === undefined) {
      userProfile();
    }
  }, [user]);

  const userProfile = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/app/account`,
      {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    if (response.data && response.data.rc == "00") {
      localStorage.setItem(
        "v_",
        JSON.stringify({
          namaPemilik: response.data.data.namaPemilik,
        })
      );
    }
  };

  return (
    <aside
      className="mt-6  hidden md:block w-full md:w-full xl:w-72 border-r "
      aria-label="Sidebar"
    >
      <div className="px-8 py-2 flex space-x-4 items-center text-black">
        <IoGridOutline size={20} className="text-black" />
        <div>List Transaksi</div>
      </div>
      <div className="flex mb-8 justify-start overflow-y-auto py-4 rounded  h-full ">
        <ul className="px-8 md:mt-0 space-y-2 relative">
        
        {(isLoading || type === 'auth' || type === 'pesawat') && (
          <li className="">
            {isLoading ? (
                <Skeleton height={20} width={150} />
            ) : (
              <Link to="/transaksi/pesawat">
              <div
                onClick={(e) =>
                  dropdownTransaksi === true
                    ? setDropdownTransaksi(false)
                    : setDropdownTransaksi(true)
                }
                className={`${
                  pathSidebar === "/transaksi/pesawat"
                    ? "border-l-4 border-cyan-500"
                    : ""
                } flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black  hover:border-l-4 border-cyan-500 `}
              >
                <div className="flex items-center">
                  <IoAirplaneOutline className="text-back" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap text-sm">
                    Pesawat
                  </span>
                </div>
              </div>
            </Link>
            )}
          </li>
          )}  

          {(isLoading || type === 'auth' || type === 'kereta') && (
          <li className="">
          {isLoading ? (
                <Skeleton height={20} width={150} />
            ) : (
              <Link to="/transaksi/kai">
              <div
                onClick={(e) =>
                  dropdownTransaksi === true
                    ? setDropdownTransaksi(false)
                    : setDropdownTransaksi(true)
                }
                className={`${
                  pathSidebar === "/transaksi/kai"
                    ? "border-l-4 border-cyan-500"
                    : ""
                } flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black  hover:border-l-4 border-cyan-500 `}
              >
                <div className="flex items-center">
                  <BsTrainFront className="text-black" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap text-sm">
                    Kereta
                  </span>
                </div>
              </div>
            </Link>
            )}
          </li>
          )} 

          {(isLoading || type === 'auth' || type === 'pelni') && (
          <li className="">
            {isLoading ? (
                <Skeleton height={20} width={150} />
            ) : (
              <Link to="/transaksi/pelni">
              <div
                onClick={(e) =>
                  dropdownTransaksi === true
                    ? setDropdownTransaksi(false)
                    : setDropdownTransaksi(true)
                }
                className={`${
                  pathSidebar === "/transaksi/pelni"
                    ? "border-l-4 border-cyan-500"
                    : ""
                } flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black  hover:border-l-4 border-cyan-500 `}
              >
                <div className="flex items-center">
                  <IoBoatOutline className="text-black" size={20} />
                  <span className="flex-1 ml-3 whitespace-nowrap text-sm">
                    Kapal Pelni
                  </span>
                </div>
              </div>
            </Link>
            )}
          </li>
          )} 

          <div className="border-b"></div>
          <li className="block">
            <Link to="/transaksi/history_idpel">
              <div
                onClick={(e) =>
                  dropdownTransaksi === true
                    ? setDropdownTransaksi(false)
                    : setDropdownTransaksi(true)
                }
                className={`${
                  pathSidebar === "/transaksi/history_idpel"
                    ? "border-l-4 border-cyan-500"
                    : ""
                } flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black  hover:border-l-4 border-cyan-500 `}
              >
                <div className="flex items-center">
                  <CiBoxList className="text-black" size={18} />
                  <span className="flex-1 ml-3 whitespace-nowrap text-sm">
                    List Penumpang
                  </span>
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
