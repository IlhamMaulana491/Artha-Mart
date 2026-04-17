import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('crm.db');

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'lead',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    sku TEXT UNIQUE,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    value INTEGER NOT NULL,
    stage TEXT DEFAULT 'prospect',
    priority TEXT DEFAULT 'medium',
    expected_close_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/stats', (req, res) => {
    try {
      const totalDeals = db.prepare('SELECT SUM(value) as total FROM deals').get() as { total: number };
      const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
      const activeDealsCount = db.prepare('SELECT COUNT(*) as count FROM deals WHERE stage != "closed"').get() as { count: number };
      
      const pipelineData = db.prepare('SELECT stage, SUM(value) as value FROM deals GROUP BY stage').all();
      
      res.json({
        totalRevenue: totalDeals?.total || 0,
        customerCount: customerCount.count,
        activeDeals: activeDealsCount.count,
        pipeline: pipelineData
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/customers', (req, res) => {
    try {
      const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/customers', (req, res) => {
    try {
      const { name, email, phone, company } = req.body;
      const emailValue = email && email.trim() !== '' ? email.trim() : null;
      const info = db.prepare('INSERT INTO customers (name, email, phone, company) VALUES (?, ?, ?, ?)').run(name, emailValue, phone, company);
      res.json({ id: info.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/deals', (req, res) => {
    try {
      const deals = db.prepare(`
        SELECT deals.*, customers.name as customer_name 
        FROM deals 
        JOIN customers ON deals.customer_id = customers.id
      `).all();
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/deals', (req, res) => {
    const { customer_id, title, value, stage, priority } = req.body;
    const info = db.prepare('INSERT INTO deals (customer_id, title, value, stage, priority) VALUES (?, ?, ?, ?, ?)').run(customer_id, title, value, stage || 'prospect', priority || 'medium');
    res.json({ id: info.lastInsertRowid });
  });

  app.patch('/api/deals/:id', (req, res) => {
    const { stage } = req.body;
    const { id } = req.params;
    db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run(stage, id);
    res.json({ success: true });
  });

  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', (req, res) => {
    try {
      const { name, description, price, sku, stock } = req.body;
      const skuValue = sku && sku.trim() !== '' ? sku.trim() : null;
      const priceValue = parseInt(price) || 0;
      const stockValue = parseInt(stock) || 0;
      
      const info = db.prepare('INSERT INTO products (name, description, price, sku, stock) VALUES (?, ?, ?, ?, ?)').run(
        name, 
        description, 
        priceValue, 
        skuValue, 
        stockValue
      );
      res.json({ id: info.lastInsertRowid });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
