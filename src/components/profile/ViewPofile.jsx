import React, { useEffect, useState } from "react";
import axios from 'axios'
import {TfiPencilAlt} from 'react-icons/tfi'
import Page500 from "../components/500";

export default function EditProfile(){

    const [data, setData] = useState({});
    const [err, setErr] = useState(false);
    const [errPage, setErrPage] = useState(false);

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));

    useEffect(() => {

        if(token === undefined || token === null){
            setErr(true);
        }

    }, [token]);

    useEffect(() => {
        getProfileUser();
    },[]);

    const getProfileUser = async () =>{
        try {

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
            });

            if(response.data.rc !== '00'){
                setErrPage(true);
            }
    
            const datas = response.data;
            setData(datas.data);
            
        } catch (error) {
            setErrPage(true);
        }

    }

    return(
        <div className="w-full mt-8">

        {err === true ? (
            <><Page500 /></>
        ) : errPage === true ? (
            <><Page500 /></>
        ) : (
            <>
            
            {/* view rekening */}
            <div class="">
                <div class="w-full relative rounded-2xl shadow-sm border transition-transform transform hover:scale-105">
                    <div class="relative p-0 md:p-4 object-cover w-full h-full rounded-2xl">
                        <div class="w-full p-4">
                            <div class="flex justify-between">
                                <div class="text-black">
                                    <p class="font-light text-sm xl:text-md">
                                        Nama Pemilik
                                    </p>
                                    <p class="font-medium tracking-widest text-sm xl:text-md">
                                    {data.namaPemilik ? data.namaPemilik : '-'}
                                    </p>
                                </div>
                            </div>
                  
                            <div class="pt-4 xl:pt-8 pr-6">
                                <div class="flex justify-between">
                                    <div class="text-black">
                                        <p class="font-light text-xs">
                                            ID Outlet
                                        </p>
                                        <p class="font-medium tracking-wider text-sm">
                                        {data.idOutlet ? data.idOutlet : '-'}
                                        </p>
                                    </div>
                    
            
                                    <div class="text-black">
                                        <p class="font-light text-xs">
                                            Pin
                                        </p>
                                        <p class="font-bold tracking-more-wider text-sm">
                                            ******
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* edit profile -> data */}
            <div className="border rounded-lg p-4 md:p-8 mt-8">
                <div className="text-md font-bold text-black">
                    Profil Saya
                </div>
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.namaPemilik ? data.namaPemilik : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Nama Lengkap</label>
                    </div>                   
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.email ? data.email : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                    </div>  
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.notelpOutlet ? data.notelpOutlet : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">No. Telepon</label>
                    </div>  
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.noKtp ? data.noKtp : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Nomor Ktp</label>
                    </div>
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.tanggalRegistrasi ? data.tanggalRegistrasi : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Tanggal Registrasi</label>
                    </div>
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.alamatPemilik ? data.alamatPemilik : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff]  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Alamat</label>
                    </div>
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.rt ? data.rt : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff]  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">RT</label>
                    </div>
                    <div class="relative">
                        <input readOnly type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.rw ? data.rw : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-black  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff]  px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">RW</label>
                    </div>
                </div>
            </div>
            
            </>
        )}


        </div>
    )
}