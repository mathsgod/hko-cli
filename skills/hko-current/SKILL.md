---
name: hko-current
description: "Hong Kong Observatory: Current weather report with temperature, humidity, UV index and rainfall."
metadata:
  version: 1.0.0
  openclaw:
    category: "utilities"
    requires:
      bins:
        - hko
    cliHelp: "hko current --help"
---

# hko current

Fetch the latest current weather report from the Hong Kong Observatory (天文台), including real-time temperature readings across all stations, humidity, UV index, and past-hour rainfall by district.

## Usage

```bash
hko current [flags]
```

## Flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--lang <lang>` | `-l` | `en` | Language: `en` (English), `tc` (Traditional Chinese) or `sc` (Simplified Chinese) |
| `--json` | `-j` | — | Output the raw API response as formatted JSON |
| `--version` | `-V` | — | Print the CLI version |
| `--help` | `-h` | — | Show help text |

## Examples

```bash
# Current weather report (default English)
hko current

# Traditional Chinese
hko current --lang tc

# Simplified Chinese
hko current --lang sc

# Raw JSON output
hko current --json

# Extract temperature at Hong Kong Observatory only
hko current --json | jq '.temperature.data[] | select(.place == "Hong Kong Observatory")'

# List all districts with rainfall > 0
hko current --json | jq '[.rainfall.data[] | select(.max > 0)]'
```

## Output

```
🌡  HKO Current Weather Report
📅  Updated: 26 Mar 2026, 10:02 am

🌡  Temperature (as of 10:00 am)
────────────────────────────────────────────────────
    King's Park                        26°C
    Hong Kong Observatory              26°C
    Kowloon City                       27°C
    ...

💧  Humidity (as of 10:00 am)
────────────────────────────────────────────────────
    Hong Kong Observatory              75%

☀️   UV Index
────────────────────────────────────────────────────
    King's Park                        2  🟢 Low
    (During the past hour)

🌧  Rainfall 8:45 am–9:45 am
────────────────────────────────────────────────────
    No rainfall recorded across all districts.
```

Optional sections appear only when active:

| Section | Condition |
|---------|-----------|
| ⚠️ Warning | Active weather warning in force |
| 🌀 Tropical Cyclone | TC message available |

**UV Index legend:**

| Icon | Level |
|------|-------|
| 🟢 | Low (0–2) |
| 🟡 | Moderate (3–5) |
| 🟠 | High (6–7) |
| 🔴 | Very High (8–10) |
| ⛈️ | Extreme (11+) |

## JSON Fields

| Field | Description |
|-------|-------------|
| `temperature.data[]` | Temperature readings from ~27 stations (`place`, `value`, `unit`) |
| `temperature.recordTime` | Timestamp of temperature readings |
| `humidity.data[]` | Relative humidity at Hong Kong Observatory |
| `humidity.recordTime` | Timestamp of humidity reading |
| `uvindex.data[]` | UV index readings (`place`, `value`, `desc`) |
| `uvindex.recordDesc` | Recording period description |
| `rainfall.data[]` | Past-hour rainfall by district (`place`, `max`, `unit`) |
| `rainfall.startTime` | Start of rainfall recording period |
| `rainfall.endTime` | End of rainfall recording period |
| `warningMessage` | Active warning text (empty string if none) |
| `tcmessage` | Tropical cyclone message (empty string if none) |
| `icon[]` | Weather icon code(s) |
| `updateTime` | ISO 8601 timestamp of last update (HKT) |

## Data Source

```
GET https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang={en|tc|sc}
```

- No API key required.
- Updated every hour.

## Tips

- Read-only — never modifies any data.
- Temperature data covers 27 stations across Hong Kong.
- Rainfall shows the past hour only; use `--json` to get exact start/end times.
- Use `--json` with `jq` to filter specific stations or districts.

## See Also

- [hko-weather](../hko-weather/SKILL.md) — 9-day weather forecast
- [hko-local](../hko-local/SKILL.md) — Local weather forecast for today and outlook
