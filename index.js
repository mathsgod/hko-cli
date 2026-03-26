#!/usr/bin/env node

import { program } from "commander";
import { fetchWeather, printForecast, fetchLocal, printLocal, fetchCurrent, printCurrent } from "./src/weather/index.js";

program
  .name("hko")
  .description("Hong Kong Observatory CLI")
  .version("1.0.0");

program
  .command("weather")
  .description("Show 9-day weather forecast")
  .option("-l, --lang <lang>", "Language: en, tc or sc", "en")
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

program
  .command("local")
  .description("Show local weather forecast")
  .option("-l, --lang <lang>", "Language: en, tc or sc", "en")
  .option("-j, --json", "Output raw JSON")
  .action(async (opts) => {
    try {
      const data = await fetchLocal(opts.lang);
      if (opts.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        printLocal(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch local forecast:", err.message);
      process.exit(1);
    }
  });

program
  .command("current")
  .description("Show current weather report")
  .option("-l, --lang <lang>", "Language: en, tc or sc", "en")
  .option("-j, --json", "Output raw JSON")
  .action(async (opts) => {
    try {
      const data = await fetchCurrent(opts.lang);
      if (opts.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        printCurrent(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch current weather:", err.message);
      process.exit(1);
    }
  });

program.parse();
