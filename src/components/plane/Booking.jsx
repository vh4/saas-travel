import React, {useState, useEffect} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import FormControl from '@mui/material/FormControl';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-input-2'
import {TbArrowsLeftRight} from 'react-icons/tb'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useForm } from "react-hook-form"
import {RxCrossCircled} from 'react-icons/rx'
import 'react-phone-input-2/lib/bootstrap.css'
import {Button, DatePicker } from 'antd';
import { Input, Form } from 'antd';
import { Select } from 'antd';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { Modal } from 'antd';

export default function BookingPesawat(){

    useEffect(() => {
        window.scrollTo(0,0)
      },[]);

    const {PesawatNumber} = useParams();
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const dataDetail  = JSON.parse(localStorage.getItem(PesawatNumber + '_flight'));
    const dataDetailForBooking  = JSON.parse(localStorage.getItem(PesawatNumber + '_flight_forBooking'));
    const [api, contextHolder] = notification.useNotification();

    const failedNotification = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + '',
        });
      };

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    var err = false;

    if(token === null || token === undefined){
        err  =true;
    }

    if(dataDetail == null || dataDetail == undefined){
        err  = true;
    }

    if(dataDetailForBooking == null || dataDetailForBooking == undefined){
        err  = true;

    }


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

    const TotalAdult = dataDetailForBooking ? parseInt(dataDetailForBooking.adult) : 0;
    const TotalChild = dataDetailForBooking ? parseInt(dataDetailForBooking.child) : 0;
    const TotalInfant = dataDetailForBooking ? parseInt(dataDetailForBooking.infant) : 0;

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

    const dataInfChld = [      
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
            birthdate: new Date().getFullYear() + '-' + (addLeadingZero(parseInt(new Date().getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(new Date().getDay())).toString(),
            idNumber: '',
        });

    }    

    for(var i = 0; i < TotalInfant; i++){
        InfantArr.push({
            gender:'MSTR',
            nama_depan: '',
            nama_belakang:'',
            birthdate: new Date().getFullYear() + '-' + (addLeadingZero(parseInt(new Date().getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(new Date().getDay())).toString(),
        });

    }  

    for(var i = 0; i < TotalChild; i++){
        ChildArr.push({
            gender:'MSTR',
            nama_depan: '',
            nama_belakang:'',
            birthdate: new Date().getFullYear() + '-' + (addLeadingZero(parseInt(new Date().getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(new Date().getDay())).toString(),
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
            let tanggalParse = new Date(e);
                tanggalParse = tanggalParse.getFullYear() + '-' + (addLeadingZero(parseInt(tanggalParse.getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalParse.getDay())).toString();
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

            let tanggalParse = new Date(e);
            tanggalParse = tanggalParse.getFullYear() + '-' + (addLeadingZero(parseInt(tanggalParse.getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalParse.getDay())).toString();
            childCategory[i][category] = tanggalParse;

        }else{
            childCategory[i][category] = e.target.value
        }
        setChild([childCategory]);
        
    }

    const handleInfantsubCatagoryChange = (i, category) => e => { 
        
        let infantCategory = infant[0];

        if(category == 'birthdate'){

            let tanggalParse = new Date(e);
            tanggalParse = tanggalParse.getFullYear() + '-' + (addLeadingZero(parseInt(tanggalParse.getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalParse.getDay())).toString();
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
               failedNotification(bookingResponse.data.rd)
            }else{
                failedNotification(bookingResponse.data.rd);
            }

        }

    }

    const disabledDate = (current, e, i) => {
            
        const twoYearsAgo = dayjs().subtract(2, 'year');
        const endOfMonth = twoYearsAgo.endOf('month');
        const endOfDays = endOfMonth.subtract(1, 'day');

        const currentDate = dayjs().subtract(1, 'day');

        return current && (current < endOfDays || current > currentDate);
    };

    const disabledDateAdult = (current) => {
        const TenYearsAgo = dayjs().subtract(12, 'year');

        const endOfMonth = TenYearsAgo.endOf('month');
        const endOfDays = endOfMonth.subtract(1, 'day');

        return current && current > endOfDays;

      };

      const disabledDateChild = (current) => {
        
        const twoYearsAgo = dayjs().subtract(2, 'year');
        const TenYearsAgo = dayjs().subtract(12, 'year');

        const startOfMonth = TenYearsAgo.endOf('month');
        const endOfDays = startOfMonth.subtract(1, 'day');

        const endOfMonth = twoYearsAgo.endOf('month');


        return current && (current < endOfDays || current > endOfMonth);
      };


    const {register, handleSubmit, formState:{ errors }} = useForm();

    return(
        <>
        {/* message notification  */}
        {contextHolder}

        {err !== true ? 
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
            {/* sidebar mobile plane*/}
            {dataDetail && dataDetail.map((dataDetail) =>(
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
                            <div>({dataDetail.arrival})</div>
                            </div>
                        </div>
        
                        <div className='p-2 -mt-2 mb-2  pl-8 relative px-4 text-gray-700'>
                            <div className='flex items-center space-x-2'>
                                <img src={dataDetail.airlineIcon} width={50} alt="icon.png" />
                                <div className='text-gray-500 text-xs font-bold'>{dataDetail.airlineName} ({dataDetail.airline})</div>
                            </div>
                        </div>
                        <div className='p-4 pl-12 mb-4'>
                        <ol class="relative border-l-2 border-dotted border-gray-300 ">                  
                                <li class="mb-10 ml-4 text-sm">
                                    <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400  "></div>
                                    <div className='flex space-x-12'>
                                        <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataDetail.departureTime}</time>
                                        <div className='-mt-2'>
                                            <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetail.departureName}</h3>
                                            <p class="text-left text-xs font-bold text-gray-500 ">({dataDetail.departure})</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="ml-4 text-sm mt-10">
                                    <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white  "></div>
                                    <div className='flex space-x-12'>
                                        <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataDetail.arrivalTime}</time>
                                        <div className='-mt-2'>
                                            <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetail.arrivalName}</h3>
                                            <p class="text-left text-xs font-bold text-gray-500 ">({dataDetail.arrival})</p>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                </div>
            ))}

            <div className=' w-full mb-24 block xl:flex xl:space-x-10'>
                {/* detail passengger Pesawat*/} 
                <Form onFinish={handleSubmit(handlerBookingSubmit)} className='block w-full  mt-8 mb-4 xl:mt-12'>
                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2 gap-12'>
                        <div className=''>
                            <div className='p-4 xl:p-8 form block xl:flex xl:space-x-2'>
                                {/* mobile & desktop Nama*/}
                                <div className='xl:w-full mt-4 xl:mt-0'>
                                    <div className='text-gray-500 text-sm'>Email Address</div>
                                        <div className='block xl:flex xl:space-x-6'>                                        
                                            <div className='w-full'>
                                                <Form.Item name={`emailAdult`} rules={[{required:true, type:'email', message:'Tolong diisi input email yang benar'}]}>
                                                    <Input size='large' className='mt-2'  onChange={(e) => setEmail(e.target.value)}  type="text" placeholder='Email Address'/>
                                                </Form.Item>
                                                <div className='mt-2 text-gray-400'><small>Contoh: ex-machina@gmail.com</small></div>            
                                            </div>
                                    </div>
                                </div>
                                <div className='w-full mt-4 xl:mt-0'>
                                 {/* desktop nomor hp */}
                                        <div className='w-full'>
                                            <div className='text-gray-500 text-sm mb-2 ml-2'>Nomor HP</div>
                                            <Form.Item name={`nomorHPAdult`} rules={[{required:true, message:'Tolong diisi input nomor HP'}, { min: 10, message: 'Nomor HP harus min. 10 huruf.' }]}>
                                                <PhoneInput
                                                  hiddenLabel={true}
                                                    international
                                                    value={hp}
                                                    onChange={setHp}
                                                    country='id'
                                                    inputStyle={{ width:'100%', borderColor:'hover:red', paddingTop:7, paddingBottom:7}}
                                                />
                                            </Form.Item>
                                            <div className='mt-2 text-gray-400'><small>Contoh: (+62) 812345678</small></div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { adult[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0'>
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
                                                        <div className='text-gray-500 text-sm'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>                                                
                                                                <Select
                                                                    style={{ width: 120 }}
                                                                    options={data}
                                                                    value={e.gender}
                                                                    size='large'
                                                                    onChange={handleAdultsubCatagoryChange(i, 'gender')} 
                                                                    />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                <Select
                                                                    style={{ width: 120 }}
                                                                    options={data}
                                                                    value={e.gender}
                                                                    size='large'
                                                                    onChange={handleAdultsubCatagoryChange(i, 'gender')} 
                                                                    />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='w-full grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Depan</div>
                                                                    <Form.Item  name={`namadepanAdult${i}`} rules={[{required:true, message:'Tolong diisi input nama depan'}, { min: 3, message: 'Nama depan harus min. 3 huruf.' }]}>
                                                                        <Input size='large' className='mt-2' value={e.nama_depan} onChange={handleAdultsubCatagoryChange(i, 'nama_depan')}  type="text" placeholder='Nama Depan' id="default-input" />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Belakang</div>
                                                                    <Form.Item  name={`namabelakangAdult${i}`} rules={[{required:true, message:'Tolong diisi input nama belakang'}, { min: 2, message: 'Nama belakang harus min. 2 huruf.' }]}>
                                                                        <Input size='large' className='mt-2'   value={e.nama_belakang} onChange={handleAdultsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input"/>
                                                                    </Form.Item>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full px-4 xl:px-0'>
                                                        <div className='xl:px-0 w-full text-gray-500 text-sm mb-2'>Tanggal Lahir</div>                                                        
                                                        <Form.Item  name={`tanggalAdult${i}`} rules={[{required:true, message:'Tolong diisi input tanggal lahir'}, ]}>
                                                            <DatePicker
                                                            size='large'
                                                            className='w-full'
                                                            value={dayjs(e.birthdate, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                                                            onChange={handleAdultsubCatagoryChange(i, 'birthdate')}
                                                            disabledDate={disabledDateAdult}
                                                            />
                                                        </Form.Item>
                                                        <small className='block -mt-4 text-gray-400'>Contoh: dd-mm-yyyy</small>                
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block mt-4 xl:mt-0'>
                                                                <div className='text-gray-500 text-sm'>No. Ktp</div>
                                                                <Form.Item  name={`nikAdult${i}`} rules={[{required:true, message:'Tolong diisi input ktp atau nik'}, { min: 16, message: 'Nik / No.ktp harus 16 huruf.' }, { max: 16, message: 'Nik / No.ktp harus 16 huruf.' }]}>
                                                                    <Input name={`nikAdult${i}`} size='large' className='mt-2' value={e.idNumber} onChange={handleAdultsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK'  id="default-input"/>
                                                                </Form.Item>
                                                                <small className='block -mt-4 text-gray-400'>Contoh: 16 digit nomor</small>
                                                                <div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }

                    { child[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0'>
                                    <h1 className='text-sm font-bold text-slate-500'>CHILD PASSENGER</h1>
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
                                                        <div className='text-gray-500 text-sm'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>                                                
                                                                <Select
                                                                    style={{ width: 120 }}
                                                                    options={dataInfChld}
                                                                    value={e.gender}
                                                                    size='large'
                                                                    onChange={handleChildsubCatagoryChange(i, 'gender')} 
                                                                    />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                    <Select
                                                                        style={{ width: 120 }}
                                                                        options={dataInfChld}
                                                                        value={e.gender}
                                                                        size='large'
                                                                        onChange={handleChildsubCatagoryChange(i, 'gender')} 
                                                                        />
                                                                </FormControl>
                                                            </div>
                                                            <div className='w-full grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Depan</div>
                                                                        <Form.Item  name={`namadepanChild${i}`} rules={[{required:true, message:'Tolong diisi input nama depan'}, { min: 3, message: 'Nama depan harus min. 3 huruf.' }]}>
                                                                            <Input size='large' className='mt-2' value={e.nama_depan} onChange={handleChildsubCatagoryChange(i, 'nama_depan')}  type="text" placeholder='Nama Depan' id="default-input" rules={[{required:true, message:'Tolong diisi input nama depan'}]} />
                                                                        </Form.Item>
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Belakang</div>
                                                                    <Form.Item  name={`namabelakangChild${i}`} rules={[{required:true, message:'Tolong diisi input nama belakang'}, { min: 2, message: 'Nama belakang harus min. 2 huruf.' }]}>
                                                                        <Input size='large' className='mt-2'   value={e.nama_belakang} onChange={handleChildsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input"  rules={[{required:true, message:'Tolong diisi input nama belakang'}]}/>
                                                                    </Form.Item>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full px-4 xl:px-0'>
                                                        <div className='xl:px-0 w-full text-gray-500 text-sm mb-2'>Tanggal Lahir</div>
                                                        <Form.Item  name={`tanggallahirChild${i}`} rules={[{required:true, message:'Tolong diisi input tanggal lahir'}]}>
                                                            <DatePicker
                                                            size='large'
                                                            className='w-full'
                                                            value={dayjs(e.birthdate, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                                                            onChange={handleChildsubCatagoryChange(i, 'birthdate')}
                                                            disabledDate={disabledDateChild}
                                                            />
                                                        </Form.Item>
                                                        <small className='blcok -mt-4 text-gray-400'>Contoh: dd-mm-yyyy</small>                
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block mt-4 xl:mt-0'>
                                                                <div className='text-gray-500 text-sm'>No. Ktp</div>
                                                                <Form.Item  name={`noktpChild${i}`} rules={[{required:true, message:'Tolong diisi input Ktp / Nik anda'}, { min: 16, message: 'Nik / No.ktp harus 16 huruf.' }, { max: 16, message: 'Nik / No.ktp harus 16 huruf.' }]}>
                                                                    <Input size='large'  className='mt-2' value={e.idNumber} onChange={handleChildsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK'/>
                                                                </Form.Item>
                                                                <small className='block -mt-4 text-gray-400'>Contoh: 16 digit nomor</small>                
                                                                <div>
                                                            </div>
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
                                <div className='Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0'>
                                    <h1 className='text-sm font-bold text-slate-500'>INFANT PASSENGER</h1>
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
                                                        <div className='text-gray-500 text-sm'>Titel Anda</div>
                                                            <div className='hidden xl:block'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2, maxWidth:120 }} fullWidth>                                                
                                                                <Select
                                                                    style={{ width: 120 }}
                                                                    options={dataInfChld}
                                                                    value={e.gender}
                                                                    size='large'
                                                                    onChange={handleInfantsubCatagoryChange(i, 'gender')} 
                                                                    />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='block xl:hidden'>
                                                                <FormControl sx={{ marginTop:2, marginBottom:2 }} fullWidth>
                                                                <Select
                                                                    style={{ width: 120 }}
                                                                    options={dataInfChld}
                                                                    value={e.gender}
                                                                    size='large'
                                                                    onChange={handleInfantsubCatagoryChange(i, 'gender')} 
                                                                    />
                                                                </FormControl>  
                                                            </div>
                                                            <div className='w-full grid grid-cols-2 gap-2'>                                    
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Depan</div>
                                                                    <Form.Item  name={`infantnamadepan${i}`} rules={[{required:true, message:'Tolong diisi input nama depan'}, { min: 3, message: 'Nama depan harus min. 3 huruf.' }]}>
                                                                        <Input size='large' className='mt-2' value={e.nama_depan} onChange={handleInfantsubCatagoryChange(i, 'nama_depan')}  type="text" placeholder='Nama Depan' id="default-input" />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className='w-full'>
                                                                    <div className='text-gray-500 text-sm'>Nama Belakang</div>
                                                                    <Form.Item  name={`infantnamabelakang${i}`} rules={[{required:true, message:'Tolong diisi input nama belakang'}, { min: 2, message: 'Nama belakang harus min. 2 huruf.' }]}>
                                                                        <Input size='large' className='mt-2'   value={e.nama_belakang} onChange={handleInfantsubCatagoryChange(i, 'nama_belakang')}  type="text" placeholder='Nama Belakang' id="default-input" />
                                                                    </Form.Item>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8 mt-0 xl:mt-4'>
                                                <div className='block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6'>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full px-4 xl:px-0'>
                                                        <div className='xl:px-0 w-full text-gray-500 text-sm mb-2'>Tanggal Lahir</div>
                                                        <Form.Item  name={`infanttanggallhr${i}`} rules={[{required:true, message:'Tolong diisi input tanggal lahir'}]}>                   
                                                            <DatePicker
                                                            size='large'
                                                            className='w-full'
                                                            value={dayjs(e.birthdate, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                                                            onChange={handleInfantsubCatagoryChange(i, 'birthdate')}
                                                            disabledDate={disabledDate}
                                                            />
                                                        </Form.Item>
                                                        <small className='block -mt-4 text-gray-400'>Contoh: dd-mm-yyyy</small>                
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='px-4 xl:px-0 w-full block mt-4 xl:mt-0'>
                                                                <div className='text-gray-500 text-sm'>No. Ktp</div>
                                                                <Form.Item  name={`infantktp${i}`} rules={[{required:true, message:'Tolong diisi input Ktp / Nik'}, { min: 16, message: 'Nik / No.ktp harus 16 huruf.' }, { max: 16, message: 'Nik / No.ktp harus 16 huruf.' }]}>
                                                                    <Input size='large' className='mt-2' value={e.idNumber} onChange={handleInfantsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No. Ktp / NIK'/>
                                                                </Form.Item>
                                                                <small className='block -mt-4 text-gray-400'>Contoh: 16 digit nomor</small>                
                                                                <div>
                                                            </div>
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
                    <Button htmlType="submit"  size="large" key="submit"  type="primary" className='bg-blue-500 mx-2 font-semibold' loading={isLoading}>
                        Lanjut ke Pembayaran
                    </Button>
                    </div>                     

                </Form>

                {/* sidebra desktop*/}
                <div className='w-1/2'>
                    {dataDetail && dataDetail.map((dataDetail) =>(
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
                                <ol class="relative border-l-2 border-dotted border-gray-300 ">                  
                                        <li class="mb-10 ml-4 text-sm">
                                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400  "></div>
                                            <div className='flex space-x-12'>
                                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataDetail.departureTime}</time>
                                                <div className='-mt-2'>
                                                    <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetail.departureName}</h3>
                                                    <p class="text-left text-xs font-bold text-gray-500 ">({dataDetail.departure})</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="ml-4 text-sm mt-10">
                                            <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white  "></div>
                                            <div className='flex space-x-12'>
                                                <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataDetail.arrivalTime}</time>
                                                <div className='-mt-2'>
                                                    <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetail.arrivalName}</h3>
                                                    <p class="text-left text-xs font-bold text-gray-500 ">({dataDetail.arrival})</p>
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
        : 
        
        (
            <>
        <Modal.error
                title="Error!"
                open={true}
                content= 'Terjadi kesalahan, silahkan booking kembali.'
                footer={[
                    (
                    <div className="flex justify-end mt-4">
                        <Button key="submit" type="primary" className='bg-blue-500' onClick={() => window.location = '/'}>
                             Kembali ke home
                        </Button>,
                    </div>
                    )
                  ]}
            >
        </Modal.error>
            </>
        )
        
        }
        </>
    )
}