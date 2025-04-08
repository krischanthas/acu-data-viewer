import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import sql from 'mssql';
import RedisClient from "@/lib/redis";  


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {

    const cacheKey = `inventory:${query}`;
    const cachedData = await RedisClient.get(cacheKey);

    if (cachedData) {
      // If data is cached, return the cached suggestions
      return NextResponse.json({ suggestions: JSON.parse(cachedData) });
    }

    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input('search', sql.VarChar, `${query}%`) // Adjust query type based on your DB schema
      .query(`
        SELECT TOP 10 InventoryID, ItemDescription
        FROM acumatica_inventory_items
        WHERE InventoryID LIKE @search OR ItemDescription LIKE @search
      `);

      await RedisClient.set(cacheKey, JSON.stringify(result.recordset), 'EX', 3600); // Cache for 1 hour (adjust expiration time as needed)

      return NextResponse.json({ suggestions: result.recordset });
  } catch (error) {
    console.error('Error fetching inventory suggestions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
