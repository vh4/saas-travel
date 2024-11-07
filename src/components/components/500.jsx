import React from "react";

const Page500 = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px - 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="text-center max-w-[280px]">
        <img
          src="/error1.png"
          alt="Session Expired"
          className="mx-auto" 
        />
        <div className="mt-4">
          Maaf, terjadi kesalahan. Silakan login kembali.
        </div>
      </div>
    </div>
  );
};

export default Page500;
