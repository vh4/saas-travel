const fs = require('fs')
const path = require('path');


//for booki

const folderkai ='./log/kai';
const folderpesawat = './log/pesawat';
const folderpelni = './log/pelni';

//for login

const auth ='./log/auth';
const folderbook ='./log/booking';
const foldertransaksi ='./log/transaksi';

var dir = './log';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.stat(folderkai, function (err, stat) {
    if(err){
        if (err.code === 'ENOENT') {

            //folder
            fs.mkdir(folderkai, {recursive: true}, (err) => {
                if (err) throw err;
            });

            fs.mkdir(folderpesawat, {recursive: true}, (err) => {
                if (err) throw err;
            });

            fs.mkdir(folderpelni, {recursive: true}, (err) => {
                if (err) throw err;
            });

            fs.mkdir(auth, {recursive: true}, (err) => {
                if (err) throw err;
            });

            fs.mkdir(folderbook, {recursive: true}, (err) => {
                if (err) throw err;
            });

            fs.mkdir(foldertransaksi, {recursive: true}, (err) => {
                if (err) throw err;
            });
            
            //file pesawat

            fs.writeFile(folderpesawat + '/search.txt', '', (err) => {
                if (err) throw err;
                console.log('File search.txt telah dibuat.');
            });
            fs.writeFile(folderpesawat + '/booking.txt', '', (err) => {
                if (err) throw err;
                console.log('File booking.txt telah dibuat.');
            });
            fs.writeFile(folderpesawat + '/fare.txt', '', (err) => {
                if (err) throw err;
                console.log('File fare.txt telah dibuat.');
            });
            fs.writeFile(folderpesawat + '/payment.txt', '', (err) => {
                if (err) throw err;
                console.log('File payment.txt telah dibuat.');
            });

            //file kai
            fs.writeFile(folderkai + '/search.txt', '', (err) => {
                if (err) throw err;
                console.log('File search.txt telah dibuat.');
            });
            fs.writeFile(folderkai + '/booking.txt', '', (err) => {
                if (err) throw err;
                console.log('File booking.txt telah dibuat.');
            });
            fs.writeFile(folderkai + '/fare.txt', '', (err) => {
                if (err) throw err;
                console.log('File fare.txt telah dibuat.');
            });
            fs.writeFile(folderkai + '/payment.txt', '', (err) => {
                if (err) throw err;
                console.log('File payment.txt telah dibuat.');
            });

            //file pelni
            fs.writeFile(folderpelni + '/search.txt', '', (err) => {
                if (err) throw err;
                console.log('File search.txt telah dibuat.');
            });
            fs.writeFile(folderpelni + '/booking.txt', '', (err) => {
                if (err) throw err;
                console.log('File booking.txt telah dibuat.');
            });
            fs.writeFile(folderpelni + '/fare.txt', '', (err) => {
                if (err) throw err;
                console.log('File fare.txt telah dibuat.');
            });
            fs.writeFile(folderpelni + '/payment.txt', '', (err) => {
                if (err) throw err;
                console.log('File payment.txt telah dibuat.');
            });

            } else {
                console.error('Error checking folder:', err);
            }
    }else{
        console.log('folder is exist');
    }
})    
