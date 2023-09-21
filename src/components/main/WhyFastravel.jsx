import React from 'react';
import { Timeline, Grid, Row, Col } from 'rsuite';

const AlignTimeline = ({ align }) => (
    <Timeline align={align}>
        <Timeline.Item>
            <p className='font-semibold text-gray-600'>Temukan Jadwal Tiket yang Tepat</p>
            <p>Pilih tiket dengan harga terbaik dan bandingkan jadwal dengan yang lainnya.</p>
        </Timeline.Item>
        <Timeline.Item>
            <p className='font-semibold text-gray-600'>Booking Tiket dengan Mudah</p>
            <p>Lakukan booking tiket dengan mengisi formulir sesuai identitas.</p>
        </Timeline.Item>
        <Timeline.Item>
            <p className='font-semibold text-gray-600'>Pembayaran Tiket yang Aman</p>
            <p>Lakukan pembayaran dengan aman dan pastikan saldo Anda mencukupi atau isi deposit sebelum pembelian.</p>
        </Timeline.Item>
        <Timeline.Item>
            <p className='font-semibold text-gray-600'>Download E-Tiket dengan Cepat</p>
            <p>Unduh E-Tiket dan pastikan tiket tersebut siap digunakan.</p>
        </Timeline.Item>
    </Timeline>
);

export default function WhyRajaBiller() {
    return (
        <>
            <div className='mt-24 lg:mt-36 title text-center text-lg md:text-2xl font-bold text-gray-600 md:text-gray-800'>
                Mengapa Memesan Tiket di rajaBiller.com?
            </div>
            <div className=''>
                <div className='p-4 md:p-0 mt-8 lg:mt-36 block lg:grid lg:grid-cols-4 lg:gap-4 xl:items-center rounded-full'>
                    <div className='block w-full'>
                        <div className="mb-4 w-3/4 md:w-full flex justify-center mx-auto">
                            <img src="/3071353.jpg" alt="Travel.png" />
                        </div>
                        <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                            Pembelian Tiket yang Cepat
                        </div>
                        <div className='mt-4 text-sm text-gray-500'>Hanya dengan login dan pilih tiket, kemudian lakukan pembayaran dengan mudah dan dapatkan tiket Anda seketika.</div>
                    </div>
                    <div className='block w-full'>
                        <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full mx-auto">
                            <img src="/fee.jpg" alt="diskon" />
                        </div>
                        <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                            Tanpa Biaya Tambahan Lainya
                        </div>
                        <div className='mt-4 text-sm text-gray-500'>Nikmati promo diskon dan tidak ada biaya tambahan dari pihak ketiga sehingga Anda hanya membayar tiket yang Anda pilih.</div>
                    </div>
                    <div className='block w-full'>
                        <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full mx-auto">
                            <img src="/secure.jpg" alt="secure.jpg" />
                        </div>
                        <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                            Keamanan Transaksi Terjamin
                        </div>
                        <div className='mt-4 text-sm text-gray-500'>Transaksi aman dan terawasi dengan baik karena kami mengikuti standar mutu ISO 20071 dan memiliki PCI-DSS Secure System.</div>
                    </div>
                    <div className='block w-full'>
                        <div className="mb-4 w-3/4 md:w-full flex justify-center rounded-full  mx-auto">
                            <img src="/rede.jpg" alt="siapbantukamu.jpg" />
                        </div>
                        <div className='mt-2 font-bold text-gray-600 text-md md:text-xl'>
                            Dukungan Terbaik untuk Anda
                        </div>
                        <div className='mt-4 text-sm text-gray-500'>Tim kami siap membantu Anda dalam berbagai hal, mulai dari mencari tiket, melakukan booking, hingga pembayaran. Semuanya menjadi lebih mudah bersama kami.</div>
                    </div>
                </div>
            </div>
            <div className='mt-24 lg:mt-36'>
                <div className='title text-center text-lg  md:text-2xl font-bold text-gray-600 md:text-gray-800'>
                    Pembelian Tiket di rajaBiller.com
                </div>
                <div className='mt-16 lg:mt-36 p-4 md:p-0'>
                    <AlignTimeline align="alternate" />
                </div>
            </div>
        </>
    )
}
