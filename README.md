# hko-cli

A command-line tool for fetching weather forecasts from the [Hong Kong Observatory (天文台)](https://www.hko.gov.hk) Open Data API.

## Features

- 🌤 9-day weather forecast in a clean table view
- 🌐 English, Traditional Chinese, and Simplified Chinese support
- 📦 JSON output mode for scripting and piping
- 🔑 No API key required

## Requirements

- [Node.js](https://nodejs.org) v18 or above

## Installation

```bash
# Clone or download the project, then:
cd hko-cli
npm install
npm link        # registers the `hko` command globally
```

## Usage

```bash
hko weather [flags]
```

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--lang <lang>` | `-l` | `en` | Language: `en` · `tc` (繁體) · `sc` (简体) |
| `--json` | `-j` | — | Output raw JSON instead of table view |
| `--version` | `-V` | — | Print version |
| `--help` | `-h` | — | Show help |

## Examples

```bash
# English forecast (default)
hko weather

# Traditional Chinese
hko weather --lang tc

# Simplified Chinese
hko weather --lang sc

# Raw JSON
hko weather --json

# Pipe into jq — extract dates and max temperatures
hko weather --json | jq '[.weatherForecast[] | {date: .forecastDate, max: .forecastMaxtemp.value}]'
```

## Sample Output

```
🌤  HKO 9-Day Weather Forecast
📅  Updated: 26 Mar 2026, 7:50 am

📋  Relatively humid easterly airstreams will affect the coast of eastern
    Guangdong in the next couple of days...

────────────────────────────────────────────────────────────────────────
Date        Day       Weather                         Temp      Rain
────────────────────────────────────────────────────────────────────────
2026-03-26  Thu       Mainly cloudy. One or two lig…  23~27°C   🟢 Low
2026-03-27  Fri       Mainly cloudy. Coastal mist i…  22~27°C   🟢 Low
2026-03-28  Sat       Mainly cloudy with one or two…  22~26°C   🟢 Low
2026-03-29  Sun       Mainly cloudy with one or two…  22~27°C   🟢 Low
2026-03-30  Mon       Mainly cloudy with one or two…  23~29°C   🟢 Low
2026-03-31  Tue       Mainly cloudy with a few show…  24~29°C   🟠 Medium
2026-04-01  Wed       Mainly cloudy with one or two…  24~29°C   🟡 Medium Low
2026-04-02  Thu       Mainly cloudy with a few show…  23~29°C   🟠 Medium
2026-04-03  Fri       Mainly cloudy with a few show…  23~28°C   🟠 Medium
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

## Data Source

All data is fetched live from the HKO Open Data API — no account or API key needed:

```
GET https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang={en|tc|sc}
```

## Project Structure

```
hko-cli/
├── index.js               # CLI entry point
├── package.json
└── skills/
    └── hko-weather/
        └── SKILL.md       # Skill documentation
```

## License

ISC
