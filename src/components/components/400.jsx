import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";


const Page400 = () => {

	const navigate = useNavigate();
	return (
		<>
		<div className="mt-16">
			<Result
			status="500"
			title="Page Error!"
			//error dalam masalah session nya habis, kalau ngak parameter urlnya tidak benar.
			subTitle="Terjadi Kesalahan pada page. Silahkan lakukan booking ulang."
			style={{ color: "white" }}
			extra={
			<Button
				style={{ color: "white" }}
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

export default Page400;