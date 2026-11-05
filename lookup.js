const net = require('net');

module.exports = async (req, res) => {
  let ip = String(req.query.ip || '').trim();

  // Tanpa input: pakai IP pengunjung
  if (!ip) {
    const xff = req.headers['x-forwarded-for'];
    ip = (xff ? xff.split(',')[0] : req.socket.remoteAddress || '').trim();
  }

  if (!net.isIP(ip)) {
    return res.status(400).json({ success: false, message: 'Format IP tidak valid' });
  }

  try {
    const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ success: false, message: 'Gagal menghubungi layanan geolokasi' });
  }
};
