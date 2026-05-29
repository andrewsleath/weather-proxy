const https = require("https");

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (r) => {
      let body = "";
      r.on("data", (c) => (body += c));
      r.on("end", () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    }).on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const { lat, lon, models = "best_match" } = req.query;
  if (!lat || !lon) { res.status(400).json({ error: "lat and lon required" }); return; }

  const p = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weathercode,cloudcover,windspeed_10m,winddirection_10m,windgusts_10m",
    hourly: "temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,windspeed_10m,cloudcover",
    daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,sunrise,sunset",
    timezone: "Europe/London", forecast_days: "3", models,
  });

  try {
    const data = await get(`https://api.open-meteo.com/v1/forecast?${p}`);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
