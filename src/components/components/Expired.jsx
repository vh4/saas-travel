import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";


const PageExpired = () => {

  const navigate = useNavigate();

	return (
		<>
    <div className="mt-16">
    <Result
          status="500"
          title="Booking Expired!"
          subTitle="Booking sudah expired. Silahkan lakukan booking ulang."
          style={{ color: "white" }} // Ini akan memastikan warna teks menjadi putih
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

export default PageExpired;