# hko-cli

A command-line tool for fetching weather data from the [Hong Kong Observatory (天文台)](https://www.hko.gov.hk) Open Data API.

## Features

- 🌤 9-day weather forecast in a clean table view
- 🌦 Local weather forecast for today and short-term outlook
- 🌡 Current weather report — temperature, humidity, UV index, and rainfall
- 🌐 English, Traditional Chinese, and Simplified Chinese support
- 📦 JSON output mode for scripting and piping
- 🔑 No API key required

## Requirements

- [Node.js](https://nodejs.org) v18 or above

## Installation

```bash
npm install -g hko-cli
```

Or, if you prefer to run from source:

```bash
# Clone or download the project, then:
cd hko-cli
npm install
npm link        # registers the `hko` command globally
```

## Commands

| Command | Description |
|---------|-------------|
| `hko weather` | 9-day weather forecast |
| `hko local` | Local forecast for today and outlook |
| `hko current` | Current weather report (temperature, humidity, UV, rainfall) |

All commands support:

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--lang <lang>` | `-l` | `en` | Language: `en` · `tc` (繁體) · `sc` (简体) |
| `--json` | `-j` | — | Output raw JSON instead of table view |
| `--version` | `-V` | — | Print version |
| `--help` | `-h` | — | Show help |

## Examples

```bash
# 9-day forecast
hko weather
hko weather --lang tc
hko weather --json

# Local forecast for today
hko local
hko local --lang sc

# Current weather (temperature, humidity, UV, rainfall)
hko current
hko current --lang tc

# Pipe JSON into jq — extract dates and max temperatures
hko weather --json | jq '[.weatherForecast[] | {date: .forecastDate, max: .forecastMaxtemp.value}]'

# Get temperature at Hong Kong Observatory
hko current --json | jq '.temperature.data[] | select(.place == "Hong Kong Observatory")'
```

## Sample Output

### `hko weather`

```
🌤  HKO 9-Day Weather Forecast
📅  Updated: 26 Mar 2026, 7:50 am

📋  Relatively humid easterly airstreams will affect the coast of eastern Guangdong...

────────────────────────────────────────────────────────────────────────
Date        Day       Weather                         Temp      Rain
────────────────────────────────────────────────────────────────────────
2026-03-26  Thu       Mainly cloudy. One or two lig…  23~27°C   🟢 Low
2026-03-27  Fri       Mainly cloudy. Coastal mist i…  22~27°C   🟢 Low
...
────────────────────────────────────────────────────────────────────────

🌊  Sea Temp (North Point): 23°C
```

### `hko local`

```
🌦  HKO Local Weather Forecast
📅  Updated: 26 Mar 2026, 9:45 am

📋  General Situation
    A relatively humid easterly airstream is affecting the coast of eastern Guangdong.

🕐  Weather forecast for today
    Mainly cloudy. One or two light rain patches. Sunny intervals during the day.

🔭  Outlook
    Warm during the day tomorrow. Hot with sunny periods and showers early next week.
```

### `hko current`

```
🌡  HKO Current Weather Report
📅  Updated: 26 Mar 2026, 10:02 am

🌡  Temperature (as of 10:00 am)
────────────────────────────────────────────────────
    Hong Kong Observatory              26°C
    Kowloon City                       27°C
    ...

💧  Humidity (as of 10:00 am)
────────────────────────────────────────────────────
    Hong Kong Observatory              75%

☀️   UV Index
────────────────────────────────────────────────────
    King's Park                        2  🟢 Low

🌧  Rainfall 8:45 am–9:45 am
────────────────────────────────────────────────────
    No rainfall recorded across all districts.
```

**Rain probability (PSR) legend:**

| Icon | Level |
|------|-------|
| 🟢 | Low |
| 🟡 | Medium Low |
| 🟠 | Medium |
| 🔴 | Medium High |
| ⛈️ | High |

## AI Agent Skills

This repo ships 3 Agent Skills (`SKILL.md` files) — one for each command — so AI agents (GitHub Copilot, OpenClaw, etc.) can understand and use the CLI without writing custom tooling.

```bash
# Install all skills at once
npx skills add https://github.com/mathsgod/hko-cli

# Or pick only what you need
npx skills add https://github.com/mathsgod/hko-cli/tree/main/skills/hko-weather
npx skills add https://github.com/mathsgod/hko-cli/tree/main/skills/hko-local
npx skills add https://github.com/mathsgod/hko-cli/tree/main/skills/hko-current
```

<details>
<summary>OpenClaw / manual setup</summary>

```bash
# Symlink all skills (stays in sync with repo)
ln -s $(pwd)/skills/hko-* ~/.openclaw/skills/

# Or copy specific skills
cp -r skills/hko-weather skills/hko-current ~/.openclaw/skills/
```

</details>

### Skills Index

| Skill | Command | Description |
|-------|---------|-------------|
| [hko-weather](skills/hko-weather/SKILL.md) | `hko weather` | 9-day weather forecast |
| [hko-local](skills/hko-local/SKILL.md) | `hko local` | Local forecast for today and outlook |
| [hko-current](skills/hko-current/SKILL.md) | `hko current` | Current weather — temperature, humidity, UV, rainfall |

## Data Source

All data is fetched live from the HKO Open Data API — no account or API key needed:

| Endpoint | `dataType` | Command |
|----------|-----------|---------|
| `weather.php?dataType=fnd` | 9-day forecast | `hko weather` |
| `weather.php?dataType=flw` | Local forecast | `hko local` |
| `weather.php?dataType=rhrread` | Current report | `hko current` |

Base URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php`

## Project Structure

```
hko-cli/
├── index.js               # CLI entry point
├── package.json
├── src/
│   └── weather/
│       ├── fetch.js       # fetchWeather() — 9-day forecast
│       ├── local.js       # fetchLocal(), printLocal()
│       ├── current.js     # fetchCurrent(), printCurrent()
│       ├── print.js       # printForecast(), PSR_EMOJI
│       └── index.js       # re-exports
└── skills/
    ├── hko-weather/SKILL.md
    ├── hko-local/SKILL.md
    └── hko-current/SKILL.md
```

## License

ISC
