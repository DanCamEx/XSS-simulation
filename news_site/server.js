const path = require("node:path");
const fs = require("node:fs");
const Fastify = require("fastify");
const Database = require("better-sqlite3");
const formbody = require("@fastify/formbody");
const view = require("@fastify/view");
const staticPlugin = require("@fastify/static");
const ejs = require("ejs");

const app = Fastify({ logger: true });

const dbPath =
  process.env.SQLITE_PATH || path.join(__dirname, "data", "sqlite.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL
  )
`);

app.register(formbody);
app.register(view, {
  engine: { ejs },
  root: __dirname,
});
app.register(staticPlugin, {
  root: __dirname,
});

app.get("/", async (request, reply) => {
  try {
    const comments = db.prepare("SELECT * FROM comments ORDER BY id DESC").all();
    return reply.view("main.ejs", { comments, errorMessage: null });
  } catch (err) {
    request.log.error(err);
    return reply.view("main.ejs", {
      comments: [],
      errorMessage: "Errore caricamento commenti",
    });
  }
});

app.get("/comment", async (request, reply) => {
  return reply.redirect("/");
});

app.post("/comment", async (request, reply) => {
  const { name, message } = request.body || {};

  if (!name || !message) {
    const comments = db.prepare("SELECT * FROM comments ORDER BY id DESC").all();
    return reply.view("main.ejs", {
      comments,
      errorMessage: "Compila tutti i campi.",
    });
  }

  try {
    db.prepare("INSERT INTO comments (name, message) VALUES (?, ?)").run(
      name,
      message,
    );

    return reply.redirect("/");
  } catch (err) {
    request.log.error(err);
    const comments = db.prepare("SELECT * FROM comments ORDER BY id DESC").all();
    return reply.view("main.ejs", {
      comments,
      errorMessage: "Errore durante il salvataggio del commento. Riprova.",
    });
  }
});

app.setErrorHandler((err, request, reply) => {
  request.log.error(err);
  reply.code(500).view("main.ejs", {
    comments: [],
    errorMessage: "Errore interno del server. Riprova più tardi.",
  });
});

const PORT = Number(process.env.PORT || 3000);

app.listen({ port: PORT, host: "0.0.0.0" });
