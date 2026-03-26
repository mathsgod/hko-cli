#!/usr/bin/env node

import { program } from "commander";
import https from "https";

const HKO_BASE = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";

const PSR_EMOJI = {
  Low: "🟢", 低: "🟢",
  "Medium Low": "🟡", 中低: "🟡",
  Medium: "🟠", 中: "🟠",
  "Medium High": "🔴", 中高: "🔴",
  High: "⛈️", 高: "⛈️",
};

const WIND_DIRECTION = {
  North: "N", South: "S", East: "E", West: "W",
  "North to northeast": "N~NE", "East to southeast": "E~SE",
  "South to southeast": "S~SE", "South to southwest": "S~SW",
};

function fetchWeather(lang) {
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

function printForecast(data) {
  const updated = new Date(data.updateTime).toLocaleString("en-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.log("\n🌤  HKO 9-Day Weather Forecast");
  console.log(`📅  Updated: ${updated}\n`);
  console.log(`📋  ${data.generalSituation}\n`);
  console.log("─".repeat(72));
  console.log(
    `${"Date".padEnd(12)}${"Day".padEnd(10)}${"Weather".padEnd(32)}${"Temp".padEnd(10)}Rain`
  );
  console.log("─".repeat(72));

  for (const f of data.weatherForecast) {
    const date = `${f.forecastDate.slice(0, 4)}-${f.forecastDate.slice(4, 6)}-${f.forecastDate.slice(6, 8)}`;
    const day = f.week.slice(0, 3);
    const weather = f.forecastWeather.length > 30
      ? f.forecastWeather.slice(0, 29) + "…"
      : f.forecastWeather;
    const temp = `${f.forecastMintemp.value}~${f.forecastMaxtemp.value}°C`;
    const psr = PSR_EMOJI[f.PSR] ?? "❓";

    console.log(
      `${date.padEnd(12)}${day.padEnd(10)}${weather.padEnd(32)}${temp.padEnd(10)}${psr} ${f.PSR}`
    );
  }

  console.log("─".repeat(72));

  if (data.seaTemp) {
    console.log(`\n🌊  Sea Temp (${data.seaTemp.place}): ${data.seaTemp.value}°C`);
  }
  console.log();
}

program
  .name("hko")
  .description("Hong Kong Observatory CLI")
  .version("1.0.0");

program
  .command("weather")
  .description("Show 9-day weather forecast")
  .option("-l, --lang <lang>", "Language: en or tc", "en")
  .option("-j, --json", "Output raw JSON")
  .action(async (opts) => {
    try {
      const data = await fetchWeather(opts.lang);
      if (opts.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        printForecast(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch forecast:", err.message);
      process.exit(1);
    }
  });

program.parse();
