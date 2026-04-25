const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    user: 'root',
    host: 'localhost',
    database: 'clinic_pet',
    password: '123456',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('--- DATABASE USERS ---');
    const res = await client.query('SELECT id, username, email FROM "users"');
    console.log(JSON.stringify(res.rows, null, 2));
    console.log('--- TOTAL:', res.rowCount, '---');
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await client.end();
  }
}

checkUsers();
