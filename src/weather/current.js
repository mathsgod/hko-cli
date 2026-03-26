import https from "https";

const HKO_BASE = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";

export function fetchCurrent(lang) {
  const url = `${HKO_BASE}?dataType=rhrread&lang=${lang}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

const UV_DESC = {
  low: "🟢 Low", moderate: "🟡 Moderate", high: "🟠 High",
  "very high": "🔴 Very High", extreme: "⛈️  Extreme",
};

export function printCurrent(data) {
  const updated = new Date(data.updateTime).toLocaleString("en-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.log("\n🌡  HKO Current Weather Report");
  console.log(`📅  Updated: ${updated}\n`);

  if (data.warningMessage) {
    console.log(`⚠️   Warning: ${data.warningMessage}\n`);
  }

  if (data.tcmessage) {
    console.log(`🌀  ${data.tcmessage}\n`);
  }

  // Temperature
  const tempTime = new Date(data.temperature.recordTime).toLocaleTimeString("en-HK", {
    timeZone: "Asia/Hong_Kong", timeStyle: "short",
  });
  console.log(`🌡  Temperature (as of ${tempTime})`);
  console.log("─".repeat(52));
  for (const t of data.temperature.data) {
    console.log(`    ${t.place.padEnd(34)} ${t.value}°C`);
  }
  console.log();

  // Humidity
  const humTime = new Date(data.humidity.recordTime).toLocaleTimeString("en-HK", {
    timeZone: "Asia/Hong_Kong", timeStyle: "short",
  });
  console.log(`💧  Humidity (as of ${humTime})`);
  console.log("─".repeat(52));
  for (const h of data.humidity.data) {
    console.log(`    ${h.place.padEnd(34)} ${h.value}%`);
  }
  console.log();

  // UV Index
  if (data.uvindex?.data?.length) {
    console.log(`☀️   UV Index`);
    console.log("─".repeat(52));
    for (const u of data.uvindex.data) {
      const desc = UV_DESC[u.desc?.toLowerCase()] ?? u.desc;
      console.log(`    ${u.place.padEnd(34)} ${u.value}  ${desc}`);
    }
    if (data.uvindex.recordDesc) {
      console.log(`    (${data.uvindex.recordDesc})`);
    }
    console.log();
  }

  // Rainfall
  const hasRain = data.rainfall.data.some((r) => r.max > 0);
  const rfStart = new Date(data.rainfall.startTime).toLocaleTimeString("en-HK", {
    timeZone: "Asia/Hong_Kong", timeStyle: "short",
  });
  const rfEnd = new Date(data.rainfall.endTime).toLocaleTimeString("en-HK", {
    timeZone: "Asia/Hong_Kong", timeStyle: "short",
  });
  console.log(`🌧  Rainfall ${rfStart}–${rfEnd}`);
  console.log("─".repeat(52));
  if (!hasRain) {
    console.log("    No rainfall recorded across all districts.");
  } else {
    for (const r of data.rainfall.data) {
      if (r.max > 0) {
        console.log(`    ${r.place.padEnd(34)} ${r.max} ${r.unit}`);
      }
    }
  }
  console.log();
}
