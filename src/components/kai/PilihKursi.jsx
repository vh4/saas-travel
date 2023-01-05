const [clickSeats, setClickSeats] = useState(0);
const [cekKursi, setCekKursi] = useState();


const [showModal, setShowModal] = React.useState(false);
const seats = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16, 17, 18, 19, 20, 21]
const [dataSeats, setDataSeats] = useState([]);
const [dataSeatsLayout, setDataSeatsLayout] = useState([]);

var i=0;

function setLayout(seats) {
   // create a blank layout
   const layout = [];
 
   // loop through the seats
   for (const seat of seats) {
     // get the row and column of the seat
     const row = seat.row;
     const column = seat.column;
 
     // if the layout doesn't have a row for the seat, create one
     if (!layout[row]) {
       layout[row] = [];
     }
 
     // add the seat to the layout
     layout[row][column] = seat;
   }
 
   return layout;
 }


async function seatsFunction(){

   const response = await axios.post(`http://localhost:5000/travel/train/get_seat_layout`, {
       productCode: "WKAI",
       origin: dataDetailTrain[0].berangkat_id_station,
       destination:dataDetailTrain[0].tujuan_id_station,
       date:dataBookingTrain[0].arrivalDate,
       trainNumber:dataBookingTrain[0].trainNumber,
       token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjhkNzNtbmc4OWVkIn0.eyJpc3MiOiJodHRwczpcL1wvYXBpLmZhc3RyYXZlbC5jby5pZCIsImF1ZCI6IkZhc3RyYXZlbEIyQiBDbGllbnQiLCJqdGkiOiI4ZDczbW5nODllZCIsImlhdCI6MTY3MjE5NzI0MywibmJmIjoxNjcyMTk3MzAyLCJleHAiOjE2NzIyMDA4NDIsIm91dGxldElkIjoiRkE0MDMzMjgiLCJwaW4iOiI1MzcyMDEiLCJrZXkiOiJGQVNUUEFZIn0.nMgrQ7qFBMFcdqhABEe8B4x6T5E_Kqb7hQFoXkq-kaA"
   });

   console.log(response.data)

   if(response.data.rc === '00'){
       console.log('benar')
       setDataSeats(response.data)
   }


} 

useEffect(() =>{

   seatsFunction();

   if(dataSeats !== undefined && dataSeats.length !== 0){
       setDataSeatsLayout(setLayout(dataSeats.data[clickSeats].layout));
   }

}, [dataSeats, setDataSeatsLayout, setLayout, clickSeats]);
   
   function handlerGerbangClick(e, i){

       e.preventDefault();
       setClickSeats(i);

   }

