import React, {useState, useEffect} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import FormControl from '@mui/material/FormControl';
import 'react-phone-number-input/style.css'
import PhoneInput, {formatPhoneNumber} from 'react-phone-input-2'
import {TbArrowsLeftRight} from 'react-icons/tb'
import { useNavigate } from "react-router-dom";
import { useParams, createSearchParams } from 'react-router-dom';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from "react-hook-form"
import {RxCrossCircled} from 'react-icons/rx'
import Swal from 'sweetalert2'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import 'react-phone-input-2/lib/bootstrap.css'
import { Input, InputPicker } from 'rsuite';

export default function BookingPesawat(){

    useEffect(() => {
        window.scrollTo(0,0)
      },[])


    const {PesawatNumber} = useParams();
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const dataDetail  = JSON.parse(localStorage.getItem(PesawatNumber + '_flight'));
    const dataDetailForBooking  = JSON.parse(localStorage.getItem(PesawatNumber + '_flight_forBooking'));

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function tanggalParse(x){
        var date = new Date(x);
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
    
         const result = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
         return result
    }

    const TotalAdult = parseInt(dataDetailForBooking.adult);
    const TotalChild = parseInt(dataDetailForBooking.child);
    const TotalInfant = parseInt(dataDetailForBooking.infant);

    const AdultArr = Array();
    const ChildArr = Array();
    const InfantArr = Array();

    const data = [
        {
            label:'Mr.',
            value:'MR'    
        },
        {
            label:'Mrs.',
            value:'MRS'    
        },
        {
            label:'Miss.',
            value:'MISS'    
        },        
        {
            label:'Mstr.',
            value:'MSTR'    
        }   
    ];
      
    for(var i = 0; i < TotalAdult; i++){
        AdultArr.push({
            gender:'MR',
            nama_depan: '',
            nama_belakang:'',
            birthdate: null,
            idNumber: '',
        });

    }    

    for(var i = 0; i < TotalInfant; i++){
        InfantArr.push({
            gender:'MSTR',
            nama_depan: '',
            nama_belakang:'',
            birthdate: null,
        });

    }  

    for(var i = 0; i < TotalChild; i++){
        ChildArr.push({
            gender:'MSTR',
            nama_depan: '',
            nama_belakang:'',
            birthdate: null,
            idNumber: '',
        });

    }  

    //untuk handler changes
    const [adult, setAdult] = useState([AdultArr]);
    const [child, setChild] = useState([ChildArr]);
    const [infant, setInfant] = useState([InfantArr]);   

    function addLeadingZero(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return '' + num;
        }
      }

    const handleAdultsubCatagoryChange = (i, category) => e => { 
            
        let adultCategory = adult[0];

        if(category == 'birthdate'){
            const tanggalParse = e.$y + '-' + (addLeadingZero(parseInt(e.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(e.$D)).toString();
            adultCategory[i][category] = tanggalParse;

        }else{
            if(category == 'gender'){
                adultCategory[i][category] = e;
            }else{
                adultCategory[i][category] = e.target.value;
            }
        }
        setAdult([adultCategory]);

    }
    

    const handleChildsubCatagoryChange = (i, category) => e => { 
        
        let childCategory = child[0];

        if(category == 'birthdate'){

            const tanggalParse = e.$y + '-' + (addLeadingZero(parseInt(e.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(e.$D)).toString();
            childCategory[i][category] = tanggalParse;

        }else{
            childCategory[i][category] = e.target.value
        }
        setChild([childCategory]);
        
    }

    const handleInfantsubCatagoryChange = (i, category) => e => { 
        
        let infantCategory = infant[0];

        if(category == 'birthdate'){

            const tanggalParse = e.$y + '-' + (addLeadingZero(parseInt(e.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(e.$D)).toString();
            infantCategory[i][category] = tanggalParse;

        }else{
            infantCategory[i][category] = e.target.value
        }

        setInfant([infantCategory]);
        
    }

    const [email, setEmail] = useState();
    const [hp, setHp] = useState();

    const handlerBookingSubmit = async () => {

        let end_adult = [];
        let end_child = [];
        let end_infant = [];

        setIsLoading(true);
        let email_hp = {
            email:email,
            nomor:hp
        };
        let data_adult = adult[0].map(item => ({...item, ...email_hp}));

        child[0].forEach(item => {
            let date = new Date(item.birthdate);
            let dateString = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0') + '/' + date.getFullYear();
            end_child.push(`CHD;${item.gender};${item.nama_depan.split(" ")[0].toLowerCase()};${item.nama_belakang.toLowerCase()};${dateString};${item.idNumber};ID;ID;;;ID;`);
        });

        infant[0].forEach(item => {
            let date = new Date(item.birthdate);
            let dateString = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0') + '/' + date.getFullYear();
            end_infant.push(`INF;${item.gender};${item.nama_depan.split(" ")[0].toLowerCase()};${item.nama_belakang.toLowerCase()};${dateString};${item.idNumber};ID;ID;;;ID`);
        });
        
        data_adult.forEach(item => {
            let date = new Date(item.birthdate);
            let dateString = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0') + '/' + date.getFullYear();
            // end_adult.push(`ADT;${item.gender};${item.nama_depan.split(" ")[0].toLowerCase()};${item.nama_belakang.toLowerCase()};${dateString};${item.idNumber};::${item.nomor};::${item.nomor};;;;${item.email};KTP;ID;ID;;;;`);
            end_adult.push(`ADT;${item.gender};${item.nama_depan.split(" ")[0].toLowerCase()};${item.nama_belakang.toLowerCase()};${dateString};${item.idNumber};::${item.nomor};::${item.nomor};;;;${item.email};1;ID;ID;;;ID;`);
        });

        let seats = dataDetail.map(item => item.seats[0]);

        const book = {
                airline : dataDetailForBooking.airline,
                departure : dataDetailForBooking.departure,
                arrival : dataDetailForBooking.arrival,
                departureDate : dataDetailForBooking.departureDate,
                returnDate : dataDetailForBooking.returnDate,
                adult : TotalAdult,
                child : TotalChild,
                infant : TotalInfant,
                flights : seats,
                buyer:"",
                passengers : {
                adults : end_adult,
                children:end_child,
                infants:end_infant
            },
            token:token
        }

        const bookingResponse = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/book`, book);

        if(bookingResponse.data.rc === '00'){
            console.log(JSON.stringify(bookingResponse.data));
            localStorage.setItem(PesawatNumber + "_DetailPassenger", JSON.stringify({
                adults : data_adult,
                children:child[0],
                infants:infant[0]
            }));  
            localStorage.setItem(PesawatNumber + "_Bookingflight", JSON.stringify(bookingResponse.data.data));  
            navigate(`/flight/payment/${PesawatNumber}`);
            // window.location = `/flight/payment/${PesawatNumber}`
            setIsLoading(false);
        }else{
            setIsLoading(false);
            if(bookingResponse.data.rc === '73'){
                Swal.fire({
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    },
                        title: 'Maaf, Booking tiket sebelumnya expired!',
                        text: bookingResponse.data.rd,
                        confirmButtonText: "Kembali",
                    }).then(() => navigate('/'));
            }else{
                Swal.fire({
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    },
                        title: 'Maaf, Terdapat Kesalahan!',
                        text: bookingResponse.data.rd,
                        confirmButtonText: "Kembali",
                    });
            }

        }

    }

    const {register, handleSubmit, formState:{ errors }} = useForm();

    return(
        <>
        {token !== undefined && token !== null  ? 
            (
                <div className='-mt-2 xl:mt-0'>
                {/* header kai flow */}
                <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-4 items-center'>
                <div className='flex space-x-2 items-center'>
                    <div className='hidden xl:flex text-blue-500 font-bold'>Detail pesanan</div>
                    <div className='block xl:hidden text-blue-500 font-bold'>Detail</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <RxCrossCircled size={20} className='text-slate-500' />
                    <div className='hidden xl:block text-slate-500'>Pembayaran tiket</div>
                    <div className='block xl:hidden text-slate-500'>Payment</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <RxCrossCircled size={20} className='text-slate-500' />
                    <div className='text-slate-500'>E-Tiket</div>
                </div>
            </div>
            {/* sidebar mobile kai*/}
            <div className='mt-8 xl:mt-0 block xl:hidden rounded-md border border-gray-200 shadow-sm'>
                <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100'>
                    <div className='text-gray-700 text-sm font-bold'>Keberangkatan Pesawat</div>
                    <small className='text-xs text-gray-700'>{tanggalParse(dataDetail.departureDate)}</small>
                </div>
                <div className='px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center'>
                    <div className='text-xs font-bold text-slate-600'>
                        <div>{dataDetail.departureName}</div>
                        <div>({dataDetail.departure})</div>
                    </div>
                    <div className='rounded-full p-1 bg-blue-500 '>
                        < TbArrowsLeftRight className='text-white' size={18} />
                    </div>
                    <div className='text-xs font-bold text-slate-600'>
                        <div>{dataDetail.arrivalName}</div>
                        <div>({dataDetail.arrivalName})</div>
                    </div>
                </div>

                <div className='p-4 pl-8 text-gray-700'>
                    <div className=' text-xs font-bold'>{dataDetail.airlineName}</div>
                    <small>{dataDetail.airline}</small>
                </div>
                <div className='p-4 pl-12 mb-4'>
                <ol class="relative border-l-2 border-dotted border-gray-300 dark:border-gray-700">                  
                        <li class="mb-10 ml-4 text-sm">
                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 dark:border-gray-900 dark:bg-gray-700"></div>
                            <div className='flex space-x-12'>
                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataDetail.departureTime}</time>
                                <div className='-mt-2'>
                                    <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetail.departureName}</h3>
                                    <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetail.departure})</p>
                                </div>
                            </div>
                        </li>
                        <li class="ml-4 text-sm mt-10">
                            <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <div className='flex space-x-12'>
                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataDetail.arrivalTime}</time>
                                <div className='-mt-2'>
                                    <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetail.arrivalName}</h3>
                                    <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetail.arrival})</p>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
        </div>
            <div className=' w-full mb-24 block xl:flex xl:space-x-10'>
                {/* detail passengger Pesawat*/} 
                <form className='block w-full  mt-8 mb-4 xl:mt-12'>
                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2 gap-12'>
                        <div className=''>
                            <div className='p-4 xl:p-8 form block xl:flex xl:space-x-0'>
                                {/* mobile & desktop Nama*/}
                                <div className='xl:w-full mt-4 xl:mt-0'>
                                    <div className='text-gray-500 text-sm font-bold'>Email Address</div>
                                        <div className='block xl:flex xl:space-x-6'>                                        
                                            <div className='w-full'>
                                                <input onChange={(e) => setEmail(e.target.value)} class="border w-full text-gray-500 text-sm rounded-md border-gray-300 focus:border-blue-300 focus:ring-2 ease-in  focus:ring-blue-200 focus:outline-none focus:border block p-3 mt-4" type="text" placeholder='Email Address' id="default-input" />
                                                <div className='mt-2 text-gray-400'><small>Contoh: ex-machina@gmail.com</small></div>            
                                            </div>
                                    </div>
                                </div>
                                <div className='w-full mt-4 xl:mt-0'>
                                 {/* desktop nomor hp */}
                                        <div className='w-full hidden xl:block'>
                                            <div className='text-gray-500 text-sm font-bold mb-2 ml-2'>Nomor HP</div>
                                            <FormControl sx={{ m: 1, borderRadius:60, width:'100%',}}>
                                                <PhoneInput 
                                                  hiddenLabel={true}
                                                  inputProps={{
                                                    required: true,
                                                    autoFocus: true
                                                  }}
                                                    international
                                                    value={hp}
                                                    onChange={setHp}
                                                    country='id'
                                                    inputStyle={{ width:'100%', borderColor:'hover:red', paddingTop:10, paddingBottom:10}}
                                                /> 
                                                <div className='mt-2 text-gray-400'><small>Contoh: (+62) 812345678</small></div>            
                                            </FormControl>
                                        </div>
                                        {/* mobile nomor hp */}
                                        <div className='w-full xl:p-0 block xl:hidden'>
                                        <div className='w-full text-gray-500 text-sm md:text-base font-bold mb-2'>Nomor HP</div>
                                        <div className='xl:w-full mt-4 xl:mt-0  ml-2 '>
                                                <div className='w-full border border-gray-300 py-1.5 pl-4 -mx-2  focus:border-blue-500'>
                                                <PhoneInput 
                                                  hiddenLabel={true}
                                                  inputProps={{
                                                    required: true,
                                                    autoFocus: true
                                                  }}
                                                    international
                                                    value={hp}
                                                    onChange={setHp}
                                                    country='id'
                                                    inputStyle={{ width:'100%', borderColor:'hover:red', paddingTop:10, paddingBottom:10}}
                                                /> 
                                                </div>
                                                <div className='text-xs mt-2 text-gray-400'>Contoh: +62812345678</div>            
                                        </div>                                
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { adult[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking  mt-8 mb-4 xl:mt-12'>
                                    <h1 className='text-sm font-bold text-slate-500'>ADULT PASSENGER</h1>
                                    <small className='text-gray-500'>Isi sesuai dengan data anda</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                        <div className='text-gray-500 text-sm font-bold'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>
                                                                    <InputPicker data={data} value={e.gender}  size='lg' onChange={handleAdultsubCatagoryChange(i, 'gender')} style={{color:'gray'}} required />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={e.gender}
                                                                        hiddenLabel={true}
                                                                        onChange={handleAdultsubCatagoryChange(i, 'gender')}
                                                                    >
                                                                        <MenuItem value={'MR'}>Tuan.</MenuItem>
                                                                        <MenuItem value={'MRS'}>Nyonya.</MenuItem>
                                                                        <MenuItem value={'MISS'}>Nona.</MenuItem>
                                                                    </Select>
                                                                </FormControl>  
                                                            </div>
                                                            <div className='w-full grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 font-bold text-sm'>Nama Depan</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2"  value={e.nama_depan} onChange={handleAdultsubCatagoryChange(i, 'nama_depan')}  type="text" placeholder='Nama Depan' id="default-input" />
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 font-bold text-sm'>Nama Belakang</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2"  value={e.nama_belakang} onChange={handleAdultsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input" />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full xl:p-0 hidden xl:block'>
                                                        <div className='w-full text-gray-500 text-sm font-bold mb-2'>Tanggal Lahir</div>
                                                        <FormControl sx={{borderRadius:60, outlineColor: 'gray', width:'100%' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleAdultsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile tanggal lahir */}
                                                    <div className='w-full xl:p-0 block xl:hidden'>
                                                        <div className='pl-4 mt-2 text-gray-500 text-sm font-bold'>Tanggal Lahir</div>
                                                        <FormControl sx={{padding:2, borderRadius:60, outlineColor: 'gray', width:'100%' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleAdultsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block '>
                                                                <div className='text-gray-500 text-sm font-bold'>No. Ktp</div>
                                                                <input value={e.idNumber} onChange={handleAdultsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK' id="default-input" class="border w-full  border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" />
                                                                <div><small className='mt-2 text-gray-400'>Contoh: 16 digit nomor</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }

                    {/* Child loop */}
                    { child[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking  mt-8 mb-4 xl:mt-12'>
                                    <h1 className='text-sm font-bold text-slate-500'>CHILD PASSENGER</h1>
                                    <small className='text-gray-500'>Isi sesuai dengan data anak anda</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                        <div className='text-gray-500 text-sm font-bold'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={e.gender}
                                                                        hiddenLabel={true}
                                                                        onChange={handleChildsubCatagoryChange(i, 'gender')}
                                                                    >
                                                                        <MenuItem value={'MSTR'}>Mstr.</MenuItem>
                                                                    </Select>
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={e.gender}
                                                                        hiddenLabel={true}
                                                                        onChange={handleChildsubCatagoryChange(i, 'gender')}
                                                                    >
                                                                        <MenuItem value={'MSTR'}>Mstr.</MenuItem>
                                                                    </Select>
                                                                </FormControl>  
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 font-bold text-sm'>Nama Depan</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" value={e.nama_depan} onChange={handleChildsubCatagoryChange(i, 'nama_depan')}  type="text" placeholder='Nama Depan' id="default-input" />
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 font-bold text-sm'>Nama Belakang</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" value={e.nama_belakang} onChange={handleChildsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input" />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 mt-0 xl:-mt-6 xl:gap-2'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full xl:p-0 hidden xl:block'>
                                                        <div className=' text-gray-500 text-sm font-bold mb-2'>Tanggal Lahir</div>
                                                        <FormControl sx={{borderRadius:60, outlineColor: 'gray', width:'100%' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleChildsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile tanggal lahir */}
                                                    <div className='w-full xl:p-0 block xl:hidden'>
                                                        <div className='w-full pl-4 mt-2 text-gray-500 text-sm font-bold'>Tanggal Lahir</div>
                                                        <FormControl sx={{padding:2, borderRadius:60, outlineColor: 'gray', width:'100%' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleChildsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block '>
                                                                <div className='text-gray-500 text-sm font-bold'>No. Ktp</div>
                                                                <input value={e.idNumber} onChange={handleChildsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK' id="default-input" class="border w-full  border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" />
                                                                <div><small className='mt-2 text-gray-400'>Contoh: 16 digit nomor</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }


                    { infant[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking  mt-8 mb-4 xl:mt-12'>
                                    <h1 className='text-sm font-bold text-slate-500'>INFANT PASSENGER</h1>
                                    <small className='text-gray-500'>Isi sesuai dengan data bayi anda</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0'>
                                                        <div className='text-gray-500 text-sm font-bold'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={e.gender}
                                                                        hiddenLabel={true}
                                                                        onChange={handleInfantsubCatagoryChange(i, 'gender')}
                                                                    >
                                                                        <MenuItem value={'MSTR'}>Mstr.</MenuItem>
                                                                    </Select>
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={e.gender}
                                                                        hiddenLabel={true}
                                                                        onChange={handleInfantsubCatagoryChange(i, 'gender')}
                                                                    >
                                                                        <MenuItem value={'MSTR'}>Mstr.</MenuItem>
                                                                    </Select>
                                                                </FormControl>  
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                <div className='text-gray-500 font-bold text-sm'>Nama Depan</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" value={e.nama_depan} onChange={handleInfantsubCatagoryChange(i, 'nama_depan')} type="text" placeholder='Nama Depan' id="default-input" />
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 font-bold text-sm'>Nama Belakang</div>
                                                                    <input class="border w-full border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" value={e.nama_belakang} onChange={handleInfantsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input" />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 xl:gap-4 mt-0 xl:-mt-6'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full xl:p-0 hidden xl:block'>
                                                        <div className='w-full text-gray-500 text-sm font-bold mb-2'>Tanggal Lahir</div>
                                                        <FormControl sx={{borderRadius:60, outlineColor: 'gray', width:"100%" }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleInfantsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    {/* mobile tanggal lahir */}
                                                    <div className='w-full xl:p-0 block xl:hidden'>
                                                        <div className='pl-4 mt-2 text-gray-500 text-sm font-bold'>Tanggal Lahir</div>
                                                        <FormControl sx={{padding:2, borderRadius:60, outlineColor: 'gray', width:'100%' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker key={ i + 1}
                                                                onChange={handleInfantsubCatagoryChange(i, 'birthdate')}
                                                                value={e.birthdate}
                                                                renderInput={(params) => <TextField {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                            <small className='mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                        </FormControl>
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block '>
                                                                <div className='text-gray-500 text-sm font-bold'>No. Ktp</div>
                                                                <input value={e.idNumber} onChange={handleInfantsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK' id="default-input" class="border w-full  border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-none focus:outline-none focus:border block p-4 mt-2" />
                                                                <div><small className='mt-2 text-gray-400'>Contoh: 16 digit nomor</small></div>
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
                    <button onClick={handleSubmit(handlerBookingSubmit)} type="button" class="text-white  bg-blue-500 space-x-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center mr-2 mb-2">
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
                            <div className="text-white text-sm font-bold">LANJUT KE PEMBAYARAN</div>
                        )
                        }
                        </button>
                    </div>                     

                </form>

                {/* sidebra desktop*/}
                <div className='w-1/2'>
                    {dataDetail.map((dataDetail) =>(
                        <>
                            <div className='hidden xl:block rounded-md border border-gray-200 shadow-sm mb-4'>
                                <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100'>
                                    <div className='text-gray-700 text-sm font-bold'>Keberangkatan Pesawat</div>
                                    <small className='text-xs text-gray-700'>{tanggalParse(dataDetail.departureDate)}</small>
                                </div>
                                <div className='px-4 p-8 flex justify-between space-x-8 mx-4 items-center'>
                                    <div className='text-xs font-bold text-slate-600'>
                                        <div>{dataDetail.departureName}</div>
                                        <div>({dataDetail.departure})</div>
                                    </div>
                                    <div className='rounded-full p-1 bg-blue-500 '>
                                        < TbArrowsLeftRight className='text-white' size={18} />
                                    </div>
                                    <div className='text-xs font-bold text-slate-600'>
                                        <div>{dataDetail.arrivalName}</div>
                                        <div>({dataDetail.arrival})</div>
                                    </div>
                                </div>

                                <div className='p-2 -mt-2 mb-2  pl-8 relative px-4 text-gray-700'>
                                    <div className='flex items-center space-x-2'>
                                        <img src={dataDetail.airlineIcon} width={50} alt="icon.png" />
                                        <div className='text-gray-500 text-xs font-bold'>{dataDetail.airlineName} ({dataDetail.airline})</div>
                                    </div>
                                </div>
                                <div className='p-4 pl-8 pt-4 px-6 mb-4'>
                                <ol class="relative border-l-2 border-dotted border-gray-300 dark:border-gray-700">                  
                                        <li class="mb-10 ml-4 text-sm">
                                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 dark:border-gray-900 dark:bg-gray-700"></div>
                                            <div className='flex space-x-12'>
                                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataDetail.departureTime}</time>
                                                <div className='-mt-2'>
                                                    <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetail.departureName}</h3>
                                                    <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetail.departure})</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="ml-4 text-sm mt-10">
                                            <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <div className='flex space-x-12'>
                                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 dark:text-gray-500">{dataDetail.arrivalTime}</time>
                                                <div className='-mt-2'>
                                                    <h3 class="text-left text-xs font-bold text-slate-600 dark:text-white">{dataDetail.arrivalName}</h3>
                                                    <p class="text-left text-xs font-bold text-gray-500 dark:text-gray-400">({dataDetail.arrival})</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                        </div>
                        </>
                    ))}

                </div>
            </div>
        </div>
            )
        : ''}
        </>
    )
}