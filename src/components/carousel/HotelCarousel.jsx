import React from "react";
import {IoLocationOutline} from 'react-icons/io5'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {GiStarsStack} from 'react-icons/gi'

export default function HotelCarousel(){
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
          breakpoint: { max: 1024, min: 564 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 564, min: 0 },
          items: 2
        }
      };

      const data = [{
        name: 'Hotel Kencana',
        image:'https://sitecore-cd-imgr.shangri-la.com/MediaFiles/D/9/4/%7BD94CAF4F-425A-4F7B-B005-7C542F15AC6D%7D220607_SLJ_AboutOverviewBanner.jpg?width=630&height=480&mode=crop&quality=100&scale=both',
        lokasi: 'Jalan Sarinah, Jakarta Pusat',
        harga: 400000,
        diskon:5,
        rating:3.0,
        inHotel:20
      },
      {
        name: 'Hotel Karen Pondok Indah',
        image:'https://koran-jakarta.com/images/library/fsj-261022121251.jpeg',
        lokasi: 'Jln. Sudirman, Jakarta Pusat',
        harga: 200000,
        diskon:2,
        rating:4.0,
        inHotel:20
      },
      {
        name: 'Hotel Pelangi Jaya',
        image:'https://res.klook.com/image/upload/fl_lossy.progressive,q_85/c_fill,w_680/Pullman_Jakarta_-_UNA_outdoor_lihu2v.jpg',
        lokasi: 'Tanah Abang, Jakarta Barat',
        harga: 150000,
        diskon:0,
        rating:4.0,
        inHotel:20
      },
      {
        name: 'Hotel Palaraya Tua',
        image:'https://www.ruparupa.com/blog/wp-content/uploads/2022/01/BART_06-1024x764.jpg',
        lokasi: 'Tanah Abang, Jakarta Barat',
        harga: 750000,
        diskon:10,
        rating:4.0,
        inHotel:20
      },
      {
        name: 'Hotel Tanah A42',
        image:'https://cdn2.tstatic.net/travel/foto/bank/images/airy-eco-solo-baru-diponegoro-a8.jpg',
        lokasi: 'Jendral Sudirman, Jakarta Pusat',
        harga: 350000,
        diskon:15,
        rating:5.0,
        inHotel:20
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
                    <div className="flex space-x-2 items-center"><div>Rekomendasi Hotel Buat Kamu Loh </div><GiStarsStack className="text-yellow-400" /></div>
                    <div className="mt-2 text-sm text-gray-400">Mau staycation?, buruan booking hotel termurah disini.</div>
                </div>
                <div className="mx-2 md:mx-0">
                  <div className="w-full flex space-x-2 mb-2 overflow-x-auto overflow-hidden whitespace-nowrap scrollbar-hide">
                      <button class="flex-none py-2.5 px-5 mb-2 text-sm font-medium text-white focus:outline-none bg-blue-500 rounded-full border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-200">Jakarta</button>
                      <button class="flex-none py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bandung</button>
                      <button class="flex-none py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Yogyakarta</button>
                      <button class="flex-none py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surakarta</button>
                      <button class="flex-none py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Surabaya</button>
                      <button class="flex-none py-2.5 px-5 mr-3 mb-2 text-sm font-medium text-blue-400 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-200">Bali</button>
                  </div>
                </div>
                <Carousel responsive={responsive}  className="flex items-stretch">
                    {data.map((e) => (
                          <div className="mx-2 h-full">
                            <div class="w-fit md:min-w-[250px] md:max-w-[270px] h-full bg-white border border-gray-200 rounded-lg">
                                <div className="mb-4">
                                    <img class="rounded-t-lg w-full min-h-[120px] max-h-[120px] md:min-h-[170px] md:max-h-[170px]" src={e.image} alt="hotel image" />
                                </div>
                                <div class="px-2 pb-5">
                                  <div className="flex flex-col">
                                  <div>
                                        <h5 class="ml-1 text-sm font-semibold tracking-tight text-gray-700">{e.name}</h5>
                                        <div className="mt-2 flex ">
                                            <IoLocationOutline className="text-gray-500" />
                                            <small className="text-gray-500">{e.lokasi}</small>
                                        </div>
                                    </div>
                                    <div class="flex items-center mt-2.5 mb-3">
                                        {[...Array(e.rating)].map(() =>
                                        <svg aria-hidden="true" class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>

                                        )}
                                        <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{e.rating}/5.0</span>
                                    </div>
                                  </div>
                                    <div class="flex items-center justify-start pl-2 mt-5">
                                        <div>
                                          <div className="flex space-x-2"><span class="text-md font-bold text-blue-500 ">Rp.{toRupiah(e.harga - (e.harga * (e.diskon/100)))}</span><div className="text-gray-500 text-sm">{e.diskon !== 0 ? (<s>Rp.{toRupiah(e.harga)}</s>) : null}</div></div>
                                            <div className="text-xs text-gray-500">Diskon {e.diskon}%</div>
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