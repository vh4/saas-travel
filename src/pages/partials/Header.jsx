//make create function reactjs

import { Link } from "react-router-dom";
import React, {useContext, useEffect, useState } from 'react'
import {CiSettings} from 'react-icons/ci'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from '@mui/material/Skeleton';
import {MdOutlineCorporateFare} from "react-icons/md"
import {IoMdArrowDropdown} from "react-icons/io"
import { FaRegUser, FaListAlt } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material'
import SidebarMobileUser from "./sidebar/mobile/SidebarMobileUser";
import { Drawer, Typography, Modal, Form, Input, Button } from "antd";
import { notification } from 'antd';
import { toRupiah } from "../../helpers/rupiah";
import { LogoutContent } from "../../App";
import ReCAPTCHA from "react-google-recaptcha";

export default function Header({toogleSidebar, valueSidebar}){

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [showModal, setShowModal] = React.useState(false);
    const [form] = Form.useForm();
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [isExpired, setIsExpired] = useState(false);
    const [login, setLogin] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { setLogout } = useContext(LogoutContent);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloses = () => {
      setAnchorEl(null);
    };

    const onReset = () => {
        form.resetFields();
      };

    const token =  localStorage.getItem('v_loggers');

    useEffect(() =>{

        if(token != null || token != undefined){

            setLogin(true);

        }

    }, [token])

    const gagalLogin = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + '',
        });
      };

      const suksesLogin = () => {
        api['success']({
          message: 'Successfully!',
          description:
          'Successfully, anda berhasil login.'
        });
      };

      const suksesLogout= () => {
        api['success']({
          message: 'Successfully!',
          description:
          'Successfully, anda berhasil logout.',
        });
      };

      const suksesLogoutAutomatic= () => {
        api['warning']({
          message: 'Warning!',
          description:
          'Waktu login anda sudah habis. Silahkan login kembali.',
        });
    };

    const navigate = useNavigate();
    const LogoutHandler = (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        }).then(() => {
            localStorage.clear();
            suksesLogout();

            navigate('/')
        });
        
    }


    const user = localStorage.getItem('v_') != 'undefined' && localStorage.getItem('v_') !== null ? JSON.parse(localStorage.getItem('v_')) : null;
    const expiredDate = localStorage.getItem("expired_date") != 'undefined' && localStorage.getItem("expired_date") !== null ? localStorage.getItem("expired_date") : null; ;

    const [usr, setUsr] = useState();

    useEffect(() =>  {
        if(user === null || user === undefined){
            userProfile()
        }
    }, [user]);

    useEffect(() =>  {
         expiredDateTime()
    }, [expiredDate]);
    
    const userProfile = async () =>  {
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });
        if(response.data && response.data.rc == '00'){
            setUsr(response.data.data)
            localStorage.setItem('v_', JSON.stringify({
                namaPemilik:response.data.data.namaPemilik,
                balance:response.data.data.balance
            }))
        }
    }

    const expiredDateTime = async () =>  {
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/refresh-date`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });

        if(response.data.data && response.data.data.rc == '00'){
            localStorage.setItem("expired_date", response.data.data.data.expired_date);
        }

    }

    const [uid, setuid] = useState();
    const [pin, setpin] = useState();
    const [captcha, setcaptcha] = useState();
    const [isLoading, setLoading] = useState(false);

    function onChange(value) {
        setcaptcha(value)
    }

    const logout = () => {
        try{
            axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)) == null ? 'Logout' : JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            }).then((data) => {
                localStorage.clear();
                suksesLogoutAutomatic()
                
                setLogout({
                    type: "LOGOUT",
                });    

                navigate('/logout')
            });
        }catch(e){
        }
    }

    useEffect(() => {
      const expiredDate = localStorage.getItem("expired_date")
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


    const handlerLogin = async (e) => {

        e.preventDefault();

        try {
            setLoading(true);
            onReset();

            await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_in`, {
                username:uid,
                password:pin,
                token: captcha,
            }).then((data) => {
                
                if(data.data.rc === "00"){
                    setShowModal(false)
                    setLoading(false);
                    setLogin(true);
                    localStorage.setItem(process.env.REACT_APP_SECTRET_LOGIN_API, JSON.stringify(data.data.token));
                    userProfile();
                    suksesLogin();
                    localStorage.setItem("expired_date", data.data.expired_date);

                } else {
                    gagalLogin(data.data.rd);
                    setLoading(false);
                }
             }); 
        } 
        catch (error) {
            setLoading(false);
        }
    }

    const x = user ? user.namaPemilik.split(' ') : usr ? usr.namaPemilik.split(' ') : null;
    const nd = x ? x[0] ? x[0] : '' : '';
    const nb =  x ? x[1] ? x[1] : '' : ''

    return(
        <nav className="bg-white px-2 sm:px-4 py-2  block sticky top-0 w-full z-50 left-0 border-b border-gray-200 ">
            {contextHolder}
            <div className="container mx-auto">
                <div className="flex justify-between items-center sm:-mx-6 md:-mx-10 lg:-mx-0 -px-0 md:px-8 xl:px-24">
                    <div className="">
                        <Link to={'/'} className="flex items-center">
                            <img src="/logo-rb.png" className="w-36 -my-2 md:-my-0 md:w-40 mr-3" alt="Rajabiller Logo" />
                        </Link>
                    </div>
                    <div className="flex space-x-6 items-center xl:order-2">
                    <a href="https://www.rajabiller.com/register" target="_blank" ><div className="hidden md:flex cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < MdOutlineCorporateFare className="text-blue-500 font-bold" size={18}/>
                        <div className="text-[15px] text-slate-800">B2B</div>
                    </div></a>
                    {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
                    <Link to="/transaksi/pesawat" className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < FaListAlt className="text-cyan-500" size={18}/>
                        <div className="text-[15px] text-slate-800">Transaksi</div>
                    </Link> 
                    ) : null}
                    {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
                    <Link to="/booking/pesawat" className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < FaListAlt className="text-red-500" size={18}/>
                        <div className="text-[15px] text-slate-800">Booking</div>
                    </Link> 
                    ) : null}
                    <>

                    {/* Untuk Belum login */}
                    {!localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
                    <button onClick={handleOpen} type="button" className="hidden md:flex text-slate-700 space-x-2 items-center">
                        <FaRegUser size={16} />
                        <div  className="text-[15px] text-slate-800">Masuk</div>
                    </button> 
                    ) :
                    (        
                        <div className="hidden relative group space-x-2 text-gray-500 md:cursor-pointer font-medium rounded-lg text-sm px-5 md:px-2 py-2.5 md:inline-flex group-hover:block items-end ml-2 mb-2">
                            {user !== null && user !== undefined ? 
                            (
                                <>
                                {
                                    user.namaPemilik !== undefined ? 

                                    (
                                        <>
                                            <p className="text-gray-500 block">{nd} {nb}</p>
                                                < CiSettings size={20} />
                                            {/* <small className="absolute group-hover top-8 left-4 text-slate-500">Sisa saldo {sisaSaldo(user.balance)}</small> */}
                                            <small className="absolute -left-0 group-hover top-7 text-slate-500">Sisa saldo Rp.{toRupiah(user.balance)}</small> 
                                            <ul class="transition-opacity duration-500 invisible group-hover:visible absolute top-0 mt-8 w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 ">
                                            <Link to="/profile/view"><li class="hover:bg-gray-200 py-2 px-4 w-full rounded-t-lg border-b border-gray-200 ">Akun saya</li></Link>
                                                <li class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 ">Lupa password pin</li>
                                                <li onClick={LogoutHandler} class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 ">Logout</li>
                                            </ul>                      
                                        </>  
                                    ) :

                                    (
                                        <Box sx={{ width: 100 }}>
                                        <Skeleton animation="wave" />
                                        <Skeleton animation="wave" />
                                        </Box>  
                                    )
                                }                    
                                </>
                            )

                            : 

                            (
                                <>
                                    <Box sx={{ width: 100 }}>
                                    <Skeleton animation="wave" />
                                    <Skeleton animation="wave" />
                                    </Box>                  
                                </>
                            )
                        
                        }
                        </div>
                    )
                }
                        <div className="hidden md:flex cursor-pointer space-x-3 text-sm items-center text-slate-700">
                            <div className="">
                                <button
                                    onClick={handleClick}
                                >
                                    <div className="flex space-x-4 text-slate-500 text-sm items-center">
                                        <div className="flex items-center space-x-2">
                                            <img src="/ina.png" width={24} alt="flag.png" />
                                            <div>ID</div>
                                        </div>
                                        < IoMdArrowDropdown className="font-bold" size={18} />
                                    </div>
                                </button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloses}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleCloses}>Indonesia</MenuItem>
                                </Menu>
                            </div>
                    </div> 

                {/* end Untuk  login */}

                </>
                {/* Button */}
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center py-2 px-4 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <button onClick={() => setIsDrawerOpen(true)}>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                            </button>
                        </button>
                    </div>
                </div>
            </div>

            {/* mobile sidebar */}
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Box p={2} width="250px" role="presentation" textAlign="center">
                <Typography variant="h6" component="div">
                    <SidebarMobileUser />
                </Typography>
                </Box>
            </Drawer>

        {/* untuk toggle sidebar di mobile dan desktop */}

        <Modal
        title="Login Users"
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
        <p>Masukan username dan password untuk login.</p>
        <Form className="mt-8" form={form} onFinish={handlerLogin}>
        <Form.Item className="mt-4" label="username" name="username">
            <Input
            onChange={(e) => setuid(e.target.value)}
            value={uid} // Pastikan value sesuai dengan nilai state uid
            required
            />
        </Form.Item>
        <Form.Item label="password" name="pin">
            <Input.Password
            onChange={(e) => setpin(e.target.value)}
            value={pin} // Pastikan value sesuai dengan nilai state pin
            required
            />
        </Form.Item>
            <Form.Item label="recaptcha">
                <ReCAPTCHA
                    onChange={onChange}
                    sitekey="6Lch9ZAoAAAAALsl_FIUwyWxXQ_H29fm86LuTe6d"
                />
            </Form.Item>
        </Form>

      </Modal>                  
        
        </nav>
    )
}
