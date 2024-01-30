import React from "react";
import { AiOutlineInsertRowLeft } from "react-icons/ai";
import { BsArrowBarLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const PageExpired = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px - 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
          <div className="text-center max-w-[300px]">
            <img
              src="/error1.png"
              alt="Session Expired"
              className="mx-auto" // Tambahkan class mx-auto untuk memastikan gambar berada di tengah secara horizontal
            />
            <div className="mt-4">
                Booking anda telah expired. Silahkan lakukan booking ulang.
            </div>
          </div>
            <Link to={'/'}>
              <div className="flex justify-center mt-4 space-x-2 items-center text-blue-500 cursor-pointer">
                <BsArrowBarLeft size={20} />
                <div>Kembali</div>
              </div>
            </Link>
      </div>
    </div>
  );
};

export default PageExpired;
