const SHEET_ID = '15up7MfmXnTcZgBCRttnhjFAdHafUetK8OfECLXIqKcE';
const SIGN_SHEET = 'TramSignLocation';
const SCHEDULE_SHEET = 'TramSchedule';
const HOLIDAY_API = `https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/TH`;

const getSheetData = async (sheetName) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  const rows = json.table.rows;
  return rows.map(r => r.c.map(c => c?.v));
};

const isTodayHoliday = async () => {
  try {
    const res = await fetch(HOLIDAY_API);
    const holidays = await res.json();
    const todayStr = new Date().toISOString().slice(0, 10);
    return holidays.some(h => h.date === todayStr);
  } catch (e) {
    console.warn("⚠️ ไม่สามารถโหลดวันหยุดได้:", e);
    return false; // fallback เป็นวันธรรมดา
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
  const nowTime = today.getHours() * 60 + today.getMinutes();

  let dayText = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][today.getDay()];
  if (await isTodayHoliday()) {
    dayText = "sunday"; // ใช้เวลาวันหยุดเหมือนวันอาทิตย์
  }

  const signList = signs.map(r => {
    const name = r[0];
    const lat = r[1];
    const lng = r[2];
    const distance = haversine(userLat, userLng, lat, lng);

    // หาเวลาเที่ยวถัดไป
    const matched = schedule.filter(s =>
      s[0] === name &&
      s[2].toLowerCase() === dayText
    );

    let nextTime = null;
    matched.forEach(r => {
      const times = r[3].split(',').map(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      }).filter(t => t > nowTime);
      if (times.length && (nextTime === null || times[0] < nextTime)) {
        nextTime = times[0];
      }
    });

    let timeText = '';
    if (nextTime !== null) {
      const h = String(Math.floor(nextTime / 60)).padStart(2, '0');
      const m = String(nextTime % 60).padStart(2, '0');
      timeText = `🕒 ${h}:${m}`;
    } else {
      timeText = "📅 วันนี้หมดรอบแล้ว รอรอบพรุ่งนี้";
    }

    return { name, lat, lng, distance, timeText };
  }).sort((a, b) => a.distance - b.distance);

  const container = document.getElementById("signs");
  container.innerHTML = signList.map(s => `
    <div class="sign">
      <b>${s.name}</b> <br>
      📍 ${s.distance.toFixed(2)} กม. <br>
      ${s.timeText}
    </div>
  `).join('');

  document.getElementById("loader").style.display = "none";
  container.style.display = "block";
});
