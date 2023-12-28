const fs = require('fs');
const utils = require("./utils")

const parseDate = () => {
    const tanggal  = new Date();
    const dt = tanggal.getFullYear() + '-' + addLeadingZero(parseInt(tanggal.getMonth())) + 1 + '-' + addLeadingZero(parseInt(tanggal.getDate()));
    return dt;
}

function tanggalParse(x){
    var date = new Date(x);
    var tahun = date.getFullYear();
    var bulan = date.getMonth();
    var hari = date.getDay();
    var tanggal = date.getDate();

    switch(hari) {
        case 0: hari = "Minggu"; break;
        case 1: hari = "Senin"; break;
        case 2: hari = "Selasa"; break;
        case 3: hari = "Rabu"; break;
        case 4: hari = "Kamis"; break;
        case 5: hari = "Jum'at"; break;
        case 6: hari = "Sabtu"; break;
     }

     switch(bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
       }

     const result = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
     return result
}

function addLeadingZero(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return '' + num;
    }
  }

const Writemessage = async (method, url, rc, paths, msg='', token='') =>   {
  
    let nows = new Date();
        nows = parseDate(nows);

    if(method == 'REQ'){
        const msg = method + '|' + nows + '|' + url + '|' + rc + '|' + '\t';
        fs.appendFile(paths, msg, (error) => {
            if (error) throw error;
            console.log(method + ':' + nows + '->' + url + '|' + JSON.stringify(rc));
          });
    }else{
      
        // const outlet = await utils.getIdOutlet(token);
        // let usr = outlet;

        let messages = '';
        if(rc !== '00'){
            messages = '-->' + '\t\t' + '|' + method + '|' + nows + '|' + url + '|' + rc + '|' + msg + '|' +'\n';
            console.log(method + ':' + '|' + nows + '->' + url + '|' + JSON.stringify(rc) + '|' + msg + '|');

          }else{
          messages = '-->' + '\t\t' + '|' + method + '|' + nows + '|' + url + '|' + rc + '|' + 'SUKSES' + '|' +'\n';
          console.log(method + ':' + nows + '->' + url + '|' + JSON.stringify(rc) + '|' + 'SUKSES' + '|');
        }

        fs.appendFile(paths, messages, (error) => {
          if (error) throw error;
        });
      }


}

module.exports = {
    Writemessage,
    tanggalParse
}