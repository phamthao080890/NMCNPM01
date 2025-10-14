const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const db = new Database('./data/product_db.sqlite');

const app = express();
app.use(bodyParser.json());

// List products
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM WATCH').all();
  res.json(rows);
});

// Get product
app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM WATCH WHERE watchID = ?').get(req.params.id);
  if (!row) return res.status(404).json({error:'Not found'});
  res.json(row);
});

// Create product
app.post('/api/products', (req, res) => {
  const p = req.body;
  if (!p.watchID || !p.watchName) return res.status(400).json({error:'watchID and watchName required'});
  const stmt = db.prepare('INSERT INTO WATCH (watchID, watchName, price, unitInStock, description, status, imageUrl, brandID, categoryID) VALUES (?,?,?,?,?,?,?,?,?)');
  try {
    stmt.run(p.watchID, p.watchName, p.price || 0, p.unitInStock || 0, p.description||'', p.status||'Available', p.imageUrl||'', p.brandID||null, p.categoryID||null);
    res.status(201).json({ok:true});
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const p = req.body;
  const stmt = db.prepare('UPDATE WATCH SET watchName=?, price=?, unitInStock=?, description=?, status=?, imageUrl=?, brandID=?, categoryID=? WHERE watchID=?');
  try {
    const info = stmt.run(p.watchName, p.price, p.unitInStock, p.description, p.status, p.imageUrl, p.brandID, p.categoryID, req.params.id);
    if (info.changes === 0) return res.status(404).json({error:'Not found'});
    res.json({ok:true});
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM WATCH WHERE watchID = ?');
  const info = stmt.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({error:'Not found'});
  res.json({ok:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));