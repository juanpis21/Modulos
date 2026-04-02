const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres123',
  database: 'clinic_pet'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL 17');
    
    const res = await client.query('SELECT version()');
    console.log('Versión:', res.rows[0].version);
    
    const dbList = await client.query('SELECT datname FROM pg_database WHERE datname = \'clinic_pet\'');
    console.log('Base de datos clinic_pet existe:', dbList.rows.length > 0);
    
    await client.end();
    console.log('✅ Conexión cerrada');
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
}

testConnection();
