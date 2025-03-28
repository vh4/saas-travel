import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../Layout";
import Sidebar from "../partials/sidebar/desktop/Sidebar";
import SideBarMobile from "../partials/sidebar/mobile/SideBarMobile";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import Pelni from "../../components/pelni/Pelni";
import DLU from "../../components/dlu/DLU";
import Carousels from "../../components/carousel/Carousel";
import {  notification, Skeleton as SkeletonAntMobile } from "antd";
import { fetchDataType } from "../../features/dataTypeSlice";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MainPage() {
  const dispatch = useDispatch();
  const [nameMenu, setNameMenu] = useState("pesawat");
  const [searchParams] = useSearchParams();
  const [api, contextHolder] = notification.useNotification();
  const customLayout = JSON.parse(localStorage.getItem("v-data2") || "{}");

  const type = useSelector((state) => state.type.data.type);
  const isLoading = useSelector((state) => state.type.isLoading);
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Travel kereta, pesawat, dan pelni";
  }, []);

  const list = ['/', '/pesawat', '/kereta', '/pelni']

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = "auth";

        if (window.location.pathname == '/auth') {
          params = "auth";
        } else if (window.location.pathname == '/pelni') {
          params = "pelni";
        } else if (window.location.pathname == '/kereta') {
          params = "kereta";
        } else if (window.location.pathname == '/pesawat') {
          params = "pesawat";
        }
        else if (window.location.pathname == '/dlu') {
          params = "dlu";
        }

        if (list.includes(window.location.pathname) && searchParams.get("auth")) {

          const encodedParam = searchParams.get("auth").replace(/ /g, "+");
          const decodedParam = decodeURIComponent(encodedParam);

          handlerLogin(decodedParam, searchParams.get("merchant"), params);
        }

      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [dispatch, searchParams]);

  const handlerLogin = async (auth, merchant, params) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/redirect`, {
        auth,
        merchant,
        type: params,
      });

      if (response.data.rc === "00") {
        localStorage.setItem(process.env.REACT_APP_SECTRET_LOGIN_API, JSON.stringify(response.data.token));
        localStorage.setItem("expired_date", response.data.expired_date);
        localStorage.setItem("c_at", dayjs());
        localStorage.setItem("hdrs_c", response.data.is_header_name_and_toast);
        localStorage.setItem("c_name", response.data.username);

        if (response.data.data2) {
          localStorage.setItem("v-data2", response.data.data2);
        } else {
          localStorage.removeItem("v-data2");
        }

        dispatch(fetchDataType());

      }else{
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error("Error in handlerLogin:", error.message);
      navigate('/unauthorized');
    }
  };

    // Update `nameMenu` whenever `type` changes after data fetching
    useEffect(() => {
      if (!isLoading) {
        setNameMenu(type);
      }
    }, [type, isLoading]);

  return (
    <Layout>
      {contextHolder}
      <div className="w-full">
        <div
          style={{
            backgroundColor: customLayout?.color?.secondary?.background || "#0f172a",
          }}
          className="pb-0 xl:pb-20 xl:mb-0 xl:rounded-b-[120px] -mt-4 xl:mt-0 w-full xl:w-none h-[170px] xl:h-auto rounded-2xl xl:rounded-none"
        >
          <div className="hidden xl:block 2xl:hidden py-0 xl:py-8 relative z-10 container mx-auto">
            {/* <CarouselsTablet /> */}
          </div>
          <div className="block xl:hidden py-0 xl:py-8 relative z-10 container mx-auto">
            {/* <CarouselsMobile />  hidden dulu*/} 
          </div>
          <div className="hidden 2xl:block py-0 xl:py-8 relative z-10 container mx-auto">
            <Carousels />
          </div>
        </div>
        <div className="-mt-[100px] xl:-mt-24">
          <div className="relative container mx-auto mb-0 xl:mb-6">
            <div className="-mt-4 xl:mt-0 z-10 xl:bg-white mx-0 lg:mx-12 xl:mx-32 2xl:mx-36 xl:border xl:rounded-md xl:shadow-lg">
              
              <div className="block xl:flex 2xl:flex justify-start  bg-white border xl:border-none rounded-xl xl:rounded-none xl:bg-none z-50 xl:z-auto mx-2 xl:mx-0">
                <div className="hidden xl:flex justify-start px-10">
                  <Sidebar nameMenu={nameMenu} setNameMenu={setNameMenu} />
                </div>
                <div className="block xl:hidden">
                  <SideBarMobile nameMenu={nameMenu} setNameMenu={setNameMenu} />
                </div>
              </div>

              <div className="block mt-2 pb-12 px-4">
                <div className="w-full">
                  {isLoading ? (
                    <>
                    <div className="mx-0 xl:mx-8">
                        <div className="hidden xl:block"><Skeleton height={60} width={'100%'} /></div>
                        <div className="block xl:hidden">
                          <SkeletonAntMobile height={600} width={'100%'} />
                          <SkeletonAntMobile height={600} width={'100%'} />
                          <SkeletonAntMobile height={600} width={'100%'} />
                          </div>
                    </div>
                    </>
                  ) : (
                    <>
                      {nameMenu === "pesawat" || nameMenu === "auth" ? (
                        <Plane />
                      ) : nameMenu === "kereta" ? (
                        <KAI />
                      ) : nameMenu === "pelni" ? (
                        <Pelni />
                      ) : nameMenu === "dlu" ? (
                        <DLU />
                      ) : (
                        <>bro</>
                      )}
                    </>
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
