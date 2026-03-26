import https from "https";

const HKO_BASE = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";

export function fetchLocal(lang) {
  const url = `${HKO_BASE}?dataType=flw&lang=${lang}`;
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

export function printLocal(data) {
  const updated = new Date(data.updateTime).toLocaleString("en-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.log("\n🌦  HKO Local Weather Forecast");
  console.log(`📅  Updated: ${updated}\n`);

  console.log(`📋  General Situation`);
  console.log(`    ${data.generalSituation}\n`);

  console.log(`🕐  ${data.forecastPeriod}`);
  console.log(`    ${data.forecastDesc}\n`);

  if (data.outlook) {
    console.log(`🔭  Outlook`);
    console.log(`    ${data.outlook}\n`);
  }

  if (data.tcInfo) {
    console.log(`🌀  Tropical Cyclone`);
    console.log(`    ${data.tcInfo}\n`);
  }

  if (data.fireDangerWarning) {
    console.log(`🔥  Fire Danger Warning`);
    console.log(`    ${data.fireDangerWarning}\n`);
  }
}
