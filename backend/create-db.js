import pg from 'pg';
const { Client } = pg;

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1320',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'AIDiagnosia'`);
    
    if (result.rows.length === 0) {
      console.log('Database AIDiagnosia does not exist. Creating...');
      await client.query('CREATE DATABASE "AIDiagnosia"');
      console.log('Database created successfully');
    } else {
      console.log('Database AIDiagnosia already exists');
    }

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

createDatabase();
