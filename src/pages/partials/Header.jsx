
import { Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState, useRef } from "react";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";
import SidebarMobileUser from "./sidebar/mobile/SidebarMobileUser";
import { Drawer, Typography, Modal, Form, Input, Button, Avatar } from "antd";
import { notification } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { LogoutContent } from "../../App";
import { FaListAlt } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { UserOutlined } from "@ant-design/icons";
import dayjs, { isDayjs } from "dayjs";
import { IoLogOut, IoLogOutOutline, IoLogOutSharp } from "react-icons/io5";

export default function Header() {

  const captchaRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [form] = Form.useForm();
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [isExpired, setIsExpired] = useState(false);
  const [login, setLogin] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { setLogout } = useContext(LogoutContent);

  const location = useLocation();
  const { pathname, search } = location;
  const newURL = pathname + search;

  const onReset = () => {
    form.resetFields();
  };

  const token = localStorage.getItem("v_loggers");

  useEffect(() => {
    if (token != null || token != undefined) {
      setLogin(true);
    }
  }, [token]);

  const gagalLogin = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
    });
  };

  const suksesLogin = () => {
    api["success"]({
      message: "Successfully!",
      description: "Successfully, anda berhasil login.",
    });
  };

  const suksesLogout = () => {
    api["success"]({
      message: "Successfully!",
      description: "Successfully, anda berhasil logout.",
    });
  };

  const suksesLogoutAutomatic = () => {
    api["warning"]({
      message: "Warning!",
      description: "Waktu login anda sudah habis. Silahkan login kembali.",
    });
  };

  const navigate = useNavigate();
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
        navigate('/');

      });
  };

  const user =
    localStorage.getItem("v_") != "undefined" &&
    localStorage.getItem("v_") !== null
      ? JSON.parse(localStorage.getItem("v_"))
      : null;
  const expiredDate =
    localStorage.getItem("expired_date") != "undefined" &&
    localStorage.getItem("expired_date") !== null
      ? localStorage.getItem("expired_date")
      : null;

  const [usr, setUsr] = useState();

  useEffect(() => {
    if (user === null || user === undefined) {
      userProfile();
    }
  }, [user]);

  useEffect(() => {
    expiredDateTime();
  }, [expiredDate]);

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
      setUsr(response.data.data);
      localStorage.setItem(
        "v_",
        JSON.stringify({
          namaPemilik: response.data.data.namaPemilik,
          balance: response.data.data.balance,
        })
      );
    }
  };

  const expiredDateTime = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/refresh-date`,
      {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    if (response.data.data && response.data.data.rc == "00") {
      localStorage.setItem(
        "expired_date",
        response.data.data.data.expired_date
      );
    }
  };

  const [uid, setuid] = useState();
  const [pin, setpin] = useState();
  const [captcha, setcaptcha] = useState();
  const [isLoading, setLoading] = useState(false);

  function onChange(value) {
    setcaptcha(value);
  }

  const logout = () => {
    try {
      axios
        .post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
          token:
            JSON.parse(
              localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
            ) == null
              ? "Logout"
              : JSON.parse(
                  localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
                ),
        })
        .then((data) => {
          localStorage.clear();
          suksesLogoutAutomatic();

          setLogout({
            type: "LOGOUT",
          });

          navigate("/logout");
        });
    } catch (e) {}
  };

  useEffect(() => {
    const expiredDate = localStorage.getItem("expired_date");
    const currentDate = new Date();
    const diffTime = new Date(expiredDate) - currentDate;
    const timeout = setTimeout(() => {
      setIsExpired(true);
    }, diffTime);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isExpired && login) {
      logout();
    }
  }, [isExpired]);

  const customStyle = {
    color: "white", // Warna teks
    padding: "20px",
  };

  const onCloseDrawer = () => setIsDrawerOpen(false);

  const handlerLogin = async (e) => {
    e.preventDefault();

    await form.validateFields();

    try {
      setLoading(true);
      onReset();

      await axios
        .post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_in`, {
          username: uid,
          password: pin,
          token: captcha,
        })
        .then((data) => {

          captchaRef.current.reset();

          if (data.data.rc === "00") {
            setShowModal(false);
            setLoading(false);
            setLogin(true);
            localStorage.setItem(
              process.env.REACT_APP_SECTRET_LOGIN_API,
              JSON.stringify(data.data.token)
            );
            userProfile();
            suksesLogin();
            localStorage.setItem("expired_date", data.data.expired_date);
            localStorage.setItem("c_at", dayjs());
            localStorage.setItem("c_name", uid);

            if(search.trim().length > 1){
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }else{
              navigate(newURL);
            }

           } else {
            gagalLogin(data.data.rd);
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const x = user
    ? user.namaPemilik.split(" ")
    : usr
    ? usr.namaPemilik.split(" ")
    : null;
  const nd = x ? (x[0] ? x[0] : "") : "";
  const nb = x ? (x[1] ? x[1] : "") : "";
  

  return (
    <nav className="bg-white px-2 sm:px-4 py-3  block sticky top-0 w-full z-50 left-0 border-b border-gray-200 ">
      {contextHolder}
      <div className="container mx-auto">
        <div className="flex justify-between items-center -mx-2 md:-mx-10 lg:-mx-0 -px-0 md:px-8 xl:px-24">
          <div className="">
            <Link to={"/"} className="flex items-center">
              <img
                src="/logo-rb.png"
                className="w-36 -my-2 md:-my-0 md:w-40 -mr-4"
                alt="Rajabiller Logo"
              />
            </Link>
          </div>
          <div className="flex space-x-6 items-center xl:order-2">
            {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
              <Link
                to="/transaksi/pesawat"
                className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700"
              >
                <FaListAlt className="text-cyan-500" size={18} />
                <div className="text-[15px] text-slate-800">Transaksi</div>
              </Link>
            ) : null}
            {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
              <Link
                to="/booking/pesawat"
                className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700"
              >
                <FaListAlt className="text-red-500" size={18} />
                <div className="text-[15px] text-slate-800">Booking</div>
              </Link>
            ) : null}
            <>
              {/* Untuk Belum login */}
              {!localStorage.getItem(
                process.env.REACT_APP_SECTRET_LOGIN_API
              ) ? (
                <div
                  className="hidden md:flex text-slate-700 space-x-4 items-center"
                >
                  <div className="flex space-x-2 items-center cursor-pointer hover:text-blue-500"  onClick={handleOpen}>
                      <UserOutlined size={22} />
                      <div>Masuk</div>
                  </div>
                  <a href="https://www.rajabiller.com/register" className="text-[15px] text-slate-800">
                  <Button
                    key="submit"
                    type="default"
                    className="px-8 text-gray-700"
                  >
                    Registrasi
                  </Button>
                  </a>
                </div>
              ) : (
                <div className="hidden relative group space-x-2 text-gray-500 md:cursor-pointer font-medium rounded-lg text-sm px-5 md:px-2 md:inline-flex group-hover:block items-end ml-2 mb-2">
                  {user !== null && user !== undefined ? (
                    <>
                      {user.namaPemilik !== undefined ? (
                        <>
                          <div className="flex space-x-2 items-center mt-2">
                          <div className="">
                          <div className="text-slate-600 font-bold">
                            {localStorage.getItem('c_name')
                              ? localStorage.getItem('c_name').charAt(0).toUpperCase() + localStorage.getItem('c_name').slice(1)
                              : 'Rb Travell'}
                            </div>
                              <small>{localStorage.getItem('c_at') ? 'Logged at ' + dayjs(localStorage.getItem('c_at')).format('ddd, DD MMM YYYY HH:mm:ss') : 'Logged at -'}</small>
                          </div>
                          <div>
                          <div
                              onClick={LogoutHandler}
                              class="ml-4 flex justify-center bg-blue-500 py-2 rounded-full space-x-4 items-center w-full pl-1"
                            >
                              <IoLogOutOutline size={18} className="text-white" />
                            </div>
                          </div>
                          </div>
                        </>
                      ) : (
                        <Box sx={{ width: 100 }}>
                          <Skeleton animation="wave" />
                          <Skeleton animation="wave" />
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Box sx={{ width: 100 }}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                      </Box>
                    </>
                  )}
                </div>
              )}
              {/* end Untuk  login */}
            </>
            {/* Button */}
            {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="md:mr-0 inline-flex items-center py-4 px-4 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-gray-200 "
                aria-controls="navbar-sticky"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <button onClick={() => setIsDrawerOpen(true)}>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </button>
            ) : (
                <>
                <div className="pr-4 py-3">       
                    <Button className="flex md:hidden  items-center px-8 py-4" 
                     onClick={handleOpen}
                    >
                        Login
                    </Button>
                </div>
                </>
            )
            
            }
          </div>
        </div>
      </div>

      {/* mobile sidebar */}
      {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) && (
        <>
          <Drawer
            title="Navigation"
            placement="left"
            closable={true}
            onClose={onCloseDrawer}
            visible={isDrawerOpen}
            bodyStyle={customStyle} // Terapkan gaya kustom pada isi drawer
          >
            <div style={{ textAlign: "center" }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <Typography.Title level={4} style={{ marginTop: "10px" }}>
                <SidebarMobileUser />
              </Typography.Title>
            </div>
          </Drawer>
        </>
      )}

      {/* untuk toggle sidebar di mobile dan desktop */}

      <Modal
        title="Login User"
        visible={showModal}
        onOk={handleClose}
        onCancel={handleClose}
        footer={[
          <Button
            key="submit"
            type="primary"
            className="bg-blue-500"
            loading={isLoading}
            onClick={handlerLogin}
          >
            Submit
          </Button>,
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
      >
        <p>Masukkan Username & Password untuk Login</p>
        <Form 
        labelCol={{
          span: 5,
        }}
        
        textAlign="left"
        wrapperCol={{
          span: 18,
        }}
        style={{
          maxWidth: 1000,
        }}
        
        className="mt-8" form={form} onFinish={handlerLogin}>
          <Form.Item 
          rules={[
            {
              required: true,
              message:
                "Username harus diisi.",
            },
            {
              max: 15,
              message:
                "Username maksimal 15 karakter.",
            },
            {      
              pattern: /^[a-zA-Z0-9]*$/, 
              message: "Username hanya boleh berisi huruf dan angka.",
            },
          ]}
            className="mt-4" label="Username" name="uid">
            <Input
                 onChange={(e) => {
                  const value = e.target.value;
                  setuid(value);
                }}
                value={uid}
            />
          </Form.Item>
          <Form.Item 
            rules={[
              {
                required: true,
                message:
                  "Password harus diisi.",
              },
              {
                max: 15,
                message:
                  "Password maksimal 15 karakter.",
              },
              
            ]}
          
          label="Password" name="pin">
            <Input.Password
              onChange={(e) => setpin(e.target.value)}
              value={pin} // Pastikan value sesuai dengan nilai state pin
              required
            />
          </Form.Item>
          <Form.Item label="Recaptcha" name="recaptcha"
            rules={[
              {
                required: true,
                message:
                  "Recaptcha harus diisi.",
              },
            ]}
          >
            <ReCAPTCHA
              ref={captchaRef} // Tambahkan ref ke reCAPTCHA
              onChange={onChange}
              sitekey="6LdGRpEoAAAAAOqcTSI_5GvfV0_FwqiyOAarv9KM"
            />
          </Form.Item>
        </Form>
      </Modal>
    </nav>
  );
}