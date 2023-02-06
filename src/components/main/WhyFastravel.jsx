import React from 'react';
import { Timeline, Grid, Row, Col } from 'rsuite';


const AlignTimeline = ({ align }) => (
    <Timeline align={align}>
      <Timeline.Item>
        <p className='font-semibold text-gray-600'>Cari Jadwal Tiket</p>
        <p>Pilih tiket dengan harga yang murah dan bandingkan jadwal tiket dengan lainya.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p className='font-semibold text-gray-600'>Booking Tiket</p>
        <p>Lakukan booking tiket dengan mengisi formulir pada tiket yang dipilih dengan sesuai identitas.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p className='font-semibold text-gray-600'>Pembayaran Tiket</p>
        <p>Lakukan pembayaran dan pastikan saldo anda mencukupi atau silakan isi deposit sebelun melakukan pembelian tiket.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p className='font-semibold text-gray-600'>Download E-Tiket</p>
        <p>Download E-Tiket dan pastikan tiket tersebut dapat digunakan.</p>
      </Timeline.Item>
    </Timeline>
  );


export default function WhyFastravel(){
    return(
        <>
            <div className='mt-24 lg:mt-36 title text-center text-lg md:text-2xl font-bold text-gray-600 md:text-gray-800'>
                Mengapa memesan tiket di Fastravel?
            </div>
            <div className=''>
            <div className='p-4 md:p-0 mt-8 lg:mt-36 block lg:grid lg:grid-cols-4 lg:gap-4 xl:items-center rounded-full'>
                <div className='block w-full'>
                    <div className="mb-4 w-3/4 md:w-full flex justify-center mx-auto">
                        <img src="/3071353.jpg"  alt="Travel.png" />
                    </div>
                    <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                        Pembelian Tiket Cepat
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Hanya dengan login dan pilih tiket, kemudian lakukan pembayaran dengan menekan tombol pembayaran sudah mendapatkan tiket anda.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full mx-auto">
                        <img src="/fee.jpg" alt="diskon" />
                    </div>
                    <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                        Tanpa Biaya Tambahan
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Banyak diskon promo dan tanpa biaya tambahan dari pihak ketiga sehingga kamu hanya bayar tiket sesuai yang dipilih saja.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full mx-auto">
                        <img src="/scure.jpg" alt="secure.jpg" />
                    </div>
                    <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                        Keamanan Transaksi
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Keamanan transaksi terjaga dan terawasi dengan baik karena di bawah kendali mutu ISO 20071 dan PCI-DSS Secure System.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full  mx-auto">
                        <img src="/rede.jpg"  alt="siapbantukamu.jpg" />
                    </div>
                    <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                        Siap Membantu Kamu
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Team kami siap membantu anda banyak hal mulai dari pencarian tiket, booking tiket dan pembayaran. semuanya akan lebih mudah.</div>
                </div>
            </div>
            </div>
            <div className='mt-24 lg:mt-36'>
                <div className='title text-center text-lg  md:text-2xl font-bold text-gray-600'>
                    Pembelian Tiket di Fastravel.com
                </div>
                <div className='mt-16 lg:mt-36 p-4 md:p-0'>
                    <AlignTimeline align="alternate" />
                </div>
            </div>
        </>
    )
}