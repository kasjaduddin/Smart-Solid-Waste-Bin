var localTime = new Date();
export var year = localTime.getFullYear().toString();
export var month = (localTime.getMonth() + 1);
export var day = (localTime.getDay() + 1);
export var date = localTime.getDate().toString();
export var hour = localTime.getHours().toString();
export var minute = localTime.getMinutes().toString();
export var second = localTime.getSeconds().toString();
// var maxHeight = 60;
// // var maxWeight = 1000;
// var statusBedge = `<span class="badge text-bg-success">Belum Terisi</span>`;

export function strMonth() {
    switch(month) {
        case 1:
          return "Januari";
        case 2:
          return "Februari";
        case 3:
            return "Maret";
        case 4:
          return "April";
        case 5:
          return "Mei";
        case 6:
            return "Juni";
        case 7:
          return "Juli";
        case 8:
          return "Agustus";
        case 9:
            return "September";
        case 10:
          return "Oktober";
        case 11:
          return "November";
        case 12:
            return "Desember";
        default:
          console("Error");
      }
}

export function strDay() {
    switch(day) {
        case 1:
          return "Ahad";
        case 2:
          return "Senin";
        case 3:
            return "Selasa";
        case 4:
          return "Rabu";
        case 5:
          return "Kamis";
        case 6:
            return "Jumat";
        case 7:
          return "Sabtu";
        default:
          console("Error");
      }
}

// Time.innerHTML = `<p class="text-secondary fw-semibold pb-0 mb-0">${strDay() + ", " + date + " " + strMonth() + " " + year + " " + hour + ":" + minute + ":" + second}</p>`;

