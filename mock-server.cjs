/**
 * mock-server.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight mock API server that mimics the Spring Boot backend.
 * Uses json-server under the hood for full CRUD + persistence.
 *
 * Run:  npx json-server --watch db.json --port 8080 --routes mock-routes.json
 *   OR: node mock-server.cjs
 *
 * Endpoints served (matching Spring Boot controller):
 *   GET    /api/contacts          → list all
 *   GET    /api/contacts/search?query=…  → full-text search
 *   GET    /api/contacts/:id      → single contact
 *   POST   /api/contacts          → create
 *   PUT    /api/contacts/:id      → update
 *   DELETE /api/contacts/:id      → delete
 */

const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ logger: true });

// ─── Standard json-server middlewares (CORS, static, etc.) ─────────────────
server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── Custom: /api/contacts/search?query=… ──────────────────────────────────
// json-server doesn't have a search endpoint out of the box,
// so we add one that filters across name, email, phone, company.
server.get('/api/contacts/search', (req, res) => {
  const query = (req.query.query || '').toLowerCase().trim();
  if (!query) {
    return res.json(router.db.get('contacts').value());
  }

  const results = router.db
    .get('contacts')
    .filter((c) => {
      const hay = [c.name, c.email, c.phone, c.company]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(query);
    })
    .value();

  res.json(results);
});

// ─── Rewrite /api/contacts → /contacts (json-server's native route) ───────
server.use(
  jsonServer.rewriter({
    '/api/contacts': '/contacts',
    '/api/contacts/:id': '/contacts/:id',
  })
);

server.use(router);

// ─── Start on port 8080 (same port Vite proxy targets) ────────────────────
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`\n  🚀  Mock API server running on http://localhost:${PORT}`);
  console.log(`  📦  Data file: ${path.join(__dirname, 'db.json')}`);
  console.log(`  🔗  Endpoints:`);
  console.log(`       GET    http://localhost:${PORT}/api/contacts`);
  console.log(`       GET    http://localhost:${PORT}/api/contacts/search?query=…`);
  console.log(`       GET    http://localhost:${PORT}/api/contacts/:id`);
  console.log(`       POST   http://localhost:${PORT}/api/contacts`);
  console.log(`       PUT    http://localhost:${PORT}/api/contacts/:id`);
  console.log(`       DELETE http://localhost:${PORT}/api/contacts/:id\n`);
});
