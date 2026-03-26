import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printCurrent } from "../current.js";

const baseData = {
  updateTime: "2024-03-26T12:00:00+08:00",
  temperature: {
    recordTime: "2024-03-26T12:00:00+08:00",
    data: [{ place: "Hong Kong Observatory", value: 22 }],
  },
  humidity: {
    recordTime: "2024-03-26T12:00:00+08:00",
    data: [{ place: "Hong Kong Observatory", value: 75 }],
  },
  rainfall: {
    startTime: "2024-03-26T11:00:00+08:00",
    endTime: "2024-03-26T12:00:00+08:00",
    data: [{ place: "Central & Western", max: 0, unit: "mm" }],
  },
};

describe("printCurrent", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const getOutput = () => consoleSpy.mock.calls.map((c) => c[0]).join("\n");

  it("shows temperature readings", () => {
    printCurrent(baseData);
    expect(getOutput()).toContain("Hong Kong Observatory");
    expect(getOutput()).toContain("22°C");
  });

  it("shows humidity readings", () => {
    printCurrent(baseData);
    expect(getOutput()).toContain("75%");
  });

  it('shows "No rainfall" message when all districts have max = 0', () => {
    printCurrent(baseData);
    expect(getOutput()).toContain("No rainfall recorded across all districts.");
  });

  it("shows only districts with rainfall when max > 0", () => {
    const data = {
      ...baseData,
      rainfall: {
        ...baseData.rainfall,
        data: [
          { place: "Central & Western", max: 0, unit: "mm" },
          { place: "Eastern", max: 5.2, unit: "mm" },
        ],
      },
    };
    printCurrent(data);
    expect(getOutput()).toContain("Eastern");
    expect(getOutput()).toContain("5.2 mm");
    expect(getOutput()).not.toContain("Central & Western");
  });

  it.each([
    ["low", "🟢 Low"],
    ["moderate", "🟡 Moderate"],
    ["high", "🟠 High"],
    ["very high", "🔴 Very High"],
    ["extreme", "⛈️  Extreme"],
  ])('maps UV desc "%s" to "%s"', (desc, expected) => {
    const data = {
      ...baseData,
      uvindex: { data: [{ place: "King's Park", value: 5, desc }] },
    };
    printCurrent(data);
    expect(getOutput()).toContain(expected);
  });

  it("shows raw UV desc when value is not in the mapping", () => {
    const data = {
      ...baseData,
      uvindex: { data: [{ place: "King's Park", value: 1, desc: "Unknown Level" }] },
    };
    printCurrent(data);
    expect(getOutput()).toContain("Unknown Level");
  });

  it("shows UV recordDesc when present", () => {
    const data = {
      ...baseData,
      uvindex: {
        data: [{ place: "King's Park", value: 3, desc: "moderate" }],
        recordDesc: "Real-time UV index",
      },
    };
    printCurrent(data);
    expect(getOutput()).toContain("Real-time UV index");
  });

  it("hides UV section when uvindex is absent", () => {
    printCurrent(baseData);
    expect(getOutput()).not.toContain("UV Index");
  });

  it("hides UV section when uvindex.data is empty", () => {
    const data = { ...baseData, uvindex: { data: [] } };
    printCurrent(data);
    expect(getOutput()).not.toContain("UV Index");
  });

  it("shows warning message when present", () => {
    printCurrent({ ...baseData, warningMessage: "Thunderstorm warning in force." });
    expect(getOutput()).toContain("Thunderstorm warning in force.");
  });

  it("hides warning message section when absent", () => {
    printCurrent(baseData);
    expect(getOutput()).not.toContain("Warning:");
  });

  it("shows TC message when present", () => {
    printCurrent({ ...baseData, tcmessage: "Signal No. 3 is now in force." });
    expect(getOutput()).toContain("Signal No. 3 is now in force.");
  });

  it("hides TC message section when absent", () => {
    printCurrent(baseData);
    expect(getOutput()).not.toContain("Signal No.");
  });
});
