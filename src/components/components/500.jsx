import { Button, Result } from "antd";
import React from "react";


const Page500 = () => {
	return (
		<>
		<Result
          status="500"
          title="Session Expired!"
          subTitle="Silahkan Anda login terlebih dahulu."
          style={{ color: "white" }} // Ini akan memastikan warna teks menjadi putih
          extra={
            <Button
              style={{ color: "white" }} // Ini akan memastikan warna teks menjadi putih
              className="bg-blue-600 text-white hover:text-gray-100 focus:text-gray-100 active:text-gray-200"
              onClick={() => window.location = '/'}
            >
              Back Home
            </Button>
          }
        />
		</>
	)
}

export default Page500;