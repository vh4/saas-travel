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
        <div className="mx-0 xl:mx-16 grid grid-rows-1 xl:grid-rows-2">
                        {/* view rekening */}

        <div class="mt-8 md:mt-12">
            <div class="w-full xl:w-4/5 h-56 xl:h-3/4 m-auto relative rounded-2xl text-black shadow-sm border border-gray-300 transition-transform transform hover:scale-110">
                <div class="relative object-cover w-full h-full rounded-2xl bg-white"  >
                <div class="w-full px-8 absolute top-8">
                    <div class="flex justify-between">
                        <div class="">
                            <p class="font-light text-sm xl:text-md">
                                Nama Pemilik
                            </p>
                            <p class="font-medium tracking-widest text-sm xl:text-md">
                            {data.namaPemilik ? data.namaPemilik : '-'}
                            </p>
                        </div>
                        <img class="w-10 h-10 xl:w-14 xl:h-14" src="/mandiri.avif" />
                    </div>
                    <div class="pt-8 pb-4 text-center">
                        <p class="font-bold text-md xl:text-3xl tracking-more-wider">
                        {data.norek ? data.norek : 'xxxx-xxxx-xxxx-xxxx-xxxx'}
                        </p>
                    </div>
                    <div class="pt-4 xl:pt-8 pr-6">
                        <div class="flex justify-between">
                            <div class="">
                                <p class="font-light text-xs">
                                    ID Outlet
                                </p>
                                <p class="font-medium tracking-wider text-sm">
                                {data.idOutlet ? data.idOutlet : '-'}
                                </p>
                            </div>
                            <div class="">
                                <p class="font-light text-xs">
                                    Upline
                                </p>
                                <p class="font-medium tracking-wider text-sm">
                                {data.upline ? data.upline : '-'}
                                </p>
                            </div>
    
                            <div class="">
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
            <div className="-mt-0 xl:-mt-20">
                <div className="flex justify-end mt-2">
                    <button  type="button" className="text-gray-900 mt-2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 md:px-6 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 mr-2 mb-2">
                        <TfiPencilAlt color="blue" size={16} fontSize={"bold"} />
                        <div  className="ml-2">Edit</div>
                    </button>
                </div>
                <form>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="text" readOnly disabled class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.namaPemilik ? data.namaPemilik : '-'}</label>
                </div>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="email"  readOnly disabled   class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.email ? data.email : '-'}</label>
                </div>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="text" readOnly disabled   class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.notelpOutlet ? data.notelpOutlet : '-'}</label>
                </div>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="text" readOnly disabled  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.nomorWhatsappOutlet ? data.nomorWhatsappOutlet : '-'}</label>
                </div>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="text" readOnly disabled  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.noKtp ? data.noKtp : '-'}</label>
                </div>
                <div class="relative z-0 mb-6 w-full group">
                    <input type="text" readOnly disabled  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.tanggalRegistrasi ? data.tanggalRegistrasi : '-'}</label>
                </div>
                <div class="grid md:grid-cols-2 md:gap-6">
                    <div class="relative z-0 mb-6 w-full group">
                        <input type="text" readOnly disabled class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.alamatPemilik ? data.alamatPemilik : '-'}</label>
                    </div>
                    <div class="relative z-0 mb-6 w-full group">
                        <input type="text" readOnly disabled  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.kodePos ? data.kodePos : '-'}</label>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 md:gap-6">
                    <div class="relative z-0 mb-6 w-full group">
                        <input type="text" readOnly disabled  /* pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  */ class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.rt ? data.rt : '-'}</label>
                    </div>
                    <div class="relative z-0 mb-6 w-full group">
                        <input type="text" readOnly disabled  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{data.rw ? data.rw : '-'}</label>
                    </div>
                </div>
                </form>

            </div>
        </div>
    )
}