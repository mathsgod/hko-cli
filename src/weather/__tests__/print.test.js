import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printForecast } from "../print.js";

const baseForecast = {
  updateTime: "2024-03-26T12:00:00+08:00",
  generalSituation: "Fine weather expected.",
  weatherForecast: [
    {
      forecastDate: "20240326",
      week: "Tuesday",
      forecastWeather: "Sunny intervals",
      forecastMintemp: { value: 18 },
      forecastMaxtemp: { value: 24 },
      PSR: "Medium",
    },
  ],
};

describe("printForecast", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const getOutput = () => consoleSpy.mock.calls.map((c) => c[0]).join("\n");

  it("formats forecastDate from YYYYMMDD to YYYY-MM-DD", () => {
    printForecast(baseForecast);
    expect(getOutput()).toContain("2024-03-26");
  });

  it("abbreviates week day to 3 characters", () => {
    printForecast(baseForecast);
    expect(getOutput()).toContain("Tue");
  });

  it("shows temperature range", () => {
    printForecast(baseForecast);
    expect(getOutput()).toContain("18~24°C");
  });

  it("shows general situation", () => {
    printForecast(baseForecast);
    expect(getOutput()).toContain("Fine weather expected.");
  });

  it("truncates weather description longer than 30 characters", () => {
    const longDesc = "A very long weather description that exceeds thirty chars";
    const data = {
      ...baseForecast,
      weatherForecast: [{ ...baseForecast.weatherForecast[0], forecastWeather: longDesc }],
    };
    printForecast(data);
    // slice(0, 29) + "…" → 29 chars then ellipsis
    expect(getOutput()).toContain("A very long weather descripti…");
    expect(getOutput()).not.toContain("that exceeds");
  });

  it("does not truncate weather description of exactly 30 characters", () => {
    const thirtyChars = "A".repeat(30);
    const data = {
      ...baseForecast,
      weatherForecast: [{ ...baseForecast.weatherForecast[0], forecastWeather: thirtyChars }],
    };
    printForecast(data);
    expect(getOutput()).toContain(thirtyChars);
    expect(getOutput()).not.toContain("…");
  });

  it.each([
    ["Low", "🟢"],
    ["Medium Low", "🟡"],
    ["Medium", "🟠"],
    ["Medium High", "🔴"],
    ["High", "⛈️"],
    ["低", "🟢"],
    ["中低", "🟡"],
    ["中", "🟠"],
    ["中高", "🔴"],
    ["高", "⛈️"],
    ["Unknown", "❓"],
  ])('maps PSR "%s" to emoji "%s"', (psr, emoji) => {
    const data = {
      ...baseForecast,
      weatherForecast: [{ ...baseForecast.weatherForecast[0], PSR: psr }],
    };
    printForecast(data);
    expect(getOutput()).toContain(emoji);
  });

  it("shows sea temperature when present", () => {
    const data = { ...baseForecast, seaTemp: { place: "North Point", value: 21 } };
    printForecast(data);
    expect(getOutput()).toContain("North Point");
    expect(getOutput()).toContain("21°C");
  });

  it("hides sea temperature section when absent", () => {
    printForecast(baseForecast);
    expect(getOutput()).not.toContain("Sea Temp");
  });
});
