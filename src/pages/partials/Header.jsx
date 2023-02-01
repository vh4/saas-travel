//make create function reactjs

import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from 'react'
import {CiSettings} from 'react-icons/ci'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'
import Skeleton from '@mui/material/Skeleton';
import { BsTags } from "react-icons/bs";
import {MdOutlineCorporateFare} from "react-icons/md"
import {IoMdArrowDropdown} from "react-icons/io"
import { FaRegUser, FaListAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Drawer, Box, Typography } from '@mui/material'
import SidebarMobileUser from "./sidebar/mobile/SidebarMobileUser";
import { Modal, Form, Button as Buttons } from 'rsuite';

function TextField(props) {
    const { name, label, accepter, ...rest } = props;
    return (
      <Form.Group controlId={`${name}-3`}>
        <Form.ControlLabel>{label} </Form.ControlLabel>
        <Form.Control name={name} accepter={accepter} {...rest} />
      </Form.Group>
    );
  }

export default function Header({toogleSidebar, valueSidebar}){

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [showModal, setShowModal] = React.useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloses = () => {
      setAnchorEl(null);
    };
    
    const navigate = useNavigate();
    const LogoutHandler = (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        }).then(() => {
            localStorage.clear();
            toast.success('Anda berhasil logout!');
            navigate('/')
        });
    }

    const [user, setUser] = useState([]);

        
    const userProfile = async () =>  {
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });
        setUser(response.data.data);
    }


    useEffect(() =>  {
        userProfile()
    }, []);


    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    const [uid, setuid] = useState();
    const [pin, setpin] = useState();
    const [isLoading, setLoading] = useState(false);

    const logout = () => {
        axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        }).then(() => {
            localStorage.removeItem('userDetails');
            localStorage.removeItem(process.env.REACT_APP_SECTRET_LOGIN_API);
            toast.success('Anda berhasil logout!');
            navigate('/')
        });
    }

    const saveTokenInLocalStorage = (tokenDetails) => {
        localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
    }

    // const runLogoutTimer = () => {
    //     setTimeout(() => {
    //         logout();
    //     }, 43200000);
    // }

    const handlerLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_in`, {
                outletId:uid,
                pin:pin,
                key: ''
            }).then((data) => {
                if(data.data.rc === "00"){
                    saveTokenInLocalStorage(data.data);
                    // runLogoutTimer(data.data.timer * 43200000);
                    setShowModal(false)
                    setLoading(false);
                    localStorage.setItem(process.env.REACT_APP_SECTRET_LOGIN_API, JSON.stringify(data.data.token));
                    userProfile();
                    toast.success('Anda Berhasil Login!');

                } else {
                    toast.error(data.data.rd);
                    setLoading(false);
                }
             }); 
        } 
        catch (error) {
            setLoading(false);
        }
    }


    return(
        <nav className="bg-white px-2 sm:px-4 py-2 dark:bg-gray-900 block sticky top-0 w-full z-50 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="container mx-auto">
                <div className="flex justify-between items-center sm:-mx-6 md:-mx-10 lg:-mx-0 -px-0 md:px-8 xl:px-24">
                    <div className="">
                        <Link to={'/'} className="flex items-center">
                            <img src="/logo-rm.png" className="w-36 -my-2 md:-my-0 md:w-32  mr-3" alt="Fastravel Logo" />
                        </Link>
                    </div>
                    <div className="flex space-x-6 items-center xl:order-2">
                    <a href="https://www.rajabiller.com/register" target="_blank" ><div className="hidden md:flex cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < MdOutlineCorporateFare className="text-blue-500 font-bold" size={18}/>
                        <div className="text-[15px] text-slate-800">B2B</div>
                    </div></a>
                    <Link to="/promo" className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < BsTags className="text-orange-500" size={18}/>
                        <div className="text-[15px] text-slate-800">Promo</div>
                    </Link>
                    <Link to="/transaksi/kai" className="hidden md:flex  cursor-pointer space-x-2 text-sm items-center text-slate-700">
                        < FaListAlt className="text-cyan-500" size={18}/>
                        <div className="text-[15px] text-slate-800">Transaksi</div>
                    </Link>                                       
                    <>

                    {/* Untuk Belum login */}
                    {!localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
                    <button onClick={handleOpen} type="button" className="hidden md:flex text-slate-700 space-x-2 items-center">
                        <FaRegUser size={16} />
                        <div  className="text-[15px] text-slate-800">Masuk</div>
                    </button> 
                    ) :
                    (        
                        <div className="hidden relative group space-x-2 text-gray-500 md:cursor-pointer font-medium rounded-lg text-sm px-5 md:px-2 py-2.5 xl:inline-flex group-hover:block items-end ml-2 mb-2">
                            {user !== undefined ? 
                            (
                                <>
                                {
                                    user.namaPemilik !== undefined ? 

                                    (
                                        <>
                                            <p className="text-gray-500 block">{user.namaPemilik}</p>
                                                < CiSettings size={20} />
                                            {/* <small className="absolute group-hover top-8 left-4 text-slate-500">Sisa saldo {sisaSaldo(user.balance)}</small> */}
                                            <small className="absolute -left-0 group-hover top-7 text-slate-500">Sisa saldo Rp.{toRupiah(user.balance)}</small> 
                                            <ul class="transition-opacity duration-500 invisible group-hover:visible absolute top-0 mt-8 w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <Link to="/profile/view"><li class="hover:bg-gray-200 py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">Akun saya</li></Link>
                                                <li class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">Lupa password pin</li>
                                                <li onClick={LogoutHandler} class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">Logout</li>
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
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <div className="flex space-x-4 text-slate-500 text-sm items-center">
                                        <div className="flex items-center space-x-2">
                                            <img src="/ina.png" width={24} alt="flag.png" />
                                            <div>ID</div>
                                        </div>
                                        < IoMdArrowDropdown className="font-bold" size={18} />
                                    </div>
                                </Button>
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
                                    <MenuItem onClick={handleCloses}>English</MenuItem>
                                </Menu>
                            </div>
                    </div> 

                {/* end Untuk  login */}

                </>
                {/* Button */}
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center py-2 px-4 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
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
                anchor='left'
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}>
                <Box p={2} width='250px' role='presentation' textAlign='center'>
                <Typography variant='h6' component='div'>
                    <SidebarMobileUser />
                </Typography>
                </Box>
            </Drawer> 

        {/* untuk toggle sidebar di mobile dan desktop */}

        <Modal size="xs" open={showModal} onClose={handleClose}>
        <Modal.Header>
            <Modal.Title>
                <div className="text-gray-500 font-bold mt-2">
                Login Users
                </div>
                <small>
                    Masukan username dan password untuk login.
                </small>
            </Modal.Title>
            </Modal.Header>
        <Modal.Body>

            {/*content*/}
        <div className="w-full">
            <form>
                {/*body*/}
                <div className="relative p-4 flex-auto">
                <Form>
                <TextField onChange={(e) => setuid(e)} type="text" name="username" label="username / uid" />
                <TextField onChange={(e) => setpin(e)} type="password" name="pin" label="pin password" />
                </Form>
                </div>
                {/* <div className="pl-8 -mt-5 xl:pl-16">
                    <p className="text-blue-500">lupa password ?</p>
                </div> */}
                {/*footer*/}
            </form>
        </div>   
        </Modal.Body>
        <Modal.Footer>
            <div className="flex justify-end space-x-4">
            <Buttons onClick={handlerLogin} type="submit" appearance="primary">
            {isLoading ? 'Loading...' : 'Login'}
          </Buttons>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
            </div>
        </Modal.Footer>
      </Modal>                    
        
        </nav>
    )
}
