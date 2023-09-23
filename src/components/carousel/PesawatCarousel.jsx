import React from "react";
import { IoLocationOutline } from 'react-icons/io5'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GiStarsStack } from 'react-icons/gi'
import { BsArrowRightShort } from 'react-icons/bs'
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

export default function PesawatCarousel() {
  // Tanggal saat ini
  const today = dayjs();
  const nextSaturday = today.add(1, 'week').day(6);
  const formattedDate = nextSaturday.format('dddd, D MMM YYYY');
  const formattedDateUrl = nextSaturday.format('YYYY-MM-DD');

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  const data = [
    {
      keberangkatan: 'Jakarta CGK',
      tujuan: 'Bali Denpasar',
      NamaMaskapai: 'Lion Air',
      logo: 'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
      image: './bali.jpg',
      params: {
        departure: 'HLP',
        departureName: 'Halim Perdanakusuma',
        arrival: 'DPS',
        arrivalName: 'Ngurah Rai',
        departureDate: formattedDateUrl,
        returnDate: '',
        isLowestPrice: true,
        adult: 1,
        child: 0,
        infant: 0
      },
      harga: 1200000,
      tanggal: formattedDate
    },
    {
      keberangkatan: 'Jakarta CGK',
      tujuan: 'Raja Ampat',
      NamaMaskapai: 'Lion Air',
      logo: 'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
      image: 'papuaaa.jpg',
      params: {
        departure: 'CGK',
        departureName: 'Soekarno – Hatta',
        arrival: 'RJM',
        arrivalName: 'Marinda',
        departureDate: formattedDateUrl,
        returnDate: '',
        isLowestPrice: true,
        adult: 1,
        child: 0,
        infant: 0
      },
      harga: 2560000,
      tanggal: formattedDate
    },
    {
      keberangkatan: 'Jakarta CGK',
      tujuan: 'Juanda',
      NamaMaskapai: 'Lion Air',
      logo: 'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
      image: './surabaya.jpg',
      params: {
        departure: 'CGK',
        departureName: 'Soekarno – Hatta',
        arrival: 'SUB',
        arrivalName: 'Juanda',
        departureDate: formattedDateUrl,
        returnDate: '',
        isLowestPrice: true,
        adult: 1,
        child: 0,
        infant: 0
      },
      harga: 820000,
      tanggal: formattedDate
    },
    {
      keberangkatan: 'Jakarta HLM',
      tujuan: 'Yogyakarta',
      NamaMaskapai: 'Lion Air',
      logo: 'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
      params: {
        departure: 'HLP',
        departureName: 'Halim Perdanakusuma',
        arrival: 'JOG',
        arrivalName: 'Adisutjipto',
        departureDate: formattedDateUrl,
        returnDate: '',
        isLowestPrice: true,
        adult: 1,
        child: 0,
        infant: 0
      },
      image: './jogja.jpg',
      harga: 3000000,
      tanggal: formattedDate
    },
    {
      keberangkatan: 'Jakarta CGK',
      tujuan: 'Surakarta',
      NamaMaskapai: 'Lion Air',
      logo: 'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
      params: {
        departure: 'CGK',
        departureName: 'Soekarno – Hatta',
        arrival: 'SOC',
        arrivalName: 'Adisumarmo',
        departureDate: formattedDateUrl,
        returnDate: '',
        isLowestPrice: true,
        adult: 1,
        child: 0,
        infant: 0
      },
      image: './surakarta.jpg',
      harga: 600000,
      tanggal: formattedDate
    },
  ];

  function toRupiah(angka) {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return rupiah.split('', rupiah.length - 1).reverse().join('');
  }

  const navigate = useNavigate();

  function submitHandle(params){

    localStorage.setItem('v-search', JSON.stringify(params));
    navigate({
      pathname: '/flight/search',
      search: `?${createSearchParams(params)}`,
    });

  }

  return (
    <>
      <div className="">
        <div className="hidden md:block py-4 px-4 md:px-0 title text-slate-600 text-md md:text-2xl font-medium">
          <div className="flex space-x-2 items-center text-lg font-semibold"><div>Rekomendasi Pesawat Buat Kamu Loh </div><GiStarsStack className="text-yellow-400" /></div>
          <div className="mt-2 text-sm text-gray-400">Bingung perjalanan akhir pekan mau kemana, disini tempat rekomendasi buat kamu.</div>
        </div>
        <div className='block mt-8 md:hidden px-4 mb-4 text-gray-500'>
          <div className="font-semibold text-sm">Rekomendasi pesawat</div>
          <small >rekomendasi weekend menarik untuk kamu.</small>
        </div>
        <div className="mx-2 md:mx-0 flex space-x-2 mb-2 overflow-x-scroll scrollbar-hide">
          <button type="button" class="py-2.5 px-5 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-full border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-200">Jakarta</button>
          <button disabled type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bandung</button>
          <button disabled type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surabaya</button>
          <button disabled type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Yogyakarta</button>
          <button disabled type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surakarta</button>
          <button disabled type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bali</button>
        </div>
        <Carousel responsive={responsive} className="p-2 md:p-0 flex items-stretch ">
          {data.map((e, index) => (
            <div onClick={() => submitHandle(e.params)} className="mx-1 md:mx-0 flex-1 h-full cursor-pointer" key={index}>
              <div class="w-fit mx-0 lg:mx-2 md:min-w-[240px] md:max-w-[250px] bg-white border border-gray-200 rounded-lg h-full">
                <div className="mb-4">
                  <img class="rounded-t-lg min-h-[120px] md:min-h-[120px]" src={e.image} alt="hotel image" />
                </div>
                <div class="flex flex-col px-2 pb-5">
                  <div className="pl-2">
                    <h5 class="flex space-x-2 items-center text-sm font-semibold tracking-tight text-gray-700"><div>{e.keberangkatan}</div><BsArrowRightShort /><div>{e.tujuan}</div></h5>
                    <div className="mt-2 flex space-x-2 items-center">
                      <img src={e.logo} width={25} alt="logo.png" />
                      <small className="text-gray-500">{e.NamaMaskapai}</small>
                    </div>
                    <small className="text-gray-500">{e.tanggal}</small>
                  </div>
                  <div class="py-2 flex items-center justify-start mt-5 pl-2">
                    <div>
                      <div className="text-xs text-gray-500">Harga mulai</div>
                      <div className="flex space-x-2"><span class="text-md font-bold text-blue-500">Rp.{toRupiah(e.harga)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  )
}
