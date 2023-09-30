
//duration full for sending to params
export const durationFull = (tanggal1, tanggal2, time1, time2) => {
    const date1 = new Date(
      `${tanggal1.slice(0, 4)}-${tanggal1.slice(4, 6)}-${tanggal1.slice(
        6,
        8
      )}T${time1.slice(0, 2)}:${time1.slice(2)}:00`
    );
    const date2 = new Date(
      `${tanggal2.slice(0, 4)}-${tanggal2.slice(4, 6)}-${tanggal2.slice(
        6,
        8
      )}T${time2.slice(0, 2)}:${time2.slice(2)}:00`
    );

    if (isNaN(date1) || isNaN(date2)) {
      return "Invalid date or time";
    }

    const selisihMilidetik = Math.abs(date2 - date1);

    const hari = Math.floor(selisihMilidetik / (1000 * 60 * 60 * 24));
    const sisaMilidetik = selisihMilidetik % (1000 * 60 * 60 * 24);

    const jam = Math.floor(sisaMilidetik / (1000 * 60 * 60));
    const sisaMilidetikJam = sisaMilidetik % (1000 * 60 * 60);
    const menit = Math.floor(sisaMilidetikJam / (1000 * 60));

    let hasil = "";
    if (hari > 0) {
      hasil += `${hari} Hari `;
    }
    if (jam > 0) {
      hasil += `${jam < 10 ? "0" : ""}${jam} Jam `;
    }
    if (menit > 0) {
      hasil += `${menit < 10 ? "0" : ""}${menit} Menit`;
    }
    if (hari === 0 && jam === 0 && menit === 0) {
      hasil = "0 Menit";
    }

    return hasil;
}


//duration for showing UI
export const duration = (tanggal1, tanggal2, time1, time2) => {
    const date1 = new Date(
      `${tanggal1.slice(0, 4)}-${tanggal1.slice(4, 6)}-${tanggal1.slice(
        6,
        8
      )}T${time1.slice(0, 2)}:${time1.slice(2)}:00`
    );
    const date2 = new Date(
      `${tanggal2.slice(0, 4)}-${tanggal2.slice(4, 6)}-${tanggal2.slice(
        6,
        8
      )}T${time2.slice(0, 2)}:${time2.slice(2)}:00`
    );

    if (isNaN(date1) || isNaN(date2)) {
      return "Invalid date or time";
    }

    const selisihMilidetik = Math.abs(date2 - date1);

    const hari = Math.floor(selisihMilidetik / (1000 * 60 * 60 * 24));
    const sisaMilidetik = selisihMilidetik % (1000 * 60 * 60 * 24);

    const jam = Math.floor(sisaMilidetik / (1000 * 60 * 60));
    const sisaMilidetikJam = sisaMilidetik % (1000 * 60 * 60);
    const menit = Math.floor(sisaMilidetikJam / (1000 * 60));

    let hasil = "";
    if (hari > 0) {
      hasil += `${hari}h `;
    }
    if (jam > 0) {
      hasil += `${jam < 10 ? "0" : ""}${jam}j `;
    }
    if (menit > 0) {
      hasil += `${menit < 10 ? "0" : ""}${menit}m`;
    }
    if (hari === 0 && jam === 0 && menit === 0) {
      hasil = "0m";
    }

    return hasil;
  }


