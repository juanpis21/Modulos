const { Client } = require('pg');

async function checkPasswords() {
  const client = new Client({
    user: 'root', host: 'localhost', database: 'clinic_pet', password: '123456', port: 5432,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT username, password FROM "users" LIMIT 3');
    res.rows.forEach(row => {
      console.log(`User: ${row.username}, Pass format: ${row.password.substring(0, 7)}...`);
    });
  } finally {
    await client.end();
  }
}
checkPasswords();
