const fs = require('fs');
const Database = require('better-sqlite3');
const dbDir = './data';
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
const db = new Database('./data/product_db.sqlite');

// Create WATCH table (simplified from uploaded schema)
db.exec(`
CREATE TABLE IF NOT EXISTS WATCH (
  watchID TEXT PRIMARY KEY,
  watchName TEXT NOT NULL,
  price REAL CHECK(price >= 0),
  unitInStock INTEGER CHECK(unitInStock >= 0),
  description TEXT,
  status TEXT CHECK(status IN ('Available','Out of Stock','Discontinued')) DEFAULT 'Available',
  imageUrl TEXT,
  brandID TEXT,
  categoryID TEXT
);
`);

// Seed sample data
const insert = db.prepare('INSERT OR IGNORE INTO WATCH (watchID, watchName, price, unitInStock, description, status) VALUES (?,?,?,?,?,?)');
insert.run('W0001','Classic Silver', 120.0, 10, 'Classic silver watch', 'Available');
insert.run('W0002','Sport Black', 85.5, 25, 'Sport watch', 'Available');
console.log('DB initialized with sample data at ./data/product_db.sqlite');