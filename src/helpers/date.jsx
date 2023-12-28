//parseTanggal Pembayaran Pelni.
export const parseTanggal = (d) => {
  var date = new Date(d);
  var tahun = date.getFullYear();
  var bulan = date.getMonth();
  var hari = date.getDay();
  var tanggal = date.getDate();

  switch (hari) {
    case 0:
      hari = "Minggu";
      break;
    case 1:
      hari = "Senin";
      break;
    case 2:
      hari = "Selasa";
      break;
    case 3:
      hari = "Rabu";
      break;
    case 4:
      hari = "Kamis";
      break;
    case 5:
      hari = "Jum'at";
      break;
    case 6:
      hari = "Sabtu";
      break;
  }

  switch (bulan) {
    case 0:
      bulan = "Januari";
      break;
    case 1:
      bulan = "Februari";
      break;
    case 2:
      bulan = "Maret";
      break;
    case 3:
      bulan = "April";
      break;
    case 4:
      bulan = "Mei";
      break;
    case 5:
      bulan = "Juni";
      break;
    case 6:
      bulan = "Juli";
      break;
    case 7:
      bulan = "Agustus";
      break;
    case 8:
      bulan = "September";
      break;
    case 9:
      bulan = "Oktober";
      break;
    case 10:
      bulan = "November";
      break;
    case 11:
      bulan = "Desember";
      break;
  }

  const tanggal_keberangkatan = `${hari}, ${tanggal} ${bulan} ${tahun}`;
  return tanggal_keberangkatan;
};

export const parseTanggalPelni = (d) => {
  var date = new Date(d);
  var tahun = date.getFullYear();
  var bulan = date.getMonth();
  var hari = date.getDay();
  var tanggal = date.getDate();

  switch (hari) {
    case 0:
      hari = "Min";
      break;
    case 1:
      hari = "Sen";
      break;
    case 2:
      hari = "Sel";
      break;
    case 3:
      hari = "Rab";
      break;
    case 4:
      hari = "Kam";
      break;
    case 5:
      hari = "Jum";
      break;
    case 6:
      hari = "Sab";
      break;
  }

  switch (bulan) {
    case 0:
      bulan = "Jan";
      break;
    case 1:
      bulan = "Feb";
      break;
    case 2:
      bulan = "Mar";
      break;
    case 3:
      bulan = "Apr";
      break;
    case 4:
      bulan = "Mei";
      break;
    case 5:
      bulan = "Jun";
      break;
    case 6:
      bulan = "Jul";
      break;
    case 7:
      bulan = "Aug";
      break;
    case 8:
      bulan = "Sep";
      break;
    case 9:
      bulan = "Okt";
      break;
    case 10:
      bulan = "Nov";
      break;
    case 11:
      bulan = "Des";
      break;
  }

  const tanggal_keberangkatan = `${hari}, ${tanggal} ${bulan} ${tahun}`;
  return tanggal_keberangkatan;
};

export const parseDate = (x) => {
  var datee = new Date(x);
  var bulan = datee.getMonth();
  var hari = datee.getDay();
  var tanggal = datee.getDate();

  switch (hari) {
    case 0:
      hari = "Minggu";
      break;
    case 1:
      hari = "Senin";
      break;
    case 2:
      hari = "Selasa";
      break;
    case 3:
      hari = "Rabu";
      break;
    case 4:
      hari = "Kamis";
      break;
    case 5:
      hari = "Jum'at";
      break;
    case 6:
      hari = "Sabtu";
      break;
  }

  switch (bulan) {
    case 0:
      bulan = "Jan";
      break;
    case 1:
      bulan = "Feb";
      break;
    case 2:
      bulan = "Mar";
      break;
    case 3:
      bulan = "Apr";
      break;
    case 4:
      bulan = "Mei";
      break;
    case 5:
      bulan = "Jun";
      break;
    case 6:
      bulan = "Jul";
      break;
    case 7:
      bulan = "Augs";
      break;
    case 8:
      bulan = "Sept";
      break;
    case 9:
      bulan = "Okt";
      break;
    case 10:
      bulan = "Nov";
      break;
    case 11:
      bulan = "Des";
      break;
  }

  const tanggalbozqu = tanggal + " " + bulan + " ";

  return tanggalbozqu;
};

export const remainingTime = (targetDate) => {
  let currentDate = new Date();
  let timeDifference = new Date(targetDate) - currentDate;

  let hours = Math.floor(timeDifference / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Tambahkan padding 0 jika hours, minutes, atau seconds < 10
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours === 0) {
    if (minutes === 0) {
      return ` ${formattedSeconds} detik`;
    } else {
      return ` ${formattedMinutes} menit ${formattedSeconds} detik`;
    }
  } else {
    return ` ${formattedHours} jam ${formattedMinutes} menit ${formattedSeconds} detik`;
  }
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${addLeadingZero(
    currentDate.getMonth() + 1
  )}-${addLeadingZero(currentDate.getDate())}`;
};

function addLeadingZero(num) {
  return num < 10 ? `0${num}` : num;
}
