//make create function reactjs

import Layout from "../Layout";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import DLU from "../../components/dlu/DLU";
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

  const customLayout = localStorage.getItem("v-data2") ? JSON.parse(localStorage.getItem("v-data2")) : '';
  // const [customLayout, setCustomLayout] = useState(null);

  // useEffect(() => {

  //   const custom = localStorage.getItem("v-data2") ? JSON.parse(localStorage.getItem("v-data2")) : ''
  //   setCustomLayout(custom);

  // }, []);

  console.log(customLayout);

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
            
            if(data.data.data2 && data.data.data2 != ''){
              localStorage.setItem("v-data2", data.data.data2);
            }else{
              localStorage.removeItem("v-data2");
            }
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
        <div
          style={{
            backgroundColor: customLayout?.color?.secondary?.background || '#0f172a',
          }}
          className="rounded-b-[40px] pb-12 xl:pb-20 xl:mb-0 xl:rounded-b-[120px]"
        >
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
          <div className={`hidden 2xl:block py-4 md:py-8 relative z-10 container mx-auto `}>
            <div className="mx-0 lg:mx-12 xl:mx-0 2xl:mx-0">
              <Carousels />
            </div>
          </div>
        </div>
        <div className="-mt-[102px] xl:-mt-24">
          <div className="relative container mx-auto mb-6">
            <div className="-mt-4 md:mt-0 z-10 xl:bg-white mx-0 lg:mx-12 xl:mx-32 2xl:mx-36 md:border md:rounded-md md:shadow-lg">
              <div className={`block md:flex xl:flex 2xl:flex justify-start`}>
                <div className="hidden md:flex justify-start px-10">
                  <Sidebar nameMenu={nameMenu} setNameMenu={setNameMenu} />
                </div>
                <div className="block md:hidden ">
                  <SideBarMobile
                    nameMenu={nameMenu}
                    setNameMenu={setNameMenu}
                  />
                </div>
              </div>
              {/* for desktop */}
              <div className="block mt-2 pb-12 px-4">
                <div className="w-full">
                  {/* menu fitur  */}
                  {nameMenu == "plane" ? (
                    <Plane />
                  ) : nameMenu == "train" ? (
                    <KAI />
                  ) : nameMenu == "pelni" ? (
                    <Pelni />
                  )  : nameMenu == "dlu" ? (
                    <DLU />
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
