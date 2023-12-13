//make create function reactjs

import Layout from "../Layout";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import Sidebar from "../partials/sidebar/desktop/Sidebar";
import SideBarMobile from "../partials/sidebar/mobile/SideBarMobile";
import React, { useContext, useEffect, useState } from "react";
import Carousels from "../../components/carousel/Carousel";
import CarouselsMobile from "../../components/carousel/CarouselMobile";
import axios from "axios";
import dayjs, { isDayjs } from "dayjs";

import Pelni from "../../components/pelni/Pelni";
import CarouselsTablet from "../../components/carousel/CarouselTablet";
import { useSearchParams } from "react-router-dom";
import { notification } from "antd";
import { LoginContent } from "../../App";

export default function MainPage() {
  const [nameMenu, setNameMenu] = useState("plane");
  useEffect(() => {
    document.title = "Travel kereta, pesawat, dan pelni";
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlForLogin = window.location.pathname;
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState(false);

  const { loginComponent, setLoginComponent } = useContext(LoginContent);

  useEffect(() => {
    //
    const fetchData = async () => {
      try {
        if (
          urlForLogin === "/" &&
          searchParams.get("auth") !== null &&
          searchParams.get("auth") !== ""
        ) {
            
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const urlEncode = encodeURIComponent(urlParams.get('auth')).split('%20').join('+');
          const decodedParam = decodeURIComponent(urlEncode);
          handlerLogin(decodedParam, searchParams.get("merchant"));
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handlerLogin = async (auth, merchant) => {
    try {
      setLoading(true);

      await axios
        .post(`${process.env.REACT_APP_HOST_API}/travel/app/redirect`, {
          auth: auth,
          merchant:merchant
        })
        .then((data) => {
          if (data.data.rc === "00") {
            setLoginComponent({
              type: "NAVIGATION",
              setShowModal: false,
              setLogin: true,
            });

            setLoading(false);
            localStorage.setItem(
              process.env.REACT_APP_SECTRET_LOGIN_API,
              JSON.stringify(data.data.token)
            );

            // suksesLogin();
            localStorage.setItem("expired_date", data.data.expired_date);
            localStorage.setItem("c_at", dayjs());
            localStorage.setItem("hdrs_c", data.data.is_header_name_and_toast);
            localStorage.setItem("c_name", data.data.username);

          } else {
            // gagalLogin(data.data.rd);
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* carousel fitur  */}
      {contextHolder}
      <div className="w-full">
        <div className="xl:bg-gradient-to-r xl:from-cyan-500 xl:to-blue-500">
          <div className="hidden md:block xl:block 2xl:hidden py-4 md:py-8 relative z-10 container mx-auto">
            <div className="mx-0 lg:mx-12 xl:mx-0 2xl:mx-0">
              <CarouselsTablet />
            </div>
          </div>
          <div className="block md:hidden py-4 md:py-8 relative z-10 container mx-auto">
            <div className="mx-0 lg:mx-12 xl:mx-0 2xl:mx-0">
              <CarouselsMobile />
            </div>
          </div>
          <div className="hidden 2xl:block py-4 md:py-8 relative z-10 container mx-auto ">
            <div className="mx-0 lg:mx-12 xl:mx-0 2xl:mx-0">
              <Carousels />
            </div>
          </div>
        </div>
        <div className="mt-0 md:mt-4 xl:-mt-8">
          <div className="relative container mx-auto mb-6">
            <div className="-mt-4 md:mt-0 z-10 bg-white mx-0 lg:mx-12 xl:mx-32 2xl:mx-64 md:border md:rounded-md md:shadow-lg">
              <div className={`block md:flex xl:flex 2xl:flex justify-start`}>
                <div className="hidden md:flex justify-start px-10">
                  <Sidebar nameMenu={nameMenu} setNameMenu={setNameMenu} />
                </div>
                <div className="block md:hidden">
                  <SideBarMobile
                    nameMenu={nameMenu}
                    setNameMenu={setNameMenu}
                  />
                </div>
              </div>
              {/* for desktop */}
              <div className="block mt-2">
                <div className="w-full">
                  {/* menu fitur  */}
                  {nameMenu == "plane" ? (
                    <Plane />
                  ) : nameMenu == "train" ? (
                    <KAI />
                  ) : nameMenu == "pelni" ? (
                    <Pelni />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
