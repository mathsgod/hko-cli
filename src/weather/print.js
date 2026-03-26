const PSR_EMOJI = {
  Low: "🟢", 低: "🟢",
  "Medium Low": "🟡", 中低: "🟡",
  Medium: "🟠", 中: "🟠",
  "Medium High": "🔴", 中高: "🔴",
  High: "⛈️", 高: "⛈️",
};

export function printForecast(data) {
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
