import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter } from "events";

vi.mock("https", () => ({
  default: { get: vi.fn() },
}));

import https from "https";
import { fetchWeather } from "../fetch.js";
import { fetchLocal } from "../local.js";
import { fetchCurrent } from "../current.js";

/**
 * Creates a mock HTTPS response stream and a helper to push body data.
 */
function mockResponse(statusCode, body) {
  const res = new EventEmitter();
  res.statusCode = statusCode;
  res.setEncoding = vi.fn();
  res.resume = vi.fn();
  const sendBody = () => {
    res.emit("data", body);
    res.emit("end");
  };
  return { res, sendBody };
}

/**
 * Sets up https.get to return a mock request EventEmitter and invoke the
 * response callback with the provided response object.
 */
function setupMock(res, sendBodyFn) {
  const req = new EventEmitter();
  https.get.mockImplementation((_url, cb) => {
    cb(res);
    if (sendBodyFn) sendBodyFn();
    return req;
  });
  return req;
}

describe("fetchWeather", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resolves with parsed JSON on HTTP 200", async () => {
    const payload = { generalSituation: "Fine" };
    const { res, sendBody } = mockResponse(200, JSON.stringify(payload));
    setupMock(res, sendBody);
    await expect(fetchWeather("en")).resolves.toEqual(payload);
  });

  it("rejects with HTTP error message on non-200 status", async () => {
    const { res } = mockResponse(404, "");
    setupMock(res);
    await expect(fetchWeather("en")).rejects.toThrow("HTTP 404");
  });

  it("rejects when response body is invalid JSON", async () => {
    const { res, sendBody } = mockResponse(200, "not { valid json");
    setupMock(res, sendBody);
    await expect(fetchWeather("en")).rejects.toThrow();
  });

  it("rejects on network error", async () => {
    const req = new EventEmitter();
    https.get.mockImplementation(() => req);
    const promise = fetchWeather("en");
    req.emit("error", new Error("ECONNREFUSED"));
    await expect(promise).rejects.toThrow("ECONNREFUSED");
  });

  it("calls the correct HKO API URL with dataType=fnd", async () => {
    const { res, sendBody } = mockResponse(200, "{}");
    setupMock(res, sendBody);
    await fetchWeather("tc");
    expect(https.get.mock.calls[0][0]).toContain("dataType=fnd");
    expect(https.get.mock.calls[0][0]).toContain("lang=tc");
  });
});

describe("fetchLocal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resolves with parsed JSON on HTTP 200", async () => {
    const payload = { generalSituation: "Cloudy" };
    const { res, sendBody } = mockResponse(200, JSON.stringify(payload));
    setupMock(res, sendBody);
    await expect(fetchLocal("en")).resolves.toEqual(payload);
  });

  it("rejects on non-200 status", async () => {
    const { res } = mockResponse(500, "");
    setupMock(res);
    await expect(fetchLocal("en")).rejects.toThrow("HTTP 500");
  });

  it("calls the correct HKO API URL with dataType=flw", async () => {
    const { res, sendBody } = mockResponse(200, "{}");
    setupMock(res, sendBody);
    await fetchLocal("sc");
    expect(https.get.mock.calls[0][0]).toContain("dataType=flw");
    expect(https.get.mock.calls[0][0]).toContain("lang=sc");
  });
});

describe("fetchCurrent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resolves with parsed JSON on HTTP 200", async () => {
    const payload = { updateTime: "2024-03-26T12:00:00+08:00" };
    const { res, sendBody } = mockResponse(200, JSON.stringify(payload));
    setupMock(res, sendBody);
    await expect(fetchCurrent("en")).resolves.toEqual(payload);
  });

  it("rejects on non-200 status", async () => {
    const { res } = mockResponse(503, "");
    setupMock(res);
    await expect(fetchCurrent("en")).rejects.toThrow("HTTP 503");
  });

  it("calls the correct HKO API URL with dataType=rhrread", async () => {
    const { res, sendBody } = mockResponse(200, "{}");
    setupMock(res, sendBody);
    await fetchCurrent("tc");
    expect(https.get.mock.calls[0][0]).toContain("dataType=rhrread");
    expect(https.get.mock.calls[0][0]).toContain("lang=tc");
  });
});
