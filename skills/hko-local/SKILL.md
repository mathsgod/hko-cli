---
name: hko-local
description: "Hong Kong Observatory: Local weather forecast for today and outlook."
metadata:
  version: 1.0.0
  openclaw:
    category: "utilities"
    requires:
      bins:
        - hko
    cliHelp: "hko local --help"
---

# hko local

Fetch the latest local weather forecast from the Hong Kong Observatory (天文台), including today's forecast, general situation, and short-term outlook.

## Usage

```bash
hko local [flags]
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
# English local forecast (default)
hko local

# Traditional Chinese
hko local --lang tc

# Simplified Chinese
hko local --lang sc

# Raw JSON output
hko local --json

# Extract just today's forecast description
hko local --json | jq '.forecastDesc'
```

## Output

```
🌦  HKO Local Weather Forecast
📅  Updated: 26 Mar 2026, 9:45 am

📋  General Situation
    A relatively humid easterly airstream is affecting the coast of eastern Guangdong.

🕐  Weather forecast for today
    Mainly cloudy. One or two light rain patches at first. Sunny intervals during the day.
    Light to moderate east to southeasterly winds.

🔭  Outlook
    Warm during the day tomorrow and on Saturday. Relatively humid in the morning and at
    night. Hot with sunny periods and one or two showers early next week.
```

Optional sections appear only when active:

| Section | Condition |
|---------|-----------|
| ⚠️ Warning | Active weather warning |
| 🌀 Tropical Cyclone | TC info available |
| 🔥 Fire Danger Warning | Fire danger warning in force |

## JSON Fields

| Field | Description |
|-------|-------------|
| `generalSituation` | Synoptic weather situation |
| `forecastPeriod` | Period covered (e.g. "Weather forecast for today") |
| `forecastDesc` | Detailed forecast description including wind |
| `outlook` | Short-term outlook for coming days |
| `tcInfo` | Tropical cyclone information (empty string if none) |
| `fireDangerWarning` | Fire danger warning text (empty string if none) |
| `updateTime` | ISO 8601 timestamp of last update (HKT) |

## Data Source

```
GET https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang={en|tc|sc}
```

- No API key required.
- Updated multiple times daily.

## Tips

- Read-only — never modifies any data.
- Use `--json` to extract specific fields with `jq`.
- For a 9-day outlook, use [`hko weather`](../hko-weather/SKILL.md) instead.

## See Also

- [hko-weather](../hko-weather/SKILL.md) — 9-day weather forecast
- [hko-current](../hko-current/SKILL.md) — Current weather report (temperature, humidity, UV, rainfall)
