import React, {useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Login({setShowModalComponent}){
    
    const [uid, setuid] = useState();
    const [pin, setpin] = useState();
    
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_out`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        }).then(() => {
            localStorage.removeItem('userDetails');
            localStorage.removeItem(process.env.REACT_APP_SECTRET_LOGIN_API);
            toast.success('Anda berhasil logout!');
            navigate('/')
        });
    }

    const saveTokenInLocalStorage = (tokenDetails) => {
        localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
    }

    // const runLogoutTimer = () => {
    //     setTimeout(() => {
    //         logout();
    //     }, 43200000);
    // }

    const handlerLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/sign_in`, {
                outletId:uid,
                pin:pin,
                key: ''
            }).then((data) => {
                if(data.data.rc === "00"){
                    console.log(data.data);
                    saveTokenInLocalStorage(data.data);
                    // runLogoutTimer(data.data.timer * 43200000);
                    setShowModalComponent(false)
                    setLoading(false);
                    localStorage.setItem(process.env.REACT_APP_SECTRET_LOGIN_API, JSON.stringify(data.data.token));
                } else {
                    toast.error(data.data.rd);
                    setLoading(false)
                }
             }); 
        } 
        catch (error) {}
    }

    return(
        <>

        <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
            <div className="relative w-auto xl:w-1/4 my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <form>
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold text-gray-600">
                   <img className="w-100" src={'/logo.png'} alt="logo.png" />
                </h3>
                <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalComponent(false)}
                >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                    </span>
                </button>
                </div>
                {/*body*/}
                <div className="relative -mt-12 p-8 xl:p-16 flex-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed">     
                    <div class="relative z-0 mb-6 w-full group">
                        <input onChange={(e) => setuid(e.target.value)} type="text" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                    </div>
                    <div class="relative z-0 mb-6 w-full group">
                        <input onChange={(e) => setpin(e.target.value)} type="password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Pin number</label>
                    </div>
                </p>
                </div>
                {/* <div className="pl-8 -mt-5 xl:pl-16">
                    <p className="text-blue-500">lupa password ?</p>
                </div> */}
                {/*footer*/}
                <div className="flex items-center justify-end p-6  border-solid border-slate-200 rounded-b">
                <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalComponent(false)}
                >
                    Close
                </button>
                <button
                    className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handlerLogin}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}