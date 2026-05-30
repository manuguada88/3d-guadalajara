const http = require('http');
const fs = require('fs');
const path = require('path');

const STOCK_FILE = path.join(__dirname, 'stock-data.json');
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readStock() {
  try {
    if (fs.existsSync(STOCK_FILE)) return JSON.parse(fs.readFileSync(STOCK_FILE, 'utf8'));
  } catch (e) {}
  return null;
}

function writeStock(data) {
  fs.writeFileSync(STOCK_FILE, JSON.stringify(data), 'utf8');
}

function parseBody(req) {
  return new Promise(function(resolve) {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
    });
  });
}

const server = http.createServer(async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  var url = req.url.split('?')[0];

  // GET /stock.json — read current stock (looks like a static file, works through any proxy)
  if (url === '/stock.json' && req.method === 'GET') {
    var stock = readStock();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return res.end(JSON.stringify(stock || {}));
  }

  // POST or PUT /stock.json — save stock
  if (url === '/stock.json' && (req.method === 'POST' || req.method === 'PUT')) {
    var data = await parseBody(req);
    if (data) {
      writeStock(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }
    res.writeHead(400);
    return res.end('Bad request');
  }

  // Also support GET /api/stock and POST /api/stock as aliases
  if ((url === '/api/stock' || url === '/api/stock/') && req.method === 'GET') {
    var stock2 = readStock();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });
    return res.end(JSON.stringify(stock2 || {}));
  }
  if ((url === '/api/stock' || url === '/api/stock/') && (req.method === 'POST' || req.method === 'PUT')) {
    var data2 = await parseBody(req);
    if (data2) {
      writeStock(data2);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }
    res.writeHead(400);
    return res.end('Bad request');
  }

  // Serve static files
  var filePath = url === '/' ? '/index.html' : url;
  var fullPath = path.join(__dirname, filePath);

  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // Don't serve stock-data.json directly
  if (path.basename(fullPath) === 'stock-data.json') {
    res.writeHead(404);
    return res.end('Not found');
  }

  fs.readFile(fullPath, function(err, data) {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    var ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', function() {
  console.log('3D Guadalajara server on http://0.0.0.0:' + PORT);
});
