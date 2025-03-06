import {
    IoAirplaneOutline,
    IoBoatOutline,
    IoBoatSharp,
    IoTrainOutline,
  } from "react-icons/io5";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import Skeleton from "react-loading-skeleton";
  import "react-loading-skeleton/dist/skeleton.css";
  import { fetchDataType } from "../../../../features/dataTypeSlice";
  import { useSearchParams } from "react-router-dom";
  import axios from "axios";
  
  export default function SideBarMobile({ nameMenu, setNameMenu }) {
    const dispatch = useDispatch();
    const type = useSelector((state) => state.type.data.type);
    const isLoading = useSelector((state) => state.type.isLoading);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlForLogin = window.location.pathname;
    const [whitelistDLU, setWhiteListdlu] = useState(0);
  
    async function fetchDLUWhiteList() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_HOST_API}/travel/dlu_whitelist`
        );
        setWhiteListdlu(data.type);
      } catch (error) {
        console.error("Error fetching DLU WhiteList:", error);
      }
    }
  
    useEffect(() => {
      if (urlForLogin === "/" && searchParams.size == 0) {
        dispatch(fetchDataType());
      }
  
      fetchDLUWhiteList();
    }, [dispatch]);
  
    return (
      <aside className="w-full" aria-label="Sidebar">
        <div className="mt-4 md:mt-0 -mb-4 md:mb-0 flex justify-center w-full overflow-y-auto py-4 px-1">
          <ul className="p-4 w-full grid grid-cols-4 gap-2">
            {(isLoading || type === "auth" || type === "pesawat") && (
              <li>
                {isLoading ? (
                  <Skeleton height={50} width={60} />
                ) : (
                  <div
                    onClick={() => setNameMenu("pesawat")}
                    className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${
                      nameMenu === "pesawat" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    <div className="bg-gray-100 mx-4 py-3 flex justify-center rounded-xl">
                      <IoAirplaneOutline className="text-red-500" size={24} />
                    </div>
                    <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black ">
                      Pesawat
                    </span>
                  </div>
                )}
              </li>
            )}
  
            {(isLoading || type === "auth" || type === "kereta") && (
              <li>
                {isLoading ? (
                  <Skeleton height={50} width={60} />
                ) : (
                  <div
                    onClick={() => setNameMenu("kereta")}
                    className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${
                      nameMenu === "kereta" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    <div className="bg-gray-100 mx-4 py-3 flex justify-center rounded-xl">
                      <IoTrainOutline className="text-orange-500" size={24} />
                    </div>
                    <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">
                      Kereta Api
                    </span>
                  </div>
                )}
              </li>
            )}
            {(isLoading || type === "auth" || type === "pelni") && (
              <li>
                {isLoading ? (
                  <Skeleton height={50} width={60} />
                ) : (
                  <div
                    onClick={() => setNameMenu("pelni")}
                    className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${
                      nameMenu === "pelni" ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    <div className="bg-gray-100 mx-4 py-3 flex justify-center rounded-xl">
                      <IoBoatOutline className="text-fuchsia-500" size={24} />
                    </div>
                    <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">
                      Pelni
                    </span>
                  </div>
                )}
              </li>
            )}
            {whitelistDLU === 1 && (
              <li>
                <div
                  onClick={() => setNameMenu("dlu")}
                  className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${
                    nameMenu === "dlu" ? "border-b-2 border-blue-500" : ""
                  }`}
                >
                  <div className="bg-gray-100 mx-4 py-3 flex justify-center rounded-xl">
                    <IoBoatSharp className="text-green-500" size={24} />
                  </div>
                  <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">
                    Dlu
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </aside>
    );
  }
  