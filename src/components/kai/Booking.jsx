import React, {useState} from 'react';
import {MdHorizontalRule} from 'react-icons/md'
import 'react-phone-number-input/style.css'
import '../../index.css';
import {TbArrowsLeftRight} from 'react-icons/tb'
import { useNavigate } from "react-router-dom";
import { useParams, createSearchParams } from 'react-router-dom';
import axios from "axios";
import { useForm } from "react-hook-form"
import {RxCrossCircled} from 'react-icons/rx'
import 'react-phone-input-2/lib/bootstrap.css'
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import { Input, Form } from 'antd';
import { Modal } from 'antd';
import { notification } from 'antd';

export default function BookingKai(){
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();
    const {trainNumber} = useParams();

    const failedNotification = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + ' .!',
        });
      };

    const [isLoading, setIsLoading] = useState(false);
    const [inputBooking, setInputBooking] = useState([]);

    const dataBookingTrain = JSON.parse(localStorage.getItem(trainNumber + "_booking"));
    const dataDetailTrain = JSON.parse(localStorage.getItem(trainNumber + "_detailTrain"));

    const classTrain = dataBookingTrain ? dataBookingTrain[0].seats[0].grade === 'E' ? 'Eksekutif' : dataBookingTrain[0].seats[0].grade === 'B' ? 'Bisnis' : 'Ekonomi' : 'Error';
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));

        var err = false;

        if(token === null || token === undefined){
            err  = true;
        }


        if(dataBookingTrain == null || dataBookingTrain == undefined){
            err  = true;
        }

        if(dataDetailTrain == null || dataDetailTrain == undefined){
            err  = true;
        }

    var date = new Date(dataBookingTrain ? dataBookingTrain[0].departureDate : new Date());
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
    const TotalAdult = dataDetailTrain ?  parseInt(dataDetailTrain[0].adult) : 0;
    const TotalInfant = dataDetailTrain ? parseInt(dataDetailTrain[0].infant) : 0;

    const AdultArr = Array();
    const InfantArr = Array();

    for(var i = 0; i < TotalAdult; i++){
        AdultArr.push({
            name: '',
            birthdate: new Date().getFullYear() + '-' + (addLeadingZero(parseInt(new Date().getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(new Date().getDay())).toString(),
            idNumber: '',
            phone: '',
        });

    }    

    for(var i = 0; i < TotalInfant; i++){
        InfantArr.push({
            name: '',
            birthdate: new Date().getFullYear() + '-' + (addLeadingZero(parseInt(new Date().getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(new Date().getDay())).toString(),
            idNumber: '',
        });

    }  
         //untuk handler changes
        const [adult, setAdult] = useState([AdultArr]);
        const [infant, setInfant] = useState([InfantArr]);


        const handleAdultsubCatagoryChange = (i, category) => e => { 
            
            const adultCategory = adult[0];

            if(category === 'phone'){
                adultCategory[i]['phone'] = e
                adultCategory[i][category] = e
            }else{
                adultCategory[i][category] = e.target.value
            }

            setAdult([adultCategory]);
            
        }

        function addLeadingZero(num) {
            if (num < 10) {
              return '0' + num;
            } else {
              return '' + num;
            }
          }

        const handleInfantsubCatagoryChange = (i, category) => e => { 
            
            const infantCategory = infant[0];

            if(category == 'birthdate'){
                let tanggalParse = new Date(e);
                    tanggalParse = tanggalParse.getFullYear() + '-' + (addLeadingZero(parseInt(tanggalParse.getMonth()) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalParse.getDay())).toString();
                    infantCategory[i][category] = tanggalParse;
            }else{
                infantCategory[i][category] = e.target.value
            }
            setInfant([infantCategory]);
            
        }

        const {handleSubmit} = useForm();

        const handlerBookingSubmit = async () => {
        
            setIsLoading(true);
            
                var priceInfantChild;
                TotalInfant > 0 ? priceInfantChild = dataBookingTrain[0].seats[0].priceAdult : priceInfantChild = '-';   

                
                adult[0].map((data) =>{
                    if(data.phone.substring(0,2) == '62'){
                        data.phone = data.phone.replace("62", "08");
                    }else{
                        data.phone = data.phone;
                    }

                });

            // const Fare = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/book`, {
            //     productCode : "WKAI",
            //     origin : dataDetailTrain[0].berangkat_id_station,
            //     destination : dataDetailTrain[0].tujuan_id_station, 
            //     date : dataBookingTrain[0].departureDate,
            //     trainNumber : parseInt(dataBookingTrain[0].trainNumber),
            //     grade : dataBookingTrain[0].seats[0].grade,
            //     class : dataBookingTrain[0].seats[0].class,
            //     adult : TotalAdult,
            //     infant : TotalInfant,
            //     trainName : dataBookingTrain[0].trainName,
            //     departureStation : dataDetailTrain[0].stasiunBerangkat,
            //     departureTime : dataBookingTrain[0].departureTime,
            //     arrivalStation : dataDetailTrain[0].stasiunTujuan,
            //     arrivalTime : dataBookingTrain[0].arrivalTime,
            // }); // karena di booking sudah punya biaya admin, maka fare dihilangkan

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/book`, 
                {
                    productCode : "WKAI",
                    origin : dataDetailTrain[0].berangkat_id_station,
                    destination : dataDetailTrain[0].tujuan_id_station, 
                    date : dataBookingTrain[0].departureDate,
                    trainNumber : parseInt(dataBookingTrain[0].trainNumber),
                    grade : dataBookingTrain[0].seats[0].grade,
                    class : dataBookingTrain[0].seats[0].class,
                    adult : TotalAdult,
                    infant : TotalInfant,
                    trainName : dataBookingTrain[0].trainName,
                    departureStation : dataDetailTrain[0].stasiunBerangkat,
                    departureTime : dataBookingTrain[0].departureTime,
                    arrivalStation : dataDetailTrain[0].stasiunTujuan,
                    arrivalTime : dataBookingTrain[0].arrivalTime,
                    priceAdult : parseInt(dataBookingTrain[0].seats[0].priceAdult),
                    priceInfant : '-',
                    passengers: {
                        adults: adult[0],
                        infants: TotalInfant > 0 ? infant[0] : []                    
                    },
                    token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
                }

            );
            
            if(response.data.rc !== '00'){
                failedNotification(response.data.rd)
                
            }else{
                const hasilDataBooking = response.data.data
                localStorage.setItem(dataBookingTrain[0].trainNumber + '_hasilBookingdanPilihKursi', JSON.stringify(hasilDataBooking));
                localStorage.setItem(dataBookingTrain[0].trainNumber + '_passenggers', JSON.stringify({
                    adults: adult[0],
                    infants: TotalInfant > 0 ? infant[0] : []                    
                }))
                // localStorage.setItem(dataBookingTrain[0].trainNumber + '_fareAdmin', JSON.stringify(Fare.data.data));

                navigate({
                    pathname: "/train/konfirmasi/" + dataBookingTrain[0].trainNumber,
                })
            }
            setIsLoading(false);
        }

    return(
        <>
        {/* message notification  */}
        {contextHolder}

        { err !== true  ? 

            (
                <div className='xl:mt-0'>
                {/* header kai flow */}
                <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
                <div className='flex space-x-2 items-center'>
                    <div className='hidden xl:flex text-blue-500 font-bold'>Detail pesanan</div>
                    <div className='block xl:hidden text-blue-500 font-bold'>Detail</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <RxCrossCircled size={20} className='text-slate-500' />
                    <div className='hidden xl:block text-slate-500'>Konfirmasi pesanan</div>
                    <div className='block xl:hidden text-slate-500'>Konfirmasi</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
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
            <div className='mt-8 block xl:hidden w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100'>
                        <div className='text-gray-700 '>Keberangkatan kereta</div>
                        <small className='text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                    </div>
                    <div className='p-4 px-4 flex justify-between space-x-12 items-center'>
                        <div className='text-slate-600 text-xs'>
                            <div>{dataDetailTrain && dataDetailTrain[0].berangkat_nama_kota}</div>
                            <div>({dataDetailTrain && dataDetailTrain[0].berangkat_id_station})</div>
                        </div>
                        <div className='rounded-full p-2 bg-blue-500'>
                            < TbArrowsLeftRight className='text-white' size={18} />
                        </div>
                        <div className='text-slate-600 text-xs'>
                            <div>{dataDetailTrain && dataDetailTrain[0].tujuan_nama_kota}</div>
                            <div>({dataDetailTrain && dataDetailTrain[0].tujuan_id_station})</div>
                        </div>
                    </div>
                    <div className='p-4 pl-8  text-gray-700'>
                        <div className='text-xs font-bold'>{dataBookingTrain[0].trainName}</div>
                        <small>{classTrain} class { dataBookingTrain && dataBookingTrain[0].seats[0].class}</small>
                    </div>
                    <div className='p-4 pl-8 mb-4'>
                    <ol class="relative border-l border-gray-500 ">                  
                            <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 "></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 ">{dataBookingTrain && dataBookingTrain[0].departureTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs text-slate-600 ">{dataDetailTrain && dataDetailTrain[0].berangkat_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 ">({dataDetailTrain && dataDetailTrain[0].berangkat_id_station})</p>
                                    </div>
                                </div>
                            </li>
                            <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm leading-none text-gray-400 ">{dataBookingTrain && dataBookingTrain[0].arrivalTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs  text-slate-600 ">{dataDetailTrain && dataDetailTrain[0].tujuan_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 ">({dataDetailTrain && dataDetailTrain[0].tujuan_id_station})</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
            </div>
            <div className='w-full mb-24 block xl:flex xl:space-x-10'>
                {/* detail passengger kai*/} 
                <Form onFinish={handleSubmit(handlerBookingSubmit)} className='block w-full mt-0 xl:mt-4 mb-4'>
                    {/* adult loop */}

                    { adult && adult[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking ml-2 md:ml-0 mt-8 mb-4 xl:mt-12'>
                                    <h1 className='text-sm font-bold text-gray-500'>ADULT PASSENGER</h1>
                                    <small className='text-gray-500'>Isi sesuai dengan data anda</small>
                                </div>
                                {/* Detailt */}            
                                <div className='flex space-x-12'>
                                    {/* form detailt kontal */}
                                    <div className='w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2'>
                                            <div className=''>
                                                <div className='p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8'>
                                                    {/* mobile & desktop Nama*/}
                                                    <div className='xl:w-full mt-4 xl:mt-0 '>
                                                    <div className='w-full'>
                                                        <div className='text-gray-500 text-sm'>Nama Lengkap</div>
                                                        <Form.Item  name={`adultNameLengkap${i}`} rules={[{required:true, message:'Tolong diisi input nama lengkap'}, { min: 5, message: 'Nama lengkap harus min. 5 huruf.' },]}>
                                                            <Input size='large' className='mt-2'value={e.name} onChange={handleAdultsubCatagoryChange(i, 'name')}  type="text" placeholder='Nama Lengkap' id="default-input"/>
                                                        </Form.Item>
                                                        <div className='block -mt-4 text-gray-400'><small>Contoh: Farris Muhammad Ramadhan.</small></div>            
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8'>
                                                <div className='py-0 px-0 xl:px-8 block xl:grid xl:grid-cols-2 xl:gap-8'>
                                                    {/* desktop nomor hp */}
                                                    <div className='w-full px-4 xl:px-0 mt-2 xl:mt-0'>
                                                    <div className='text-gray-500 text-sm mb-2'>Nomor HP</div>
                                                    <Form.Item  name={`nomorHPAdult${i}`} rules={[{required:true, message:'Tolong diisi input nomor HP'}, { min: 5, message: 'Nomor HP harus min. 10.' }]}>
                                                        <PhoneInput
                                                            hiddenLabel={true}
                                                                inputProps={{
                                                                    required: true,
                                                                    autoFocus: true
                                                                }}
                                                                country='id'
                                                                inputStyle={{ width:'100%', borderColor:'hover:red', paddingTop:7, paddingBottom:7}}
                                                                value={e.phone.substring(0,2) == '08' ? "62" + e.phone.slice(2) : e.phone} 
                                                                onChange={handleAdultsubCatagoryChange(i, 'phone')}
                                                            /> 
                                                    </Form.Item>
                                                            <div className='mt-2 text-gray-400'><small>Contoh: (+62) 812345678</small></div>            
                                                    </div>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='w-full p-4 xl:p-0 mt-2 xl:mt-0'>
                                                        <div className='text-gray-500 text-sm'>No.Ktp / Nik</div>
                                                        <Form.Item  name={`niktpAdult${i}`} rules={[{required:true, message:'Tolong diisi input ktp / nik'}, { min: 16, message: 'Nik /No.ktp harus min. 16.' }, { max: 16, message: 'Nik /No.ktp harus min. 16.' }]}>
                                                            <Input size='large' className='mt-2'value={e.idNumber} onChange={handleAdultsubCatagoryChange(i, 'idNumber')} type="text" placeholder='No.Ktp / Nik' id="default-input"/>
                                                        </Form.Item>
                                                        <div className='block -mt-4 text-gray-400'><small>Contoh: harus berupa digit jumlah 16.</small></div>            
                                                    </div>
                                                </div>
                                            </div>
                                    </div> 
                                </div>
                            </div>
                        </>
                    )) }

                    {/* Infant loop */}
                    { infant && infant[0].map((e, i) => (
                        <>
                            <div>
                                <div className='Booking ml-2 mt-8 mb-4 xl:mt-12'>
                                    <h1 className='xl:text-sm font-bold text-gray-500 text-sm'>INFANT PASSENGER</h1>
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
                                                    <div className='w-full'>
                                                        <div className='text-gray-500 text-sm'>Nama Lengkap</div>
                                                        <Form.Item  name={`infantNamaLengkap${i}`} rules={[{required:true, message:'Tolong diisi input nama lengkap'}, { min: 5, message: 'Nama lengkap harus min. 5 huruf.' }]}>
                                                            <Input size='large' className='mt-2' value={e.name} onChange={handleInfantsubCatagoryChange(i, 'name')} type="text" placeholder='Nama Lengkap' id="default-input" />
                                                        </Form.Item>
                                                        <div className='block -mt-4 text-gray-400'><small>Contoh: Farris Muhammad Ramadhan.</small></div>            
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-8'>
                                                <div className='py-0 px-0 xl:px-8 block xl:grid xl:grid-cols-2 mt-0 xl:gap-8'>
                                                    {/* desktop nomor hp */}
                                                    <div className='p-4 xl:p-0 w-full'>
                                                    <div className='text-gray-500 text-sm xl:mb-2'>Tanggal Lahir</div>
                                                        <DatePicker
                                                            size='large'
                                                            className='w-full'
                                                            value={dayjs(e.birthdate, 'YYYY/MM/DD')} format={'YYYY/MM/DD'}
                                                            onChange={handleInfantsubCatagoryChange(i, 'birthdate')}
                                                            
                                                            />
                                                            <small className='block mt-2 text-gray-400'>Contoh: dd-mm-yyyy</small>            
                                                    </div>
                                                    {/* mobile & desktop NIK*/}
                                                    <div className='p-4 xl:p-0 w-full'>
                                                        <div className='text-gray-500 text-sm mb-0 xl:mb-2'>No.Ktp / Nik</div>
                                                        <Form.Item  name={`infantktpnik${i}`} rules={[{required:true, message:'Tolong diisi input Nik / No.ktp lengkap'}, { min: 16, message: 'Nik /No.ktp harus min. 16.' }, { max: 16, message: 'Nik /No.ktp harus min. 16.' }]}>
                                                            <Input size='large' value={e.idNumber} onChange={handleInfantsubCatagoryChange(i, 'idNumber')} type="text" placeholder='NIK' id="default-input"/>
                                                        </Form.Item>
                                                        <div className='block -mt-4 text-gray-400'><small>Contoh: harus berupa digit jumlah 16.</small></div>            
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
                        Lanjut ke Konfirmasi
                    </Button>
                    </div>                     

                </Form>
                {/* sidebra desktop*/}
                <div className='w-1/2 xl:mt-16'>
                    <div className='hidden xl:block rounded-md border border-gray-200 shadow-sm'>
                            <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100'>
                                <div className='text-gray-700 text-sm font-bold'>Keberangkatan kereta</div>
                                <small className='text-xs text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                            </div>
                            <div className='px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center'>
                                <div className='text-xs font-bold text-slate-600'>
                                    <div>{dataDetailTrain && dataDetailTrain[0].berangkat_nama_kota}</div>
                                    <div>({dataDetailTrain && dataDetailTrain[0].berangkat_id_station})</div>
                                </div>
                                <div className='rounded-full p-1 bg-blue-500 '>
                                    < TbArrowsLeftRight className='text-white' size={18} />
                                </div>
                                <div className='text-xs font-bold text-slate-600'>
                                    <div>{dataDetailTrain && dataDetailTrain[0].tujuan_nama_kota}</div>
                                    <div>({dataDetailTrain && dataDetailTrain[0].tujuan_id_station})</div>
                                </div>
                            </div>

                            <div className='p-4 pl-8 text-gray-700'>
                                <div className=' text-xs font-bold'>{dataBookingTrain && dataBookingTrain[0].trainName}</div>
                                <small>{classTrain} Class {dataBookingTrain && dataBookingTrain[0].seats[0].class}</small>
                            </div>
                            <div className='p-4 pl-12 mb-4'>
                            <ol class="relative border-l-2 border-dotted border-gray-300 ">                  
                                    <li class="mb-10 ml-4 text-sm">
                                        <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 "></div>
                                        <div className='flex space-x-12'>
                                            <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataBookingTrain && dataBookingTrain[0].departureTime}</time>
                                            <div className='-mt-2'>
                                                <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetailTrain && dataDetailTrain[0].berangkat_nama_kota}</h3>
                                                <p class="text-left text-xs font-bold text-gray-500 ">({dataDetailTrain && dataDetailTrain[0].berangkat_id_station})</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="ml-4 text-sm mt-10">
                                        <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                                        <div className='flex space-x-12'>
                                            <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">{dataBookingTrain && dataBookingTrain[0].arrivalTime}</time>
                                            <div className='-mt-2'>
                                                <h3 class="text-left text-xs font-bold text-slate-600 ">{dataDetailTrain && dataDetailTrain[0].tujuan_nama_kota}</h3>
                                                <p class="text-left text-xs font-bold text-gray-500 ">({dataDetailTrain && dataDetailTrain[0].tujuan_id_station})</p>
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
        
        : (
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
        )}
        </>
    )
}