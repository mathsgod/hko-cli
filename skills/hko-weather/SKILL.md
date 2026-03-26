---
name: hko-weather
description: "Hong Kong Observatory: 9-day weather forecast."
metadata:
  version: 1.0.0
  openclaw:
    category: "utilities"
    requires:
      bins:
        - hko
    cliHelp: "hko weather --help"
---

# hko weather

Fetch the latest 9-day weather forecast from the Hong Kong Observatory (天文台) Open Data API.

## Usage

```bash
hko weather [flags]
```

## Flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--lang <lang>` | `-l` | `en` | Language of the forecast: `en` (English), `tc` (Traditional Chinese) or `sc` (Simplified Chinese) |
| `--json` | `-j` | — | Output the raw API response as formatted JSON instead of the table view |
| `--version` | `-V` | — | Print the CLI version |
| `--help` | `-h` | — | Show help text |

## Examples

```bash
# English 9-day forecast (default)
hko weather

# Traditional Chinese forecast
hko weather --lang tc

# Simplified Chinese forecast
hko weather --lang sc

# Raw JSON output (pipe-friendly)
hko weather --json

# Chinese forecast in JSON
hko weather --lang tc --json

# Pipe JSON into jq to extract just dates and max temperatures
hko weather --json | jq '[.weatherForecast[] | {date: .forecastDate, max: .forecastMaxtemp.value}]'
```

## Output

### Table view (default)

```
🌤  HKO 9-Day Weather Forecast
📅  Updated: 26 Mar 2026, 7:50 am

📋  Relatively humid easterly airstreams will affect...

────────────────────────────────────────────────────────────────────────
Date        Day       Weather                         Temp      Rain
────────────────────────────────────────────────────────────────────────
2026-03-26  Thu       Mainly cloudy. One or two lig…  23~27°C   🟢 Low
2026-03-27  Fri       Mainly cloudy. Coastal mist i…  22~27°C   🟢 Low
...
────────────────────────────────────────────────────────────────────────

🌊  Sea Temp (North Point): 23°C
```

**Rain probability (PSR) legend:**

| Icon | Level |
|------|-------|
| 🟢 | Low |
| 🟡 | Medium Low |
| 🟠 | Medium |
| 🔴 | Medium High |
| ⛈️ | High |

### JSON view (`--json`)

Returns the full API payload from the HKO Open Data endpoint, including:

| Field | Description |
|-------|-------------|
| `generalSituation` | Overall weather synopsis |
| `weatherForecast[]` | Array of 9 daily forecasts (date, wind, weather, temp, humidity, PSR) |
| `updateTime` | Timestamp of the last data update (ISO 8601, HKT) |
| `seaTemp` | Current sea surface temperature |
| `soilTemp[]` | Soil temperatures at 0.5 m and 1 m depth |

## Data Source

All data is fetched live from the **HKO Open Data API**:

```
GET https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang={en|tc|sc}
```

- No API key required.
- Data is updated multiple times daily by the Hong Kong Observatory.

## Tips

- Read-only — this command never modifies any data.
- Use `--json` to pipe output into tools like `jq`, `fx`, or scripts.
- `--lang tc` returns Traditional Chinese; `--lang sc` returns Simplified Chinese. Both share the same PSR value keys (e.g. `低`, `中`), so emoji display works correctly for all three languages.
- The `Weather` column in table view is truncated to 30 characters for alignment; use `--json` for full descriptions.
