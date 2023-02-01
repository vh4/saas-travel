import React from "react";
import {IoLocationOutline} from 'react-icons/io5'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {GiStarsStack} from 'react-icons/gi'
import {BsArrowRightShort} from 'react-icons/bs'

export default function PesawatCarousel(){
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

      const data = [{
        keberangkatan: 'Jakarta',
        tujuan: 'Denpasar Bali',
        NamaMaskapai: 'Citilink',
        logo:'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit00gsmenlarge1/string/2020/12/17/3deec547-980a-4d75-ac89-6e34eb9ddcf7-1608153225434-f5996f5af379dc69b93f00f8b725e579.png',
        image:'https://imageio.forbes.com/specials-images/imageserve/675172642/pura-ulun-danu-bratan-temple-in-Bali-/960x0.jpg?format=jpg&width=960',
        harga: 1260000,
        tanggal:'30 Jan 2023'
      },
      {
        keberangkatan: 'Jakarta',
        tujuan: 'Papua',
        NamaMaskapai: 'Citilink',
        logo:'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit00gsmenlarge1/string/2020/12/17/3deec547-980a-4d75-ac89-6e34eb9ddcf7-1608153225434-f5996f5af379dc69b93f00f8b725e579.png',
        image:'https://www.turiz.id/wp-content/uploads/2020/03/03ad0c4e-3e47-4d1e-9bfb-88855329eb64.jpg',
        harga: 5260000,
        tanggal:'05 Feb 2023'
      },
      {
        keberangkatan: 'Jakarta',
        tujuan: 'Surabaya',
        NamaMaskapai: 'Lion Air',
        logo:'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
        image:'https://www.nibble.id/uploads/wisata_anak_surabaya_2022_10_df0b9d5df1.jpg',
        harga: 1025000,
        tanggal:'27 Jan 2023'
      },
      {
        keberangkatan: 'Jakarta',
        tujuan: 'Yogyakarta',
        NamaMaskapai: 'Lion Air',
        logo:'https://storage.googleapis.com/static-sbf/fastravel/asset/maskapai/TPIW.png',
        image:'https://asset.kompas.com/crops/PXj4FVleekuQq-mgvju_Yo9e6wk=/0x0:1000x667/750x500/data/photo/2020/06/27/5ef71456e667a.jpg',
        harga: 810000,
        tanggal:'22 Feb 2023'
      },
      {
        keberangkatan: 'Jakarta',
        tujuan: 'Denpasar Bali',
        NamaMaskapai: 'Citilink',
        logo:'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit00gsmenlarge1/string/2020/12/17/3deec547-980a-4d75-ac89-6e34eb9ddcf7-1608153225434-f5996f5af379dc69b93f00f8b725e579.png',
        image:'https://imageio.forbes.com/specials-images/imageserve/675172642/pura-ulun-danu-bratan-temple-in-Bali-/960x0.jpg?format=jpg&width=960',
        harga: 1260000,
        tanggal:'21 Februari 2023'
      },
    ];

    function toRupiah(angka) {
      var rupiah = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
      return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    return(
        <>
            <div className="">
                <div className="py-4 px-4 md:px-0 title text-slate-600 text-md md:text-2xl font-medium">
                    <div className="flex space-x-2 items-center"><div>Rekomendasi Pesawat Buat Kamu Loh </div><GiStarsStack className="text-yellow-400" /></div>
                    <div className="mt-2 text-sm text-gray-400">Bingung perjalanan akhir pekan mau kemana, disini tempat rekomendasi buat kamu.</div>
                </div>
                <div className="mx-2 md:mx-0 flex space-x-2 mb-2">
                    <button type="button" class="py-2.5 px-5 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-full border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-200">Jakarta</button>
                    <button type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bandung</button>
                    <button type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surabaya</button>
                    <button type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Yogyakarta</button>
                    <button type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surakarta</button>
                    <button type="button" class="py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bali</button>
                </div>
                <Carousel responsive={responsive} className="flex items-stretch ">
                    {data.map((e) => (
                          <div className="mx-1 md:mx-0 flex-1 h-full">
                            <div class="w-fit md:min-w-[250px] md:max-w-[250px] bg-white border border-gray-200 rounded-lg h-full  dark:bg-gray-800 dark:border-gray-700">
                                <div className="mb-4">
                                    <img class="rounded-t-lg min-h-[120px] md:min-h-[120px]" src={e.image} alt="hotel image" />
                                </div>
                                <div class="flex flex-col px-2 pb-5">
                                    <div className="pl-2">
                                        <h5 class="flex space-x-2 items-center text-sm font-semibold tracking-tight text-gray-700 dark:text-white"><div>{e.keberangkatan}</div><BsArrowRightShort /><div>{e.tujuan}</div></h5>
                                        <div className="mt-2 flex space-x-2 items-center">
                                            <img src={e.logo} width={25} alt="logo.png" />
                                            <small className="text-gray-500">{e.NamaMaskapai}</small>
                                        </div>
                                        <small className="text-gray-500">{e.tanggal}</small>
                                    </div>
                                    <div class="py-2 flex items-center justify-start mt-5 pl-2">
                                        <div>
                                            <div className="text-xs text-gray-500">Harga mulai</div>
                                          <div className="flex space-x-2"><span class="text-md font-bold text-blue-500 dark:text-white">Rp.{toRupiah(e.harga)}</span></div>
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