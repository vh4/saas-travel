import React from 'react';
import { Timeline, Grid, Row, Col } from 'rsuite';


const AlignTimeline = ({ align }) => (
    <Timeline align={align}>
      <Timeline.Item>
        <p>Cari Jadwal Tiket</p>
        <p>Pilih tiket dengan harga yang murah dan bandingkan jadwal tiket dengan lainya.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p>Booking Tiket</p>
        <p>Lakukan booking tiket dengan mengisi formulir pada tiket yang dipilih dengan sesuai identitas.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p>Pembayaran Tiket</p>
        <p>Lakukan pembayaran dan pastikan saldo anda mencukupi atau silakan isi deposit sebelun melakukan pembelian tiket.</p>
      </Timeline.Item>
      <Timeline.Item>
        <p>Download E-Tiket</p>
        <p>Download E-Tiket dan pastikan tiket tersebut dapat digunakan.</p>
      </Timeline.Item>
    </Timeline>
  );


export default function WhyFastravel(){
    return(
        <>
            <div className='mt-36 title text-center text-2xl font-bold text-gray-800'>
                Mengapa memesan tiket di Fastravel?
            </div>
            <div className=''>
            <div className='mt-36 block lg:grid lg:grid-cols-4 lg:gap-4 xl:items-center'>
                <div className='block w-full'>
                    <div className="mb-4">
                        <img class="rounded-t-lg w-full"  src="fast.png"  alt="Travel.png" />
                    </div>
                    <div className='mt-2 font-bold text-gray-700 text-xl'>
                        Pembelian Tiket Cepat
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Hanya dengan login dan pilih tiket, kemudian lakukan pembayaran dengan menekan tombol pembayaran sudah mendapatkan tiket anda.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4">
                        <img class="rounded-t-lg min-h-[120px] md:max-w-[190px]"  src="diskon.png" alt="diskon" />
                    </div>
                    <div className='mt-2 font-bold text-gray-700 text-xl'>
                        Tanpa Biaya Tambahan
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Banyak diskon promo dan tanpa biaya tambahan dari pihak ketiga sehingga kamu hanya bayar tiket sesuai yang dipilih saja.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4">
                        <img class="rounded-t-lg w-full"  src="secure.png" alt="secure" />
                    </div>
                    <div className='mt-8 font-bold text-gray-700 text-xl'>
                        Keamanan Transaksi
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Keamanan transaksi terjaga dan terawasi dengan baik karena di bawah kendali mutu ISO 20071 dan PCI-DSS Secure System.</div>
                </div>
                <div className='block w-full'>
                    <div className="mb-4">
                        <img class="rounded-t-lg min-h-[120px] md:max-w-[200px]"  src="pays.png" alt="pay" />
                    </div>
                    <div className='mt-2 font-bold text-gray-700 text-xl'>
                        Siap Membantu Kamu
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>Team kami siap membantu anda banyak hal mulai dari pencarian tiket, booking tiket dan pembayaran. semuanya akan lebih mudah.</div>
                </div>
            </div>
            </div>
            <div className='mt-36 '>
                <div className='title text-center text-2xl font-bold text-gray-800'>
                    Pembelian Tiket di Fastravel.com
                </div>
                <div className='mt-36'>
                    <AlignTimeline align="alternate" />
                </div>
            </div>
        </>
    )
}