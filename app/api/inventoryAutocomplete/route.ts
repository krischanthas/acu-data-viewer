import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input('search', sql.VarChar, `${query}%`) // Adjust query type based on your DB schema
      .query(`
        SELECT TOP 10 InventoryID, ItemDescription
        FROM acumatica_inventory_items
        WHERE InventoryID LIKE @search OR ItemDescription LIKE @search
      `);

      return NextResponse.json({ suggestions: result.recordset });
  } catch (error) {
    console.error('Error fetching inventory suggestions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
