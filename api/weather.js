module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  const { q } = req.query;
  if (!q) { res.status(200).json({ results: [] }); return; }
  try {
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en`);
    const d = await r.json();
    res.status(200).json(d);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
