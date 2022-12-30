import React, {useState, useEffect} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import '../../index.css';
import {TbArrowsLeftRight} from 'react-icons/tb'
import { useNavigate } from "react-router";
import { useParams } from 'react-router';

export default function BookingKai(){

    const [value, setValue] = useState();
    const navigate = useNavigate();

    const {trainNumber} = useParams();
    

    const dataBookingTrain = JSON.parse(localStorage.getItem(trainNumber + "_booking"));
    const dataDetailTrain = JSON.parse(localStorage.getItem(trainNumber + "_detailTrain"));

    useEffect(() =>{
        
        if(dataBookingTrain === undefined || dataBookingTrain === null){
            navigate('/train');
        }

        if(dataDetailTrain === undefined || dataDetailTrain === null){
            navigate('/train')
        }

    }, [dataBookingTrain, dataDetailTrain]);

    var date = new Date(dataBookingTrain[0].departureDate);
    var tahun = date.getFullYear();
    var bulan = date.getMonth();
    var hari = date.getDay();
    var tanggal = date.getDate();

    switch(hari) {
        case 0: hari = "Minggu"; break;
        case 1: hari = "Senin"; break;
        case 2: hari = "Selasa"; break;
        case 3: hari = "Rabu"; break;
        case 4: hari = "Kamis"; break;
        case 5: hari = "Jum'at"; break;
        case 6: hari = "Sabtu"; break;
     }

     switch(bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
       }

     const tanggal_keberangkatan_kereta = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;


    return(
        // header booking detailt KAI
        <div className='-mt-8 xl:mt-0'>
            <div className='flex justify-center jalur-payment-booking text-xs xl:text-md space-x-2 xl:space-x-8 items-center ml-0 xl:ml-12'>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-[#FF9119] px-1 py-0 md:px-2 md:py-1  text-white text-xs xl:text-md rounded-full'>1</div>
                    <div className='hidden xl:flex text-[#FF9119]'>Detail pesanan</div>
                    <div className='block xl:hidden text-[#FF9119]'>Detail</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-1 py-0 md:px-2 md:py-1  text-white text-xs xl:text-md rounded-full'>2</div>
                    <div className='hidden xl:flex text-gray-400'>Konfirmasi pesanan</div>
                    <div className='block xl:hidden text-gray-400'>Konfirmasi</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-1 py-0 md:px-2 md:py-1  text-white rounded-full text-xs xl:text-md'>3</div>
                    <div className='hidden xl:block text-gray-400'>Pembayaran tiket</div>
                    <div className='block xl:hidden text-gray-400'>Payment</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-1 py-0 md:px-2 md:py-1 text-white rounded-full text-xs xl:text-md'>4</div>
                    <div className='text-gray-400'>E-Tiket</div>
                </div>
            </div>

            {/* sidebar mobile */}
            <div className='mt-8 block xl:hidden w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-[#FF9119] border-b-gray-100'>
                        <div className='text-gray-700 '>Keberangkatan kereta</div>
                        <small className='text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                    </div>
                    <div className='p-4 px-4 flex justify-between space-x-12 items-center'>
                        <div className='text-slate-600 text-xs'>
                            <div>{dataDetailTrain[0].berangkat_nama_kota}</div>
                            <div>({dataDetailTrain[0].berangkat_id_station})</div>
                        </div>
                        <div className='rounded-full p-2 bg-[#FF9119]'>
                            < TbArrowsLeftRight className='text-white' size={18} />
                        </div>
                        <div className='text-slate-600 text-xs'>
                            <div>{dataDetailTrain[0].tujuan_nama_kota}</div>
                            <div>({dataDetailTrain[0].tujuan_id_station})</div>
                        </div>
                    </div>
                    <div className='p-4 pl-8  text-gray-700'>
                        <div className='text-xs font-bold'>{dataBookingTrain[0].trainName}</div>
                        <small>Eksekutif class {dataBookingTrain[0].seats[0].class}</small>
                    </div>
                    <div className='p-4 pl-8 mb-4'>
                    <ol class="relative border-l border-gray-500 dark:border-gray-700">                  
                            <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].departureTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs text-slate-600 dark:text-white">{dataDetailTrain[0].berangkat_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataDetailTrain[0].berangkat_id_station})</p>
                                    </div>
                                </div>
                            </li>
                            <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-[#FF9119] rounded-full mt-0 -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].arrivalTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs  text-slate-600 dark:text-white">{dataDetailTrain[0].tujuan_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataDetailTrain[0].tujuan_id_station})</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                    </div>
                    <div className='Booking mt-8 mb-4 xl:mt-12'>
                        <h1 className='xl:text-2xl font-semibold text-gray-700 text-md'>Detail Kontak</h1>
                        <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
                    </div>
            <div className='grid grid-col-1 xl:grid-cols-3 gap-4 xl:gap-8'>
                {/* form detailt kontal */}
                <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2'>
                    <div className=''>
                        <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                            <div className='pl-2 xl:pl-0'>
                                <div className='text-gray-700 text-sm md:text-base font-bold mb-2'>Titel</div>
                                <div className='hidden xl:block'>
                                    {/* desktop */}
                                <FormControl sx={{ m: 1, minWidth: 120, borderRadius:60, outlineColor: 'red' }}>
                                        <InputLabel id="demo-simple-select-helper-label">Titel</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Tn.</MenuItem>
                                        <MenuItem value={'Ny.'}>Ny.</MenuItem>
                                        <MenuItem value={'Nn.'}>Nn.</MenuItem>
                                        </Select>
                                </FormControl>
                                </div>
                                {/* mobile */}
                                <div className='block xl:hidden'>
                                <FormControl sx={{minWidth: "100%", borderRadius:60, outlineColor: 'red' }}>
                                        <InputLabel id="demo-simple-select-helper-label">Titel</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Tn.</MenuItem>
                                        <MenuItem value={'Ny.'}>Ny.</MenuItem>
                                        <MenuItem value={'Nn.'}>Nn.</MenuItem>
                                        </Select>
                                </FormControl>
                                </div>
                            </div>
                            <div className='xl:w-full mt-4 xl:mt-0'>
                            <div className='text-gray-700 text-sm md:text-base font-bold mb-2'>Nama Lengkap</div>
                                <div>
                                    <input type="text" placeholder='Nama Lengkap' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='py-0 px-0 xl:px-8 form block xl:flex space-x-2 xl:space-x-8 mt-0 xl:-mt-6'>
                            {/* desktop */}
                            <div className='p-2 xl:p-0 hidden xl:block'>
                                <div className=' text-gray-700 font-bold mb-2 ml-2 xl:ml-0'>Nomor HP</div>
                                <FormControl sx={{ m: 1, minWidth: 180, borderRadius:60, outlineColor: 'red' }}>
                                    <div className='border border-gray-300 py-2 pl-4'>
                                    <PhoneInput
                                        international
                                        defaultCountry="ID"
                                        value={value}
                                        onChange={setValue}
                                        className={"input-phone-number"}
                                    /> 
                                    </div>
                                    <small className='mt-2 text-gray-400'>Contoh: Kode Negara (+62) dan Nomor Telepon 812345678</small>            
                                </FormControl>
                            </div>
                            {/* mobile */}
                            <div className='p-2 xl:p-0 block xl:hidden'>
                                <div className=' text-gray-700 text-sm md:text-base font-bold mb-2 ml-2 xl:ml-0'>Nomor HP</div>
                                <FormControl sx={{ m: 1, minWidth: 180, borderRadius:60, outlineColor: 'red' }}>
                                    <div className='border border-gray-300 py-2 pl-4'>
                                    <PhoneInput
                                        international
                                        defaultCountry="ID"
                                        value={value}
                                        onChange={setValue}
                                        className={"input-phone-number"}
                                    /> 
                                    </div>
                                    <small className='mt-2 text-gray-400'>Contoh: Kode Negara (+62) dan Nomor Telepon 812345678</small>            
                                </FormControl>
                            </div>
                        </div>
                        
                    </div>
                    <div className='mb-8 py-0 px-0 xl:px-8 form block xl:flex space-x-2 xl:space-x-8 -mt-10 xl:-mt-6'>
                        <div className='p-2 xl:p-0 w-full xl:w-[350px] pl-4'>
                            <div className='text-gray-700 font-bold mb-2 ml-2 xl:ml-0'>Email</div>
                                <div className='pl-2'>
                                    <input type="text" placeholder='Email' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <small className='mt-2 pl-2 text-gray-400'>Contoh: fastravel@email.com</small>
                         </div>
                    </div>
                </div>
                
                {/* sidebra desktop*/}                
                <div className='hidden xl:block w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-[#FF9119] border-b-gray-100'>
                        <div className='text-gray-700 font-medium'>Keberangkatan kereta</div>
                        <small className='text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                    </div>
                    <div className='p-4 px-4 flex justify-between space-x-12 items-center'>
                        <div className='text-slate-600 font-medium'>
                            <div>{dataDetailTrain[0].berangkat_nama_kota}</div>
                            <div>({dataDetailTrain[0].berangkat_id_station})</div>
                        </div>
                        <div className='rounded-full p-2 bg-[#FF9119] '>
                            < TbArrowsLeftRight className='text-white' size={18} />
                        </div>
                        <div className='text-slate-600 font-medium'>
                            <div>{dataDetailTrain[0].tujuan_nama_kota}</div>
                            <div>({dataDetailTrain[0].tujuan_id_station})</div>
                        </div>
                    </div>
                    <div className='p-4 pl-8  text-gray-700'>
                        <div className='font-medium '>{dataBookingTrain[0].trainName}</div>
                        <small>Eksekutif class {dataBookingTrain[0].seats[0].class}</small>
                    </div>
                    <div className='p-4 pl-8'>
                    <ol class="relative border-l border-gray-500 dark:border-gray-700">                  
                            <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].departureTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-md font-medium text-slate-600 dark:text-white">{dataDetailTrain[0].berangkat_nama_kota}</h3>
                                        <p class="text-left font-normal text-gray-500 dark:text-gray-400">({dataDetailTrain[0].berangkat_id_station})</p>
                                    </div>
                                </div>
                            </li>
                            <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-[#FF9119] rounded-full mt-0 -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].arrivalTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-md font-medium text-slate-600 dark:text-white">{dataDetailTrain[0].tujuan_nama_kota}</h3>
                                        <p class="text-left font-normal text-gray-500 dark:text-gray-400">({dataDetailTrain[0].tujuan_id_station})</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                    </div>
                 {/* detail penumpang */}
                 <div className='Booking col-span-1 xl:col-span-2'>
                    <h1 className='text-lg xl:text-2xl font-semibold text-gray-700'>Detail Penumpang</h1>
                    <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
                </div>                 
                 <div className='w-full border border-gray-200 shadow-sm col-span-1  xl:col-span-2'>
                    <div className=''>
                        <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                            {/* desktop */}
                            <div className='mt-0 xl:mt-4'>
                                <div className='text-gray-700 font-bold mb-2 ml-2 xl:ml-0'>Titel</div>
                                <div className='hidden xl:block'>
                                <FormControl sx={{ m: 1, minWidth: 120, borderRadius:60, outlineColor: 'red' }}>
                                        <InputLabel id="demo-simple-select-helper-label">Titel</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Tn.</MenuItem>
                                        <MenuItem value={'Ny.'}>Ny.</MenuItem>
                                        <MenuItem value={'Nn.'}>Nn.</MenuItem>
                                        </Select>
                                </FormControl>
                                </div>
                            </div>
                            <div className='block xl:hidden'>
                                <FormControl sx={{minWidth: "100%", borderRadius:60, outlineColor: 'red' }}>
                                        <InputLabel id="demo-simple-select-helper-label">Titel</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Tn.</MenuItem>
                                        <MenuItem value={'Ny.'}>Ny.</MenuItem>
                                        <MenuItem value={'Nn.'}>Nn.</MenuItem>
                                        </Select>
                                </FormControl>
                                </div>
                            {/* mobile */}
                                    
                            <div className='xl:w-full mt-4'>
                            <div className='text-gray-700 font-bold mb-2'>Nama Lengkap</div>
                                <div>
                                    <input type="text" placeholder='' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mb-8 xl:-mt-12'>
                        <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>

                            {/* desktop */}

                            <div className='mt-0 xl:mt-4'>
                                <div className='text-gray-700 font-bold mb-2 pl-2 xl:pl-0'>Tipe Identitas</div>
                                <div className='hidden xl:block'>
                                <FormControl sx={{ m: 1, minWidth: 120, borderRadius:60, outlineColor: 'red' }}>
                                        <InputLabel id="demo-simple-select-helper-label">Tipe</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Nik</MenuItem>
                                        <MenuItem value={'Ny.'}>Passport</MenuItem>
                                        </Select>
                                </FormControl>
                                </div>
                            </div>

                            {/* mobile */}

                            <div className='block xl:hidden'>
                                <FormControl sx={{minWidth: "100%", borderRadius:60, outlineColor: 'red' }}>
                                    <InputLabel id="demo-simple-select-helper-label">Tipe</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        label="Titel"
                                        >
                                        <MenuItem value={'Tn.'}>Nik</MenuItem>
                                        <MenuItem value={'Ny.'}>Passport</MenuItem>
                                        </Select>
                                </FormControl>
                            </div>

                            <div className='mt-4'>
                                <div className='text-gray-700 font-bold mb-2'>Nomor Identitas</div>
                                    <div>
                                        <input type="text" placeholder='' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <small className='mt-2 text-gray-400'>Pastikan nama dan Nik harus sesuai yang ada di KTP dan isi dengan teliti</small>            
                                </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div className='mt-12 mb-24'>
                <button type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                    <div className="text-white text-MD font-bold">PILIH KURSI</div>
                </button>
                <button type="button" class=" border border-[#FF9119] focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                    <div className="text-[#FF9119] text-md font-bold">KONFIRMASI</div>
                </button>  
            </div>
        </div>
    )
}