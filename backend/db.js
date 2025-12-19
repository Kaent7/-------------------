const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PraticeON',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;