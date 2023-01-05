import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Konfirmasi(){

    const dataBookingTrain = JSON.parse(localStorage.getItem(trainNumber + "_booking"));
    const dataDetailTrain = JSON.parse(localStorage.getItem(trainNumber + "_detailTrain"));

    const [clickSeats, setClickSeats] = useState(0);
    const [cekKursi, setCekKursi] = useState();
    const {trainNumber} = useParams();

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

    return(
        <>

        </>
    )
}