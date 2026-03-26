import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printLocal } from "../local.js";

const baseData = {
  updateTime: "2024-03-26T12:00:00+08:00",
  generalSituation: "A trough of low pressure affects the coast.",
  forecastPeriod: "Today and tonight",
  forecastDesc: "Cloudy with occasional rain.",
};

describe("printLocal", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  const getOutput = () => consoleSpy.mock.calls.map((c) => c[0]).join("\n");

  it("always shows general situation", () => {
    printLocal(baseData);
    expect(getOutput()).toContain("A trough of low pressure affects the coast.");
  });

  it("always shows forecast period and description", () => {
    printLocal(baseData);
    expect(getOutput()).toContain("Today and tonight");
    expect(getOutput()).toContain("Cloudy with occasional rain.");
  });

  it("shows outlook section when present", () => {
    printLocal({ ...baseData, outlook: "Fine weather expected next week." });
    expect(getOutput()).toContain("Outlook");
    expect(getOutput()).toContain("Fine weather expected next week.");
  });

  it("hides outlook section when absent", () => {
    printLocal(baseData);
    expect(getOutput()).not.toContain("Outlook");
  });

  it("shows tropical cyclone info when present", () => {
    printLocal({ ...baseData, tcInfo: "Signal No. 3 is now in force." });
    expect(getOutput()).toContain("Tropical Cyclone");
    expect(getOutput()).toContain("Signal No. 3 is now in force.");
  });

  it("hides tropical cyclone section when absent", () => {
    printLocal(baseData);
    expect(getOutput()).not.toContain("Tropical Cyclone");
  });

  it("shows fire danger warning when present", () => {
    printLocal({ ...baseData, fireDangerWarning: "Red fire danger warning." });
    expect(getOutput()).toContain("Fire Danger Warning");
    expect(getOutput()).toContain("Red fire danger warning.");
  });

  it("hides fire danger warning section when absent", () => {
    printLocal(baseData);
    expect(getOutput()).not.toContain("Fire Danger");
  });
});
