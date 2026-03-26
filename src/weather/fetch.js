import https from "https";

const HKO_BASE = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";

export function fetchWeather(lang) {
  const url = `${HKO_BASE}?dataType=fnd&lang=${lang}`;
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
