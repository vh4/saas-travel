import React, { useEffect, useState } from "react";
import axios from 'axios'
import {TfiPencilAlt} from 'react-icons/tfi'

export default function EditProfile(){

    const [data, setData] = useState({});

    useEffect(() => {
        getProfileUser();
    },[]);

    const getProfileUser = async () =>{
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
        });

        const datas = response.data;
        setData(datas.data);

    }

    return(
        <div className="w-full mt-8">
        {/* view rekening */}
        <div class="">
            <div class="w-full relative rounded-2xl shadow-sm border transition-transform transform hover:scale-105">
                <div class="relative p-0 md:p-4 object-cover w-full h-full rounded-2xl">
                    <div class="w-full p-4">
                        <div class="flex justify-between">
                            <div class="text-gray-500">
                                <p class="font-light text-sm xl:text-md">
                                    Nama Pemilik
                                </p>
                                <p class="font-medium tracking-widest text-sm xl:text-md">
                                {data.namaPemilik ? data.namaPemilik : '-'}
                                </p>
                            </div>
                        </div>
                        <div class="pt-8 pb-4 text-center">
                            <p class="text-gray-500 font-bold text-md xl:text-2xl tracking-more-wider">
                            {data.norek ? data.norek : 'xxxx-xxxx-xxxx-xxxx-xxxx'}
                            </p>
                        </div>
                        <div class="pt-4 xl:pt-8 pr-6">
                            <div class="flex justify-between">
                                <div class="text-gray-500">
                                    <p class="font-light text-xs">
                                        ID Outlet
                                    </p>
                                    <p class="font-medium tracking-wider text-sm">
                                    {data.idOutlet ? data.idOutlet : '-'}
                                    </p>
                                </div>
                                <div class="text-gray-500">
                                    <p class="font-light text-xs">
                                        Upline
                                    </p>
                                    <p class="font-medium tracking-wider text-sm">
                                    {data.upline ? data.upline : '-'}
                                    </p>
                                </div>
        
                                <div class="text-gray-500">
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
                <div className="text-md font-bold text-gray-500">
                    Profil Saya
                </div>
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.namaPemilik ? data.namaPemilik : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Nama Lengkap</label>
                    </div>                   
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.email ? data.email : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                    </div>  
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.notelpOutlet ? data.notelpOutlet : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">No. Telepon</label>
                    </div>  
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.noKtp ? data.noKtp : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Nomor Ktp</label>
                    </div>
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.tanggalRegistrasi ? data.tanggalRegistrasi : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] rounded-lg dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Tanggal Registrasi</label>
                    </div>
                    <div class="relative">
                        <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-500 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.alamatPemilik ? data.alamatPemilik : '-'} />
                        <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f7f9ff] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Alamat</label>
                    </div>
                    <div class="mt-4 grid grid-cols-2 gap-4 md:gap-6">
                        <div class="relative z-0">
                            <input type="text" id="floating_standard" class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.rt ? data.rt : '-'} />
                            <label for="floating_standard" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">RT</label>
                        </div>                        
                        <div class="relative z-0">
                            <input type="text" id="floating_standard" class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={data.rw ? data.rw : '-'} />
                            <label for="floating_standard" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">RW</label>
                        </div>   
                    </div>
                </div>
            </div>
        </div>
    )
}