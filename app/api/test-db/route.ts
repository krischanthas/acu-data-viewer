import { NextResponse } from "next/server";
import sql from "mssql";

const config = {
  user: process.env.MSSQL_USER || "",
  password: process.env.MSSQL_PASSWORD || "",
  server: process.env.MSSQL_HOST || "",
  port: Number(process.env.MSSQL_PORT) || 1433,
  database: process.env.MSSQL_DATABASE || "",
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === "true",
    trustServerCertificate: true,
  },
};

export async function GET() {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT TOP 1 * FROM acumatica_inventory_items");

    const prettyJson = JSON.stringify(result.recordset, null, 2);
    return new NextResponse(prettyJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
