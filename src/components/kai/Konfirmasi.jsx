import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import {TbArrowsLeftRight} from 'react-icons/tb'
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule, MdOutlineAirlineSeatReclineExtra} from 'react-icons/md'
import {IoIosArrowDropright} from "react-icons/io"

export default function Konfirmasi(){

    const {trainNumber} = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const passengers = searchParams.get('passengers') ? JSON.parse(searchParams.get('passengers')) : [];

    const dataBookingTrain = JSON.parse(localStorage.getItem(trainNumber + "_booking"));
    const dataDetailTrain = JSON.parse(localStorage.getItem(trainNumber + "_detailTrain"));
    const hasilBooking = JSON.parse(localStorage.getItem(trainNumber + "_hasilBookingdanPilihKursi"));


    const [clickSeats, setClickSeats] = useState(0);
    const [cekKursi, setCekKursi] = useState();

    const [showModal, setShowModal] = React.useState(false);
    const seats = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16, 17, 18, 19, 20, 21]
    const [dataSeats, setDataSeats] = useState([]);
    const [dataSeatsLayout, setDataSeatsLayout] = useState([]);

    const TotalAdult = passengers.adults ? passengers.adults.length : 0;
    const TotalChild = passengers.children ? passengers.children.length : 0;
    const TotalInfant = passengers.infants ? passengers.infants.length : 0;

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    
    var i=0;
    
    function setLayout(seats) {
       // create a blank layout
       const layout = [];
     
       // loop through the seats
       for (const seat of seats) {
         // get the row and column of the seat
         const row = seat.row;
         const column = seat.column;
     
         // if the layout doesn't have a row for the seat, create one
         if (!layout[row]) {
           layout[row] = [];
         }
     
         // add the seat to the layout
         layout[row][column] = seat;
       }
     
       return layout;
     }

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

        
    function handlerGerbangClick(e, i){
     
        e.preventDefault();
        setClickSeats(i);
     
    }
     
     const [pilihSeats, setPilihSeats] = useState();


    async function handlerPilihKursi(e) {

        e.preventDefault();
        setShowModal(true)

        const response = await axios.post(`http://localhost:5000/travel/train/get_seat_layout`, {
            productCode: "WKAI",
            origin: dataDetailTrain[0].berangkat_id_station,
            destination:dataDetailTrain[0].tujuan_id_station,
            date:dataBookingTrain[0].arrivalDate,
            trainNumber:dataBookingTrain[0].trainNumber,
            token:JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });
         
        if(response.data.rc === '00'){

            if(response.data !== undefined && response.data !== 0){    
                setDataSeats(response.data)
            }

        }

     }


     useEffect(() =>{
     
        if(dataSeats !== undefined && dataSeats.length !== 0){
            setDataSeatsLayout(setLayout(dataSeats.data[clickSeats].layout));
        }
     
     }, [dataSeats, clickSeats]);


     console.log(dataSeatsLayout);

    return(
        <>
            {/* Pilih Seats  */}

            {showModal ? (
                    
                    <div className="justify-center mt-24 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-3xl"> {/*content*/} 
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {dataSeats.data !== undefined ? 
                        
                        (
                            <form> 
                            {/*header*/} 
                                <div className="flex items-start justify-between p-5 border-solid border-slate-200 rounded-t">
                                    <div className='text-slate-600 font-bold'>
                                    <div className='heading'> PILIH SEAT - GERBANG KE-{clickSeats + 1} </div>
                                    </div>
                                </div> 
                                {/*body*/} 
                                <div className="relative -mt-4 p-8 xl:p-10 flex-auto">
                                    <div className="">
                                    <div className="grid w-full grid-cols-3"> 
                                    {/* sidebar seats Kai */} 
                                        <div className="sidebar mt-8"> 
                                        { dataSeats !== undefined || dataSeats !== null ? dataSeats.data.map((data, i) => ( ( 
                                            <> 
                                            { i === clickSeats ? ( 
                                            <button onClick={(e)=> handlerGerbangClick(e, i)} className='mt-4 bg-blue-600 flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'> 
                                                    <div className='text-center'>
                                                        <div className='text-xs font-bold text-white'>CLASS {data.wagonCode} {data.wagonNumber}</div>
                                                    </div>
                                            </button> ) : ( <button onClick={(e)=> handlerGerbangClick(e, i)} className='mt-4 flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'> 
                                                <div className='text-center'>
                                                    <div className='text-xs font-bold text-slate-700'>CLASS {data.wagonCode} {data.wagonNumber}</div>
                                                </div>
                                            </button> ) } </> ) )) : ( <button className='mt-4  flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'>
                                                <div className='text-center'>
                                                <div className='text-xs font-bold text-slate-700'>---</div>
                                                </div>
                                            </button> 
                                            ) } 
                                        </div> 
                                            
                                        {/* seats cols and rows kereta premium dan bisnis */} 
                                        <div className="overflow-y-scroll col-span-2 w-full h-[600px]"> 
                                        {/* nama kursi */} {/* <div className="seats flex justify-around items-center">
                                            <div className="col-ab flex space-x-12 text-blue-500">
                                            <div className="">A</div>
                                            <div className="">B</div>
                                            <div className="">C</div>
                                            </div>
                                            <div className="col-cd flex space-x-12 text-blue-500">
                                            <div className="">C</div>
                                            <div className="">D</div>
                                            </div>
                                        </div> */}
                                        
                                        <div className="flex justify-around"> 

                                            {/* kiri */}

                                            <div className='flex'>
                                                
                                                {/* rows A */}

                                            <div className='flex flex-col'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                            {e['A'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['A'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i}` + 'A')} class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['A'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div>                                           

                                            {/* rows B */}   

                                            <div className='flex flex-col'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                            {e['B'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['B'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'B')} class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['B'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div>

                                            {/* rows C Ekonomi */}   


                                            { 
                                            
                                            dataSeats !== undefined || dataSeats !== null ? 
                                            dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                            (
                                                <div className='flex flex-col'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                            {e['C'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['C'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'C')} class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['C'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div>
                                            ) : (<></>) : (<></>)}     
                                                
                                            </div>                                             
                                            

                                            {/* kanan */}

                                            <div className='flex'>
                                                
                                                {/* rows D */}

                                                <div className='flex flex-col'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                        {
                                                            dataSeats !== undefined || dataSeats !== null ?
                                                            dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                                            (
                                                                <>
                                                            {e['D'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['D'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'D')} class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['D'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                                </>
                                                            )
                                                            : 
                                                            
                                                            (
                                                            <>
                                                            {e['C'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['C'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'C')} class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['C'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                            
                                                            </>
                                                            ) : (<></>)
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div> 

                                            {/* rows E */}   
                                            
                                            <div className='flex flex-col-reverse'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                        {
                                                            dataSeats !== undefined || dataSeats !== null ?
                                                            dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                                            (
                                                                <>
                                                            {e['E'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['E'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value="" class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['E'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                                </>
                                                            )
                                                            : 
                                                            
                                                            (
                                                            <>
                                                            {e['D'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['D'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value="" class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['D'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                            
                                                            </>
                                                            ) : (<></>)
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div>

                                            {/* rows F */}  

                                            {

                                                dataSeats !== undefined || dataSeats !== null ? 
                                                dataSeats.data[clickSeats].wagonCode === 'EKO' ? 

                                                (

                                                <div className='flex flex-col-reverse'>

                                                {      
                                                    dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                                    dataSeatsLayout.map((e, i) => (
                                                        <>
                                                            {e['F'] !== undefined ?
                                                                (
                                                                    <>
                                                                    {i < dataSeatsLayout.length ?                                  
                                                                    (
                                                                        <>
                                                                        {parseInt(e['F'].isFilled) === 0 ? (

                                                                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                                <input type="checkbox" value="" class="sr-only peer" />
                                                                                <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['F'].column}</div></div>
                                                                            </label>

                                                                        ) : 
                                                                        
                                                                        (
                                                                        <>
                                                                            <label class={`block py-2 pl-2 items-center`}>
                                                                                <input type="" class="sr-only peer" />
                                                                                <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                            </label>                                                                   
                                                                        </>
                                                                        )
                                                                        
                                                                        }
                                                                        </>
                                                                    ) : (<></>)
                                                                
                                                                }
                                                                    </>
                                                                )

                                                            : (<></>)   
                                                        }
                                                        </>
                                                    )) : ''
                                                }
                                                    
                                            </div> 

                                                )

                                                : (<></>) : (<></>)

                                            }    
                                                
                                            </div>                                                                

                                            </div> 
                                        </div>
                                    </div>
                                    </div>
                                </div>
    
                            <div className="flex items-center justify-end p-6  border-solid border-slate-200 rounded-b">
                                <button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> setShowModal(false)} > Close </button>
                                <button className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"> Konfirmasi </button>
                              </div>
                            </form>

                        )
                    
                        :

                        (
                            <>
                                <div className="w-5/6 min-h-[820px] flex justify-center items-center my-auto py-auto">
                                    <div className="my-auto">
                                        
                                        <div className="ml-0 xl:ml-24" role="status">
                                            <img src="/loading.webp" width="150px" heigh="150px" alt="loading.gif" />
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                      </div>
                    </div>
                  </div>

            ) : null}



            {/* header kai flow */}
            <div className='flex justify-start jalur-payment-booking text-xs xl:text-md space-x-2 xl:space-x-8 items-center'>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                <div className='block xl:hidden text-slate-500'>Detail</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
            </div>
            <div className='flex space-x-2 items-center'>
                <div className='hidden xl:flex text-[#ff8400] font-bold'>Konfirmasi pesanan</div>
                <div className='block xl:hidden text-[#ff8400] font-bold'>Konfirmasi</div>
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
        <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
            <div className="w-full mx-0 2xl:mx-4">
            <div className='mt-8 w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-[#FF9119] border-b-gray-100'>
                        <div className='text-slate-700 font-bold '>Keberangkatan kereta</div>
                        <small className='text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                    </div>
                    <div className='p-4 pl-8  text-gray-700'>
                        <div className='text-xs font-bold'>{dataBookingTrain[0].trainName}</div>
                        <small>Class {dataBookingTrain[0].seats[0].class}</small>
                    </div>
                    <div className="mt-2">

                    </div>
                    <div className='p-4 pl-8 mb-4'>
                    <ol class="relative border-l border-dashed border-gray-500 dark:border-gray-700">                  
                            <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].departureTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs text-slate-600 font-bold dark:text-white">{dataDetailTrain[0].berangkat_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataDetailTrain[0].berangkat_id_station})</p>
                                    </div>
                                </div>
                            </li>
                            <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-[#FF9119] rounded-full mt-0 -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain[0].arrivalTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs  text-slate-600 font-bold dark:text-white">{dataDetailTrain[0].tujuan_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataDetailTrain[0].tujuan_id_station})</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
            </div>
            {/* adult */}
            { passengers.adults.length > 0 ? (
            <div className="text-sm xl:text-lg font-bold text-slate-600 mt-12">
                <p>ADULT PASSENGERS</p>
            </div>
            ) : '' }
            { passengers.adults.length > 0 ? passengers.adults.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-2">
                            <div className="px-2 xl:px-4 py-2 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                {e.name}
                            </div>
                            <div className="mt-2 block md:flex md:space-x-8">
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">NIK</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Nomor HP</div>
                                    <div className="text-gray-600">{e.phone}</div>
                                </div> 
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0] === 'BIS' ? 'Bisnis' : 'Eksekutif' } Gerbang {hasilBooking.seats[i][1]} - {hasilBooking.seats[i][2]}{hasilBooking.seats[i][3]}</div>
                                </div> 
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}

            {/* Child */}
            { passengers.children.length > 0 ? (
            <div className="text-sm xl:text-lg font-bold text-slate-600 mt-12">
                <p>CHILD PASSENGERS</p>
            </div>
            ) : '' }
            { passengers.children.length > 0 ? passengers.children.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-4">
                            <div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                {e.name}
                            </div>
                            <div className="mt-2 flex space-x-8">
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">NIK</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.birthdate}</div>
                                </div> 
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0] === 'BIS' ? 'Bisnis' : 'Eksekutif' } Gerbang {hasilBooking.seats[i][1]} - {hasilBooking.seats[i][2]}{hasilBooking.seats[i][3]}</div>
                                </div> 
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}

            {/* infants */}

            { passengers.infants.length > 0 ? (
            <div className="text-sm xl:text-lg font-bold text-slate-600 mt-12">
                <p>INFANTS PASSENGERS</p>
            </div>
            ) : '' }
            { passengers.infants.length > 0 ? passengers.infants.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-4">
                            <div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                {e.name}
                            </div>
                            <div className="mt-2 flex space-x-8">
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.birthdate}</div>
                                </div> 
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking.seats[i][0] === 'EKO'  ? 'EKONOMI' : hasilBooking.seats[i][0]} {hasilBooking.seats[i][1]} - {hasilBooking.seats[i][2]} {hasilBooking.seats[i][3]}</div>
                                </div> 
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}
             <div className="text-sm xl:text-lg font-bold text-slate-600 mt-12">
                <p>PRICE DETAILT</p>
            </div>
                <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className="p-4">
                        <div className="text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                            {dataBookingTrain[0].trainName} {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ''} { TotalChild > 0 ? `(Adult) x${TotalChild}` : ''} { TotalInfant > 0 ? `(Adult) x${TotalInfant}` : ''}
                            </div>
                            <div>
                                Rp. {toRupiah(hasilBooking.normalSales)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Biaya Admin (Fee)
                            </div>
                            <div>
                                Rp. {toRupiah(hasilBooking.nominalAdmin)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Diskon (Rp.)
                            </div>
                            <div>
                                Rp. {hasilBooking.discount}
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500 font-bold flex justify-between">
                            <div>
                                Total Harga
                            </div>
                            <div>
                                Rp. {toRupiah(parseInt(hasilBooking.normalSales) - parseInt(hasilBooking.discount) + parseInt(hasilBooking.nominalAdmin))}
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
            {/* desktop sidebar */}
            <div className="sidebar w-full xl:w-2/3">
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="flex items-center justify-between p-4">
                        <div className="text-gray-500 text-sm">Booking ID</div>
                        <div className="font-bold text-[#ff8400]">{hasilBooking.bookingCode}</div>
                    </div>
                </div>
                <button onClick={handlerPilihKursi}  className="block w-full">
                    <div className='mt-2 rounded-md border border-gray-200 shadow-sm  hover:bg-gray-100'>
                        <div className="flex items-center justify-between space-x-2 p-4 pr-2 xl:pr-4">
                            <div className="flex space-x-2 items-center">
                                <div><MdOutlineAirlineSeatReclineExtra size={28} className="text-blue-500" /></div>
                                    <div className="block text-gray-500 text-sm">
                                        <div className="text-sm font-bold">Pindah Kursi</div>
                                        <small>available seats</small>
                                    </div>
                            </div>
                            <div>
                                <IoIosArrowDropright size={28} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        </>
    )
}