const [pilihSeats, setPilihSeats] = useState();
console.log(dataSeats);




            {/* modals seats kai  */}

            {showModal ? (
             
                <div 
                className="justify-center mt-24 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-full my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <form>
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-solid border-slate-200 rounded-t">
                        <div className='text-slate-600 font-bold'>
                            <div className='heading'>
                                PILIH SEAT - GERBANG KE-{clickSeats + 1}
                            </div>
                            
                        </div>
                    </div>
                    {/*body*/}
                    <div className="relative -mt-4 p-8 xl:p-10 flex-auto">
                    <div classvName="">
                        <div className="grid w-full grid-cols-3">
                            {/* sidebar seats Kai */}
                            
                            <div className="sidebar mt-8">
                            {
                            
                                dataSeats !== undefined || dataSeats !== null ? 
                                dataSeats.data.map((data, i) => (
                                (
                                <>
                                { i === clickSeats ? 
                                
                                (
                                <button onClick={(e) => handlerGerbangClick(e, i)} className='mt-4 bg-blue-600 flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'>
                                    <div className='text-center'>
                                        <div className='text-xs font-bold text-white'>CLASS {data.wagonCode} {data.wagonNumber}</div>
                                    </div>
                                </button>
                                )
                                :
                                (
                                <button onClick={(e) => handlerGerbangClick(e, i)} className='mt-4  flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'>
                                    <div className='text-center'>
                                        <div className='text-xs font-bold text-slate-700'>CLASS {data.wagonCode} {data.wagonNumber}</div>
                                    </div>
                                </button>
                                )
                            
                                }
                                </>
                                )
                                 ))
                                 :
                                 (
                                <button className='mt-4  flex justify-center w-11/12 border border-black rounded-lg py-3 px-2'>
                                    <div className='text-center'>
                                        <div className='text-xs font-bold text-slate-700'>---</div>
                                    </div>
                                </button>
                                 )
                        
                            }
            
                            </div>

                            {/* seats cols and rows kereta premium  dan bisnis */}
                            <div className="overflow-y-scroll col-span-2 w-full h-[600px]">
                                {/* nama kursi  */}

                                {/* <div className="seats flex justify-around items-center">                     
                                    <div className="col-ab flex space-x-12 text-blue-500">
                                        <div className="">A</div>
                                        <div className="">B</div>
                                        <div className="">C</div>
                                    </div>
                                    <div className="col-cd flex space-x-12 text-blue-500">
                                        <div className="">C</div>
                                        <div className="">D</div>
                                        
                                    </div>
                                </div> */}

                                <div className="flex justify-around"> 

                                    {/* kiri */}

                                    <div className='flex'>
                                         
                                        {/* rows A */}

                                      <div className='flex flex-col'>

                                        {      
                                            dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                            dataSeatsLayout.map((e, i) => (
                                                <>
                                                    {e['A'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['A'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i}` + 'A')} class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['A'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                </>
                                            )) : ''
                                        }
                                            
                                     </div>                                           

                                    {/* rows B */}   
                                    
                                     <div className='flex flex-col'>

                                        {      
                                            dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                            dataSeatsLayout.map((e, i) => (
                                                <>
                                                    {e['B'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['B'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'B')} class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['B'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                </>
                                            )) : ''
                                        }
                                            
                                     </div>

                                     {/* rows C Ekonomi */}   


                                     { 
                                     
                                     dataSeats !== undefined || dataSeats !== null ? 
                                     dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                     (
                                        <div className='flex flex-col'>

                                        {      
                                            dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                            dataSeatsLayout.map((e, i) => (
                                                <>
                                                    {e['C'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['C'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'C')} class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['C'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                </>
                                            )) : ''
                                        }
                                            
                                     </div>
                                     ) : (<></>) : (<></>)}     
                                        
                                    </div>                                             
                                      
                                    
                                    {/* kanan */}

                                    <div className='flex'>
                                         
                                         {/* rows D */}

                                        <div className='flex flex-col'>

                                        {      
                                             dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                             dataSeatsLayout.map((e, i) => (
                                                 <>
                                                 {
                                                    dataSeats !== undefined || dataSeats !== null ?
                                                    dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                                    (
                                                        <>
                                                    {e['D'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['D'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'D')} class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['D'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                        </>
                                                    )
                                                    : 
                                                    
                                                    (
                                                    <>
                                                    {e['C'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['C'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value={pilihSeats} onChange={() => setPilihSeats(`${i + 1}` + 'C')} class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['C'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                    
                                                    </>
                                                    ) : (<></>)
                                                 }
                                                 </>
                                             )) : ''
                                         }
                                             
                                      </div> 

                                     {/* rows E */}   
                                     
                                      <div className='flex flex-col-reverse'>

                                         {      
                                             dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                             dataSeatsLayout.map((e, i) => (
                                                 <>
                                                 {
                                                    dataSeats !== undefined || dataSeats !== null ?
                                                    dataSeats.data[clickSeats].wagonCode === 'EKO' ? 
                                                    (
                                                        <>
                                                    {e['E'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['E'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value="" class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['E'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                        </>
                                                    )
                                                    : 
                                                    
                                                    (
                                                    <>
                                                    {e['D'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['D'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value="" class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['D'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                    
                                                    </>
                                                    ) : (<></>)
                                                 }
                                                 </>
                                             )) : ''
                                         }
                                             
                                      </div>

                                      {/* rows F */}  

                                      {

                                        dataSeats !== undefined || dataSeats !== null ? 
                                        dataSeats.data[clickSeats].wagonCode === 'EKO' ? 

                                        (

                                        <div className='flex flex-col-reverse'>

                                         {      
                                             dataSeatsLayout !== undefined && dataSeatsLayout.length !== 0 ?
                                             dataSeatsLayout.map((e, i) => (
                                                 <>
                                                    {e['F'] !== undefined ?
                                                        (
                                                            <>
                                                            {i < dataSeatsLayout.length ?                                  
                                                            (
                                                                <>
                                                                {parseInt(e['F'].isFilled) === 0 ? (

                                                                    <label class={`block py-2 pl-2  items-center cursor-pointer`}>
                                                                        <input type="checkbox" value="" class="sr-only peer" />
                                                                        <div class="w-10 text-blue-700 h-10 bg-blue-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3">{e['F'].column}</div></div>
                                                                    </label>

                                                                ) : 
                                                                
                                                                (
                                                                <>
                                                                     <label class={`block py-2 pl-2 items-center`}>
                                                                        <input type="" class="sr-only peer" />
                                                                        <div class="w-10 text-white h-10 bg-gray-700 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-lg peer dark:bg-gray-700 peer-checked:after:translate-x-full e after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300  dark:border-gray-600 peer-checked:bg-white peer-checked:border-black peer-checked:border peer-checked:text-black"><div class="py-2 px-3"> X</div></div>
                                                                    </label>                                                                   
                                                                </>
                                                                )
                                                                
                                                                }
                                                                </>
                                                            ) : (<></>)
                                                        
                                                        }
                                                            </>
                                                        )

                                                    : (<></>)   
                                                }
                                                 </>
                                             )) : ''
                                         }
                                             
                                      </div> 

                                        )

                                        : (<></>) : (<></>)

                                      }    
                                         
                                     </div>                                                                

                                </div>

                            </div>                              
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center justify-end p-6  border-solid border-slate-200 rounded-b">
                    <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                    <button
                        className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                    >
                        Konfirmasi
                    </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>

        ) : null}





        { dataSeatsLayout === null || dataSeatsLayout.length === 0 ? 
            (
        <button type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
            <div className="flex space-x-2 items-center">
            <svg aria-hidden="true" class="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <div class="">TUNGGU...</div>
            </div>
        </button>
        ) : 
        
        (
        <button onClick={() => setShowModal(true)}  type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
            <div className="flex space-x-2 items-center">
                <div className="text-white text-md font-bold">PILIH KURSIS</div>
            </div>
        </button>
        )
}