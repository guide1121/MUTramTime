const SHEET_ID = '15up7MfmXnTcZgBCRttnhjFAdHafUetK8OfECLXIqKcE';
const SIGN_SHEET = 'TramSignLocation';
const SCHEDULE_SHEET = 'TramSchedule';
const GOOGLE_API_KEY = 'AIzaSyAXmkbAUG0ByaG_IyM7H_8gqyTqi9KWYd0';
const CALENDAR_ID = 'th.th%23holiday%40group.v.calendar.google.com';
const year = new Date().getFullYear();
const HOLIDAY_API = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_API_KEY}&timeMin=${year}-01-01T00:00:00Z&timeMax=${year}-12-31T23:59:59Z`;


const getSheetData = async (sheetName) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  const rows = json.table.rows;
  return rows.map(r => r.c.map(c => c?.v));
};
function getDayGroup(date) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) return "weekend";
    return "weekday";
  }
  
  const isTodayHoliday = async () => {
    try {
      const res = await fetch(HOLIDAY_API);
      const json = await res.json();
      const todayStr = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  
      return Array.isArray(json.items) && json.items.some(event => event.start?.date === todayStr);

    } catch (e) {
      console.warn("⚠️ ไม่สามารถโหลดวันหยุดจาก Google Calendar:", e);
      return false;
    }
  };
  

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

navigator.geolocation.getCurrentPosition(async pos => {
  const userLat = pos.coords.latitude;
  const userLng = pos.coords.longitude;

  const [signs, schedule] = await Promise.all([
    getSheetData(SIGN_SHEET),
    getSheetData(SCHEDULE_SHEET)
  ]);

  const today = new Date();

// ✅ จำลองเวลา 10:00
// const nowTime = 10 * 60;
const nowTime = today.getHours() * 60 + today.getMinutes();

// ✅ log เวลาเพื่อดูใน console
const hh = String(Math.floor(nowTime / 60)).padStart(2, '0');
const mm = String(nowTime % 60).padStart(2, '0');
console.log(`⏰ เวลาปัจจุบัน (จำลอง): ${hh}:${mm} (${nowTime} นาที)`);


let dayText = getDayGroup(today);

// ถ้าวันนี้เป็นวันหยุด ให้ใช้ weekend แทน (override)
if (await isTodayHoliday()) {
  dayText = "weekend";
}

console.log("📅 dayText ที่ใช้งาน:", dayText);


  const signList = signs.map(r => {
    const name = r[0];
    const lat = r[1];
    const lng = r[2];
    const distance = haversine(userLat, userLng, lat, lng);
    return { name, lat, lng, distance };
  }).sort((a, b) => a.distance - b.distance);

  const container = document.getElementById("signs");
  container.innerHTML = '';
  signList.forEach(s => {
    const div = document.createElement('div');
    div.className = 'sign';
    div.innerHTML = `<b>${s.name}</b><br> 📍ห่างจากคุณ ${s.distance.toFixed(2)} กม.`;
    div.addEventListener('click', () => {
      showPopupForSign(s.name, schedule, nowTime, dayText);
    });
    container.appendChild(div);
  });

  document.getElementById("loader").style.display = "none";
  container.style.display = "block";
});

const showPopupForSign = (signName, schedule, nowTime, dayText) => {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupBody = document.getElementById("popup-body");

  popupTitle.textContent = `🚏 ${signName}`;
  const routes = {};

  schedule.forEach(row => {
    const [sign, line, day, rawTimes] = row;
    if (sign === signName && day.toLowerCase() === dayText) {
      if (!routes[line]) routes[line] = [];

      console.log(`🛤️ ตรวจสอบสาย ${line} @ ${signName}`);
      console.log("⏰ ข้อมูลรอบเวลา:", rawTimes);

      rawTimes.split(',').forEach(t => {
        const [h, m] = t.split(':').map(Number);
        const totalMin = h * 60 + m;

        console.log(`⏱️ เวลา: ${t} (${totalMin} นาที) | ตอนนี้: ${nowTime}`);

        if (totalMin > nowTime) {
          routes[line].push(totalMin);
        }
      });
    }
  });

  for (let line in routes) {
    routes[line].sort((a, b) => a - b);
  }

  const sortedLines = Object.entries(routes).sort((a, b) => a[1][0] - b[1][0]);

  if (sortedLines.length === 0) {
    popupBody.innerHTML = "<p>📅 วันนี้หมดรอบแล้ว หรือรอรอบพรุ่งนี้</p>";
  } else {
    popupBody.innerHTML = sortedLines.map(([line, times]) => {
        let content = `<div><b>🚍 สาย ${line} (รอบรถถัดไป)</b><br>`;
        if (times.length === 0) {
          content += `⛔ ไม่มีรอบแล้ววันนี้`;
        } else {
          content += times.slice(0, 5).map(min => {
            const h = String(Math.floor(min / 60)).padStart(2, '0');
            const m = String(min % 60).padStart(2, '0');
            return `🕒 ${h}:${m}`;
          }).join('<br>');
        }
        content += `</div><br>`;
        return content;
      }).join('');
  }

  console.log(`✅ เปิด PopUp สำหรับป้าย: ${signName}`);
  popup.style.display = "flex";
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("popup-close").onclick = () => {
    document.getElementById("popup").style.display = "none";
  };
});


  
  
  

