// import React, { useState, useEffect } from 'react';
// import { Message, useToaster, ButtonToolbar, SelectPicker, Button } from 'rsuite';

// export const Timer = () => {

//   const [timeLeft, setTimeLeft] = useState(90);
//   const [isExpired, setIsExpired] = useState(false);
//   const [placement, setPlacement] = React.useState('topCenter');
//   const toaster = useToaster();
//   const [type, setType] = React.useState('info');

//   useEffect(() => {
//     const storedTime = localStorage.getItem('timeLeft');
//     if (storedTime) {
//       setTimeLeft(Number(storedTime));
//     } else {
//       localStorage.setItem('timeLeft', timeLeft);
//     }

//     const intervalId = setInterval(() => {
//       setTimeLeft(prevTime => {
//         localStorage.setItem('timeLeft', prevTime - 1);
//         if (prevTime === 1) {
//           setIsExpired(true);
//           clearInterval(intervalId);
//           localStorage.removeItem('timeLeft');
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <>
//     <div className='flex justify-center '>
//     {!isExpired ? (
//         <Message  showIcon type={type}>
//             waktu pembayaran sisa {30 + (Math.floor(timeLeft / 60) + 30)} menit { 60 + timeLeft % 60}
//         </Message>
//         ) : (
//             <>waktu booking sudah habis!</>
//         )}
//     </div>
//     </>
//   );
// };