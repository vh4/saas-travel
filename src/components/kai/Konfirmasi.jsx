import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule, MdOutlineAirlineSeatReclineExtra} from 'react-icons/md'
import {IoIosArrowDropright} from "react-icons/io"
import { useNavigate} from 'react-router-dom'
import './SeatMap.css';
import { Modal, Placeholder, Button } from 'rsuite';
import { notification } from 'antd';
import {Button as ButtonAnt, Modal as Modals} from 'antd'

const SeatMap = ({ seats, changeState, setChangeSet, clickSeatsData }) => {
       
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    function limitFunction() { 
        var x=0;
        changeState[0].map((e, i) => { 
            if(e.type == 'adult'){
                x = x + 1;
            }else{
                x= x + 0;
            }
        }) 
        return x;
    };

    const limit = limitFunction();


    const [selectedCount, setSelectedCount] = useState(0);

      const handleOnChange = (e, row, cols) => {
        if (e.target.checked) {
            if (selectedCount < limit) {
              setSelectedCount(selectedCount + 1);
              setSelectedCheckboxes(prevSelectedCheckboxes => {
                if (prevSelectedCheckboxes.includes(`${row}-${cols}-${parseInt(clickSeatsData) + 1}`)) {
                  return prevSelectedCheckboxes.filter(checkbox => checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`);
                } else {
                  return [...prevSelectedCheckboxes, 
                      `${row}-${cols}-${parseInt(clickSeatsData) + 1}`];
                }
              });
            } else {
              e.target.checked = false;
            }
          } else {
            setSelectedCount(selectedCount - 1);
            setSelectedCheckboxes(prevSelectedCheckboxes => {
                if (prevSelectedCheckboxes.includes(`${row}-${cols}-${parseInt(clickSeatsData) + 1}`)) {
                  return prevSelectedCheckboxes.filter(checkbox => checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`);
                } else {
                  return [...prevSelectedCheckboxes, 
                      `${row}-${cols}-${parseInt(clickSeatsData) + 1}`];
                }
              });
          }

      }


      useEffect(() => {
        let changeStateData = changeState[0]
        if(limit === selectedCount){
            
            for(let i = 0; i < limit; i++){
                if(selectedCheckboxes[i] !== null && selectedCheckboxes[i] !== undefined){
                    let splittingSeat = selectedCheckboxes[i].split('-');
                    changeStateData[i].row = parseInt(splittingSeat[0]);
                    changeStateData[i].type = 'adult';
                    changeStateData[i].column = splittingSeat[1];
                    changeStateData[i].wagonNumber = parseInt(splittingSeat[2]);
                }else{
                    setSelectedCount(0);
                    alert('Mohon maaf, pilih gerbong yang sama !')
                }

            }

            setChangeSet([changeStateData]);
    
         }
      }, [limit, selectedCount, selectedCheckboxes])


    return (
      <div className="">
        <div className="grid px-4 md:px-20 grid-rows-10 grid-cols-5">
          {seats.map((seat, i) => {
            const { row, column, class: seatClass, isFilled } = seat;
            return (
                <>
                    {
                        seats.length <= 80 && (
                            <div
                            key={`${row}-${column}`}
                            className={`
                              seat ${column}80
                              ${row > 2 ? 'mt-2' : ''}
                            `}
                          >
                            {isFilled === 0 ? (
                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                               <input type="checkbox"  
                                  onChange={(e) => handleOnChange(e, seat.row, seat.column)}
                                
                                class="sr-only peer" />
                                <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-bold peer-checked:border peer-checked:bg-white rounded-lg"><div class="py-2 text-center">{seat.row}{seat.column}</div></div>
                            </label>
                            ) : (
                            <label class={`select-none block py-2 pl-2 items-center cursor-pointer`}>
                                <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg"><div class="py-2 px-3.5">X</div></div>
                            </label>
                            )}

                          </div>
                        )
                        
                    }

                    {
                        seats.length > 80 && (
                            <div
                            key={`${row}-${column}`}
                            className={`
                              seat ${column}106
                              ${row > 2 ? 'mt-2' : ''}
                            `}
                          >
                            {isFilled === 0 ? (
                            <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                <input type="checkbox"  
                                  onChange={(e) => handleOnChange(e, seat.row, seat.column)}
                                
                                class="sr-only peer" />
                                <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-bold peer-checked:border peer-checked:bg-white rounded-lg"><div class="py-2 text-center">{seat.row}{seat.column}</div></div>

                            </label>
                            ) : (
                            <label class={`select-none block py-2 pl-2 items-center cursor-pointer`}>
                                <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg"><div class="text-center py-2 px-3.5">X</div></div>
                            </label>
                            )}
                          </div>
                        )
                    }
                </>
            );
          })}
        </div>
      </div>
    );
  };


export default function Konfirmasi(){

    const {trainNumber} = useParams();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPindahKursi, setisLoadingPindahKursi] = useState(false);
    const passengers_params = localStorage.getItem(trainNumber + "_passenggers") ? JSON.parse(localStorage.getItem(trainNumber + "_passenggers")) : null;

    const dataBookingTrain = localStorage.getItem(trainNumber + "_booking") ? JSON.parse(localStorage.getItem(trainNumber + "_booking")) : null;
    const dataDetailTrain = localStorage.getItem(trainNumber + "_detailTrain") ? JSON.parse(localStorage.getItem(trainNumber + "_detailTrain")) : null;
    const hasilBookingSession = localStorage.getItem(trainNumber + "_hasilBookingdanPilihKursi") ? JSON.parse(localStorage.getItem(trainNumber + "_hasilBookingdanPilihKursi")) : null;

    const [clickSeats, setClickSeats] = useState(0);

    const [dataSeats, setDataSeats] = useState([]);
    const classTrain = dataBookingTrain ? dataBookingTrain[0] ? dataBookingTrain[0].seats[0].grade === 'E' ? 'Eksekutif' : dataBookingTrain[0].seats[0].grade === 'B' ? 'Bisnis' : 'Ekonomi' : 'Err' : 'Err';

    const [hasilBooking, setHasilBooking] = useState(hasilBookingSession);
    const [passengers, setPassengers] = useState(passengers_params);

    const TotalAdult = passengers ? passengers.adults ? passengers.adults.length : 0 :  0;
    const TotalChild = passengers ? passengers.children ? passengers.children.length : 0 : 0;
    const TotalInfant = passengers ? passengers.infants ? passengers.infants.length : 0 : 0;

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    var err = false;
    const [api, contextHolder] = notification.useNotification();

    const failedNotification = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + ' .!',
        });
      };

      const successNotification = (rd) => {
        api['success']({
          message: 'Success!',
          description:
          "Successfully, pindah kursi anda sudah berhasil!.",
          duration:7,
        });
      };


    if(passengers_params === null || passengers_params === undefined) {
        err = true;
    }

    if(token === null || token === undefined) {
        err = true;
    }

    if(dataBookingTrain === null || dataBookingTrain === undefined) {
        err = true;
    }

    if(dataDetailTrain === null || dataDetailTrain === undefined) {
        err = true;
    }

    if(hasilBooking === null || hasilBooking === undefined) {
        err = true;
    }


    setTimeout(() =>{ 

        if(hasilBooking && new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()) {
               err = true;
        }

    }, hasilBooking && new Date(hasilBooking.timeLimit).getTime() - new Date().getTime());

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    
     var i=0;

     var date = dataBookingTrain ? new Date(dataBookingTrain[0].departureDate) : '';
     var tahun = dataBookingTrain ? date.getFullYear() : '';
     var bulan = dataBookingTrain ? date.getMonth() : '';
     var hari = dataBookingTrain ? date.getDay() : '';
     var tanggal = dataBookingTrain ? date.getDate() : '';
 
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

    async function handlerPilihKursi(e) {

        e.preventDefault();
        setOpen(true)

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/get_seat_layout`, {
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


     const [changeState, setChangeSet] = useState({});
     const initialChanges = Array();

     useEffect(() => {
        hasilBooking !== undefined && hasilBooking !== null &&
        hasilBooking.passengers.map((e, i) => {
            initialChanges.push({
                name: e,
                type:passengers.adults[i] !== null && passengers.adults[i] ? 'adult' : 'infant',
                class:hasilBooking.seats[i][0],
                wagonNumber:hasilBooking.seats[i][1],
                row:hasilBooking.seats[i][2],
                column:hasilBooking.seats[i][3],
                checkbox:false,
            });  
        });

        setChangeSet([initialChanges]);

     }, [setChangeSet]);



     const handlerKonfirmasi = (e) => {
        setIsLoading(true)
        e.preventDefault();
        setTimeout(() => {
            setIsLoading(false);
            navigate({
                pathname: "/train/bayar/" + dataBookingTrain[0].trainNumber,
            })

        }, 1000)


     }

     const handlerPindahKursi = async (e) => {
        
        e.preventDefault();
        let changeStateFix = changeState;

        let wagonNumber = changeStateFix[0][0]["wagonNumber"];
        let className = changeStateFix[0][0]["class"];
        setisLoadingPindahKursi(true);
        
        changeStateFix[0].forEach(item => {
            delete item.name;
            delete item.checkbox;
            delete item.class;
            delete item.wagonNumber;
          });

          let gantiKursiFix = {
            productCode: "WKAI",
            bookingCode:hasilBooking.bookingCode,
            transactionId:hasilBooking.transactionId,
            wagonNumber:wagonNumber,
            wagonCode:className,
            seats:changeStateFix[0],
            token:JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
          }

          gantiKursiFix.seats = gantiKursiFix.seats.filter(seat => seat.type !== "infant");

          gantiKursiFix.seats.forEach(item => {
            delete item.type;
          });
          
        //   let z = Object.assign(gantiKursiFix, passengers);

        let hasilBookingData = hasilBooking;

        for(var i=0; i< changeStateFix[0].length; i++){
            if(gantiKursiFix.seats[i] !== undefined && gantiKursiFix.seats[i] !== null){
                hasilBookingData.seats[i][1] = wagonNumber
                hasilBookingData.seats[i][2] = gantiKursiFix.seats[i].row.toString()
                hasilBookingData.seats[i][3] = gantiKursiFix.seats[i].column
            }
        }

          const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/change_seat`, gantiKursiFix);
          setOpen(false)

          if(response.data.rc === '00'){
            localStorage.setItem(trainNumber + '_hasilBookingdanPilihKursi', JSON.stringify(hasilBookingData));
            setHasilBooking(hasilBookingData);
            setisLoadingPindahKursi(false);
            successNotification();

            setTimeout(() => {
                window.location.reload()
            }, 1500)
            
          }else if(response.data.rc === '55'){
            setisLoadingPindahKursi(false);
            failedNotification();

            setTimeout(() => {
                window.location.reload(response.data.rd)
            }, 2000)

          }else{
            setisLoadingPindahKursi(false);
            failedNotification();

            setTimeout(() => {
                window.location.reload(response.data.rd)
            }, 2000)
          }
                   
     }

     function handleError(){
        
        window.location = '/';
        localStorage.removeItem(trainNumber + '_booking');
        localStorage.removeItem(trainNumber + '_detailTrain');
        localStorage.removeItem(trainNumber + '_hasilBookingdanPilihKursi');
        localStorage.removeItem(trainNumber + '_passenggers');

     }

    return(
        <>
            {/* meessage bayar */}
            {contextHolder}

            {/* Pilih Seats  */}
            {err !== true ? (
                <>
                
            <Modal size="md" open={open} onClose={handleClose}>
            <Modal.Header>
            <Modal.Title>
                <div className="text-gray-500 font-bold mt-2">
                Pindah Kursi
                </div>
                <small>
                    tekan tombol pilih kursi untuk ganti kursi terbaru.
                </small>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                dataSeats.data !== undefined ? (
                        <>
                            <div className="flex flex-col w-full bg-white outline-none focus:outline-none">
                            <form> 
                                {/*header*/} 

                                    {/*body*/} 
                                    <div className="relative flex-auto">
                                        <div className="">
                                        <div className="grid w-full grid-cols-1 md:grid-cols-3"> 
                                        {/* sidebar seats Kai */} 
                                            <div className='text-start'>
                                                {changeState[0].map((e, i) =>(
                                                    <>
                                                    {e.type === 'adult' && (
                                                        <div className='border m-2 rounded-md mt-2 text-xs font-bold'>
                                                        <div className="flex space-x-4 items-center p-4 text-gray-700">
                                                            <div className="text-2xl font-bold">
                                                                {i + 1}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold mt-2">{e.name}</div>
                                                                <div className="mt-2">{e.class === 'EKO' ? 'Ekonomi' : e.class === 'EKS' ? 'Eksekutif' : 'Bisnis' } {e.wagonNumber}</div>
                                                                <div>{e.row}{e.column}</div>
                                                            </div>
                                                        </div>
                                                        </div>                                                   
                                                    )}
                                                    </>
                                                ))}
                                            </div>                        
                                            {/* seats cols and rows kereta premium dan bisnis */}
                                            <div className="col-span-2 w-full h-[540px]">
                                            <div className="flex justify-center mb-8 mt-4">
                                                <>
                                                <div className="w-1/2 ">
                                                    <label for="underline_select" class="sr-only">Underline select</label>
                                                    <select onChange={(e) => setClickSeats(e.target.value) } id="underline_select" class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                                        { dataSeats !== undefined || dataSeats !== null ? dataSeats.data.map((data, i) => ( ( 
                                                            <option value={i}>{data.wagonCode === 'EKO' ? 'Ekonomi' : data.wagonCode === 'EKS' ? 'Eksekutif' : 'Bisnis' } {data.wagonNumber}</option>
                                                        ))) : (<></>)}
                                                    </select>  
                                                </div> 
                                                </>
                                            </div>
                                            <div className="">
                                            </div>
                                                {
                                                    dataSeats !== undefined && dataSeats !== null && (
                                                        <>
                                                            <SeatMap changeState={changeState} setChangeSet={setChangeSet} clickSeatsData={clickSeats} seats={dataSeats.data[clickSeats].layout} />
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </>
                    )
                    :
                    (
                         <Placeholder.Paragraph />
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="flex space-x-4 pt-8 py-2 justify-end">
                <Button onClick={handlerPindahKursi} appearance="primary">
                {isLoadingPindahKursi === true ? (
                    <div className="flex space-x-2 items-center">
                        <svg aria-hidden="true" class="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div class="">Loading...</div>
                    </div>
                    )
                        
                    : (
                        <>Pindah Kursi</>
                    )
                }
            </Button>
            <Button onClick={handleClose} appearance="subtle">
                Cancel
            </Button>
                </div>
            </Modal.Footer>
            </Modal>

            {/* end show modal */}

            {/* header kai flow */}
            <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                <div className='block xl:hidden text-slate-500'>Detail</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
            </div>
            <div className='flex space-x-2 items-center'>
                <div className='hidden xl:flex text-blue-500 font-bold'>Konfirmasi pesanan</div>
                <div className='block xl:hidden text-blue-500  font-bold'>Konfirmasi</div>
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
        <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
            <div className="w-full mx-0 2xl:mx-4">
            <div className='mt-8 w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className='p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100'>
                        <div className='text-slate-700 font-bold '>Keberangkatan kereta</div>
                        <small className='text-gray-700'>{tanggal_keberangkatan_kereta}</small>
                    </div>
                    <div className='p-4 pl-8  text-gray-700'>
                        <div className='text-xs font-bold'>{dataBookingTrain && dataBookingTrain[0].trainName}</div>
                        <small>{classTrain} Class {dataBookingTrain && dataBookingTrain[0].seats[0].class}</small>
                    </div>
                    <div className="mt-2">

                    </div>
                    <div className='p-4 pl-8 mb-4'>
                    <ol class="relative border-l border-dashed border-gray-500 dark:border-gray-700">                  
                            <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain && dataBookingTrain[0].departureTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs text-slate-600 font-bold dark:text-white">{dataBookingTrain && dataDetailTrain[0].berangkat_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataBookingTrain && dataDetailTrain[0].berangkat_id_station})</p>
                                    </div>
                                </div>
                            </li>
                            <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <div className='flex space-x-12'>
                                    <time class="mb-1 text-sm leading-none text-gray-400 dark:text-gray-500">{dataBookingTrain && dataBookingTrain[0].arrivalTime}</time>
                                    <div className='-mt-2'>
                                        <h3 class="text-left text-xs  text-slate-600 font-bold dark:text-white">{dataBookingTrain && dataDetailTrain[0].tujuan_nama_kota}</h3>
                                        <p class="text-left text-xs text-gray-500 dark:text-gray-400">({dataBookingTrain && dataDetailTrain[0].tujuan_id_station})</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
            </div>
            {/* adult */}
            { passengers.adults && passengers.adults.length > 0 ? (
            <div className="text-sm xl:text-sm font-bold text-slate-600 mt-12">
                <p>ADULT PASSENGERS</p>
            </div>
            ) : '' }
            { passengers.adults && passengers.adults.length > 0 ? passengers.adults.map((e, i) =>(
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
                                    <div className="text-gray-600">{hasilBooking !== null ? hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0] === 'BIS' ? 'Bisnis' : 'Eksekutif' : '' }  {hasilBooking  !== null ? hasilBooking.seats[i][1] : ''} - {hasilBooking ? hasilBooking.seats[i][2] : ''}{hasilBooking !== null ? hasilBooking.seats[i][3] : ''}</div>
                                </div> 
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}
            {/* infants */}

            {passengers.infants && passengers.infants.length > 0 ? (
            <div className="text-sm xl:text-sm font-bold text-slate-600 mt-12">
                <p>INFANTS PASSENGERS</p>
            </div>
            ) : '' }
            { passengers.infants && passengers.infants.length > 0 ? passengers.infants.map((e, i) =>(
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
                                    <div className="text-gray-600">{hasilBooking !== null ? hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0] === 'BIS' ? 'Bisnis' : 'Eksekutif' : '' }  {hasilBooking  !== null ? hasilBooking.seats[i][1] : ''} - {hasilBooking ? hasilBooking.seats[i][2] : ''}{hasilBooking !== null ? hasilBooking.seats[i][3] : ''}</div>
                                </div> 
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}
             <div className="text-sm xl:text-sm font-bold text-slate-600 mt-12">
                <p>PRICE DETAILT</p>
            </div>
                <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className="p-4">
                        <div className="text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                            {dataBookingTrain && dataBookingTrain[0].trainName} {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ''} { TotalChild > 0 ? `(Adult) x${TotalChild}` : ''} { TotalInfant > 0 ? `(Adult) x${TotalInfant}` : ''}
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(hasilBooking.normalSales*TotalAdult)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Biaya Admin (Fee)
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(hasilBooking.nominalAdmin)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Diskon (Rp.)
                            </div>
                            <div>
                                Rp. {hasilBooking && hasilBooking.discount}
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500 font-bold flex justify-between">
                            <div>
                                Total Harga
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(parseInt(hasilBooking.normalSales*TotalAdult) - parseInt(hasilBooking.discount) + parseInt(hasilBooking.nominalAdmin))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <ButtonAnt onClick={handlerKonfirmasi}  size="large" key="submit"  type="primary" className='bg-blue-500 mx-2 font-semibold mt-4' loading={isLoading}>
                        Lanjut ke Pembayaran
                    </ButtonAnt>
                </div>      
            </div>  
            {/* desktop sidebar */}
            <div className="sidebar w-full xl:w-1/2">
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="flex items-center justify-between p-4">
                        <div className="text-gray-500 text-sm">Booking ID</div>
                        <div className="font-bold text-blue-500 ">{hasilBooking && hasilBooking.bookingCode}</div>
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
                <div>
                </div>
            </div>
        </div>
                </>
            )
        
            : 
            (
        <Modals.error
                title="Error!"
                open={true}
                content= 'Terjadi kesalahan, silahkan booking kembali.'
                footer={[
                    (
                    <div className="flex justify-end mt-4">
                        <ButtonAnt key="submit" type="primary" className='bg-blue-500' onClick={ handleError }>
                             Kembali ke home
                        </ButtonAnt>,
                    </div>
                    )
                  ]}
            >
        </Modals.error>
            )
        }
        </>
    )
}