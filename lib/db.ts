import sql from 'mssql';

const config = {
  user: process.env.MSSQL_USER || '',
  password: process.env.MSSQL_PASSWORD || '',
  server: process.env.MSSQL_HOST || '', // e.g., "localhost" or "your-MSSQL-server"
  port: Number(process.env.MSSQL_PORT),
  database: process.env.MSSQL_DATABASE || '',
  options: {
    encrypt: true, // Use encryption if required
    trustServerCertificate: true, // Change based on your security setup
  },
};

export async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection failed', err);
    throw new Error('Database connection failed');
  }
}
