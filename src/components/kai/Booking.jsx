import React, {useState, useEffect} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import FormControl from '@mui/material/FormControl';
import 'react-phone-number-input/style.css'
import PhoneInput, {formatPhoneNumber} from 'react-phone-number-input'
import '../../index.css';
import {TbArrowsLeftRight} from 'react-icons/tb'
import { useNavigate } from "react-router";
import { useParams } from 'react-router';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from "react-hook-form"

export default function BookingKai(){

    const [value, setValue] = useState();
    const navigate = useNavigate();
    const {trainNumber} = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [inputBooking, setInputBooking] = useState([]);

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
     const TotalAdult = parseInt(dataDetailTrain[0].adult);
     const TotalChild = parseInt(dataDetailTrain[0].child);
     const TotalInfant = parseInt(dataDetailTrain[0].infant);

    const AdultArr = Array();
    const childArr = Array();
    const InfantArr = Array();

    for(var i = 0; i < TotalAdult; i++){
        AdultArr.push({
            name: '',
            birthdate: '',
            idNumber: '',
            phone: '',
        });

    }

    for(var i = 0; i < TotalChild; i++){
        childArr.push({
            name: '',
            birthdate: '',
            idNumber: '',
        });

    }    

    for(var i = 0; i < TotalInfant; i++){
        InfantArr.push({
            name: '',
            birthdate: '',
            idNumber: '',
        });

    }  
         //untuk handler changes
        const [adult, setAdult] = useState([AdultArr]);
        const [child, setChild] = useState([childArr]);
        const [infant, setInfant] = useState([InfantArr]);


        const handleAdultsubCatagoryChange = (i, category) => e => { 
            
            const adultCategory = adult[0];

            category === 'phone' ? adultCategory[i][category] = e : adultCategory[i][category] = e.target.value

            setAdult([adultCategory]);
            
        }

        function addLeadingZero(num) {
            if (num < 10) {
              return '0' + num;
            } else {
              return '' + num;
            }
          }

        const handleChildsubCatagoryChange = (i, category) => e => { 
            
            const childCategory = child[0];

            if(category === 'birthdate'){

                const tanggalParse = e.$y + '-' + (addLeadingZero(parseInt(e.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(e.$D)).toString();
                childCategory[i][category] = tanggalParse;

            }else{
                childCategory[i][category] = e.target.value
            }

            setChild([childCategory]);            
        }

        const handleInfantsubCatagoryChange = (i, category) => e => { 
            
            const infantCategory = infant[0];

            if(category === 'birthdate'){

                const tanggalParse = e.$y + '-' + (addLeadingZero(parseInt(e.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(e.$D)).toString();
                infantCategory[i][category] = tanggalParse;

            }else{
                infantCategory[i][category] = e.target.value
            }

            setInfant([infantCategory]);
            
        }

        const {register, handleSubmit, formState:{ errors }} = useForm();

        const handlerBookingSubmit = async () => {
        
            setIsLoading(true);


                var priceInfantChild;

                TotalChild > 0 ? priceInfantChild = dataBookingTrain[0].seats[0].priceAdult : priceInfantChild = '-';   

                adult[0].map((data) =>{
                    data.phone = formatPhoneNumber(data.phone);
                })
    
                const dataBookingSubmit = {
    
                    "productCode" : "WKAI",
                    "origin" : dataDetailTrain[0].berangkat_id_station,
                    "destination" : dataDetailTrain[0].tujuan_id_station, 
                    "date" : dataBookingTrain[0].arrivalDate,
                    "trainNumber" : parseInt(dataBookingTrain[0].trainNumber),
                    "grade" : dataBookingTrain[0].seats[0].grade,
                    "class" : dataBookingTrain[0].seats[0].class,
                    "adult" : TotalAdult,
                    "child" : TotalChild,
                    "infant" : TotalInfant,
                    "trainName" : dataBookingTrain[0].trainName,
                    "departureStation" : dataDetailTrain[0].stasiunBerangkat,
                    "departureTime" : dataBookingTrain[0].departureTime,
                    "arrivalStation" : dataDetailTrain[0].stasiunTujuan,
                    "arrivalTime" : dataBookingTrain[0].arrivalTime,
                    "priceAdult" : parseInt(dataBookingTrain[0].seats[0].priceAdult),
                    "priceChild" : priceInfantChild,
                    "priceInfant" : priceInfantChild,
                    "passengers": {
                        "adults": adult[0],
                        "children": TotalChild > 0 ? child[0] : [],
                        "infants": TotalInfant > 0 ? infant[0] : []                    
                    },
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjhkNzNtbmc4OWVkIn0.eyJpc3MiOiJodHRwczpcL1wvYXBpLmZhc3RyYXZlbC5jby5pZCIsImF1ZCI6IkZhc3RyYXZlbEIyQiBDbGllbnQiLCJqdGkiOiI4ZDczbW5nODllZCIsImlhdCI6MTY3MjE5NzI0MywibmJmIjoxNjcyMTk3MzAyLCJleHAiOjE2NzIyMDA4NDIsIm91dGxldElkIjoiRkE0MDMzMjgiLCJwaW4iOiI1MzcyMDEiLCJrZXkiOiJGQVNUUEFZIn0.nMgrQ7qFBMFcdqhABEe8B4x6T5E_Kqb7hQFoXkq-kaA",
                };

            const response = await axios.post('http://localhost:5000/travel/train/book', dataBookingSubmit);

            if(response.data.rc !== '00'){
                alert(response.data.rd)
            }

            console.log(response);

            setIsLoading(false);

        }
        


    return(
        
        // header booking detailt KAI
        <div className='-mt-8 xl:mt-0'>
            {/* header kai flow */}
            <div className='flex justify-start jalur-payment-booking text-xs xl:text-md space-x-2 xl:space-x-8 items-center'>
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
            {/* sidebar mobile kai*/}
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
            <div className='mb-24 block xl:flex xl:space-x-10'>
                {/* detail passengger kai*/} 
                <form className='block'>
                    {/* adult loop */}

                    { adult[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking ml-2 mt-8 mb-4 xl:mt-12'>
                                    <h1 className='xl:text-xl font-semibold text-gray-700 text-md'>Adult Passenger</h1>
                                    <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                    <div className='text-gray-700 text-sm font-bold mb-2'>Nama Lengkap</div>
                                                        <div>
                                                            <input {...register(`name${i}`, {required:true})} value={e.name} onChange={handleAdultsubCatagoryChange(i, 'name')}  type="text" placeholder='Nama Lengkap' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                            {errors[`name${i}`]?.type === "required" ? (<small className='ml-2 text-red-500'>Nama harus diisi</small>) : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-8'>
                                                <div className='py-0 px-0 xl:px-8  block xl:flex space-x-2 xl:space-x-8 mt-0 xl:-mt-6'>
                                                    {/* desktop nomor hp */}
                                                    <div className='p-2 xl:p-0 hidden xl:block'>
                                                        <div className=' text-gray-700 text-sm  font-bold mb-2 ml-2'>Nomor HP</div>
                                                        <FormControl sx={{ m: 1, borderRadius:60, outlineColor: 'red' }}>
                                                            <div className='border border-gray-300 py-1 pl-4'>
                                                            <PhoneInput
                                                                international
                                                                {...register(`phone${i}`, { required: true} )}
                                                                defaultCountry="ID"
                                                                value={e.phone} 
                                                                onChange={handleAdultsubCatagoryChange(i, 'phone')}
                                                                className={"input-phone-number"}
                                                            /> 
                                                            </div>
                                                            {errors[`phone${i}`]?.type === "required" ? (<small className='text-red-500'>Nomor HP harus diisi</small>) : ''}
                                                            <div className='mt-2 text-gray-400'><small>Contoh: (+62) 812345678</small></div>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile nomor hp */}
                                                    <div className='p-2 xl:p-0 block xl:hidden'>
                                                        <div className=' text-gray-700 text-sm md:text-base font-bold mb-2 ml-2'>Nomor HP</div>
                                                        <FormControl sx={{ m: 1, borderRadius:60, outlineColor: 'red' }}>
                                                            <div className='border border-gray-300 py-1 pl-4'>
                                                            <PhoneInput
                                                                international
                                                                {...register(`phones${i}`, { required: true} )}
                                                                defaultCountry="ID"
                                                                value={e.phone} 
                                                                onChange={handleAdultsubCatagoryChange(i, 'phone')}
                                                                className={"input-phone-number"}
                                                            /> 
                                                            </div>
                                                            {errors[`phones${i}`]?.type === "required" ? (<small className='text-red-500'>Nomor HP harus diisi</small>) : ''}
                                                            <div className='mt-2 text-gray-400'>Contoh: (+62) 812345678</div>            
                                                        </FormControl>
                                                    </div>

                                                    {/* mobile & desktop NIK*/}
                                                    
                                                    <div className='block'>
                                                        <div className='block pr-4 ml-4'>
                                                                <div className='text-gray-700 text-sm font-bold mb-2'>Nomor Keluarga (NIK)</div>
                                                                <input   {...register(`idNumber${i}`, { required: true} )} value={e.idNumber} onChange={handleAdultsubCatagoryChange(i, 'idNumber')} type="text" placeholder='NIK' id="default-input" class="w-full border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-3.5 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                {errors[`idNumber${i}`]?.type === "required" ? (<small className='text-red-500'>NIK harus diisi</small>) : ''}
                                                                <div><small className='mt-2 text-gray-400'>Contoh: 16 digit, 1111222233334444</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }

                    {/* child loop */}

                    { child[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking ml-2 mt-8 mb-4 xl:mt-12'>
                                    <h1 className='xl:text-xl font-semibold text-gray-700 text-md'>Child Passenger</h1>
                                    <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                    <div className='text-gray-700 text-sm font-bold mb-2'>Nama Lengkap</div>
                                                        <div>
                                                            <input value={e.name} onChange={handleChildsubCatagoryChange(i, 'name')} type="text" placeholder='Nama Lengkap' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-8'>
                                                <div className='py-0 px-0 xl:px-8  block xl:flex space-x-2 xl:space-x-8 mt-0 xl:-mt-6'>
                                                    {/* desktop nomor hp */}
                                                    <div className='p-2 xl:p-0 hidden xl:block'>
                                                        <div className=' text-gray-700 text-sm  font-bold mb-2 ml-2'>Tanggal Lahir</div>
                                                        <FormControl sx={{ m: 1, borderRadius:60, outlineColor: 'gray' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                value={e.birthdate}
                                                                onChange={handleChildsubCatagoryChange(i, 'birthdate')}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile & desktop NIK*/}
                                                    
                                                    <div className='block'>
                                                        <div className='block pr-4 ml-4'>
                                                                <div className='text-gray-700 text-sm font-bold mb-2'>Nomor Keluarga (NIK)</div>
                                                                <input value={e.idNumber} onChange={handleChildsubCatagoryChange(i, 'idNumber')} type="text" placeholder='NIK' id="default-input" class="w-full border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                <small className='block mt-2 text-gray-400'>Contoh: 16 digit, 1111222233334444</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }


                    {/* Infant loop */}

                    { infant[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking ml-2 mt-8 mb-4 xl:mt-12'>
                                    <h1 className='xl:text-xl font-semibold text-gray-700 text-md'>Infant Passenger</h1>
                                    <small className='text-gray-500'>isi dengan detail pemesanan kereta</small>
                                </div>
                                {/* Detailt */}            
                                <div className='mb-24 flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                    <div className='text-gray-700 text-sm font-bold mb-2'>Nama Lengkap</div>
                                                        <div>
                                                            <input value={e.name} onChange={handleInfantsubCatagoryChange(i, 'name')} type="text" placeholder='Nama Lengkap' id="default-input" class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-4 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-8'>
                                                <div className='py-0 px-0 xl:px-8  block xl:flex space-x-2 xl:space-x-8 mt-0 xl:-mt-6'>
                                                    {/* desktop nomor hp */}
                                                    <div className='p-2 xl:p-0 hidden xl:block'>
                                                        <div className=' text-gray-700 text-sm  font-bold mb-2 ml-2'>Tanggal Lahir</div>
                                                        <FormControl sx={{ m: 1, borderRadius:60, outlineColor: 'gray' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleInfantsubCatagoryChange(i, 'birthdate')}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile nomor hp */}
                                                    <div className='p-2 xl:p-0 block xl:hidden'>
                                                        <div className=' text-gray-700 text-sm md:text-base font-bold mb-2 ml-2'>Nomor HP</div>
                                                        <FormControl sx={{ m: 1, borderRadius:60, outlineColor: 'red' }}>
                                                            <div className='border border-gray-300 py-1 pl-4'>
                                                            <PhoneInput
                                                                international
                                                                defaultCountry="ID"
                                                                value={value}
                                                                onChange={setValue}
                                                                className={"input-phone-number"}
                                                            /> 
                                                            </div>
                                                            <small className='mt-2 text-gray-400'>Contoh: (+62) 812345678</small>            
                                                        </FormControl>
                                                    </div>

                                                    {/* mobile & desktop NIK*/}
                                                    
                                                    <div className='block'>
                                                        <div className='block pr-4 ml-4'>
                                                                <div className='text-gray-700 text-sm font-bold mb-2'>Nomor Keluarga (NIK)</div>
                                                                <input value={e.idNumber} onChange={handleInfantsubCatagoryChange(i, 'idNumber')} type="text" placeholder='NIK' id="default-input" class="w-full border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-3.5 mt-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                <small className='mt-2 text-gray-400'>Contoh: 16 digit, 1111222233334444</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }

                    <div className='flex justify-end mr-2 mt-8'>
                    <button onClick={handleSubmit(handlerBookingSubmit)} type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                            {isLoading ? (
                            <div className="flex space-x-2 items-center">
                                <svg aria-hidden="true" class="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <div class="">Loading...</div>
                            </div>
                            )
                        :
                        (
                            <div className="text-white text-MD font-bold">KONFIRMASI</div>
                        )
                        }
                        </button>
                    </div>                     

                </form>
                {/* sidebra desktop*/}
                <div className='xl:mt-24'>
                    <div className='hidden xl:block rounded-md border border-gray-200 shadow-sm'>
                            <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-[#FF9119] border-b-gray-100'>
                                <div className='text-gray-700 text-sm font-bold'>Keberangkatan kereta</div>
                                <small className='text-xs text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                            </div>
                            <div className='px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center'>
                                <div className='text-xs font-bold text-slate-600'>
                                    <div>{dataDetailTrain[0].berangkat_nama_kota}</div>
                                    <div>({dataDetailTrain[0].berangkat_id_station})</div>
                                </div>
                                <div className='rounded-full p-1 bg-[#FF9119] '>
                                    < TbArrowsLeftRight className='text-white' size={18} />
                                </div>
                                <div className='text-xs font-bold text-slate-600'>
                                    <div>{dataDetailTrain[0].tujuan_nama_kota}</div>
                                    <div>({dataDetailTrain[0].tujuan_id_station})</div>
                                </div>
                            </div>
                            <div className='p-4 pl-8 text-gray-700'>
                                <div className=' text-xs font-bold'>{dataBookingTrain[0].trainName}</div>
                                <small>Class {dataBookingTrain[0].seats[0].class}</small>
                            </div>
                            <div className='p-4 pl-12 mb-4'>
                            <ol class="relative border-l-2 border-dotted border-gray-300 dark:border-gray-700">                  
                                    <li class="mb-10 ml-4 text-sm">
                                        <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 dark:border-gray-900 dark:bg-gray-700"></div>
                                        <div className='flex space-x-12'>
                                            <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].departureTime}</time>
                                            <div className='-mt-2'>
                                                <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetailTrain[0].berangkat_nama_kota}</h3>
                                                <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetailTrain[0].berangkat_id_station})</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="ml-4 text-sm mt-10">
                                        <div class="absolute mt-2 w-4 h-4 bg-[#FF9119] rounded-full -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                        <div className='flex space-x-12'>
                                            <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].arrivalTime}</time>
                                            <div className='-mt-2'>
                                                <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetailTrain[0].tujuan_nama_kota}</h3>
                                                <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetailTrain[0].tujuan_id_station})</p>
                                            </div>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}