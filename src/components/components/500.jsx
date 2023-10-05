import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";


const Page500 = () => {

  const navigate = useNavigate();
	return (
		<>
    <div className="mt-16">
    <Result
          status="500"
          title="Session Expired!"
          subTitle="Silahkan Anda login terlebih dahulu."
          style={{ color: "white", width:'100%' }} // Ini akan memastikan warna teks menjadi putih
          extra={
            <Button
              style={{ color: "white" }} // Ini akan memastikan warna teks menjadi putih
              className="bg-blue-600 text-white hover:text-gray-100 focus:text-gray-100 active:text-gray-200"
              onClick={() => navigate('/')}
            >
              Back Home
            </Button>
          }
        />
    </div>
		</>
	)
}

export default Page500;