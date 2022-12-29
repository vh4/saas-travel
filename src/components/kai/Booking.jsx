import React, {useState} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


export default function BookingKai(){

    const [value, setValue] = useState()


    return(
        // header booking detailt KAI
        <div className=''>
            <div className='jalur-payment-booking flex space-x-8 items-center ml-0 xl:ml-12'>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-[#FF9119] px-2 text-white rounded-full'>1</div>
                    <div className='text-[#FF9119] font-semibold '>Detail pesanan</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-2 text-white rounded-full'>2</div>
                    <div className='text-gray-400 font-semibold '>Konfirmasi pesanan</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-2 text-white rounded-full'>3</div>
                    <div className='text-gray-400 font-semibold '>Pembayaran pesanan</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='bg-gray-400 px-2 text-white rounded-full'>4</div>
                    <div className='text-gray-400 font-semibold '>E-Tiket</div>
                </div>
            </div>
            <div className='Booking mt-12'>
                <h1 className='text-2xl font-semibold text-gray-700'>Booking Kereta</h1>
                <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
            </div>
            <div className='mt-4 grid grid-cols-3 gap-8'>
                {/* form detailt kontal */}
                <div className='w-full border border-gray-200 shadow-sm col-span-2'>
                    <div className=''>
                        <div className='p-8 form flex space-x-8'>
                            <div>
                                <div className='text-gray-700 font-bold mb-2'>Titel</div>
                                <FormControl sx={{ m: 1, minWidth: 180, borderRadius:60, outlineColor: 'red' }}>
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
                            <div className='w-full'>
                            <div className='text-gray-700 font-bold mb-2'>Nama Lengkap</div>
                                <div>
                                    <input type="text" placeholder='Nama Lengkap' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className=' py-0 px-8 form flex space-x-8'>
                            <div>
                                <div className='text-gray-700 font-bold mb-2'>Titel</div>
                                <FormControl sx={{ m: 1, minWidth: 180, borderRadius:60, outlineColor: 'red' }}>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        defaultCountry='INA'
                                        value={value}
                                        onChange={setValue}/>                                   
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* sidebra */}                
                <div className='w-full border border-gray-200 shadow-sm'>
                </div>

                 {/* detail penumpang */}                
                 <div>
                </div>               
            </div>
        </div>
    )
}