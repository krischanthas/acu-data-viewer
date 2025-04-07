import { NextRequest, NextResponse } from "next/server";
import { fetchStock } from "@/lib/fetchStock";
import redis from "@/lib/redis";

export async function GET(request: NextRequest) {


  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search"); // Extract search query

    if (!searchQuery) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 });
    }

    const cacheKey = `stock_${searchQuery}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // const inventoryData = await fetchStock(searchQuery);
    const inventoryData = await fetchStock();

    //cache the response (set expiry to 5 minutes)
    // await redis.set(cacheKey, JSON.stringify(inventoryData.value), "EX", 300);

    return NextResponse.json(inventoryData.value, { status: 200 });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json({ message: "Error fetching inventory data" }, { status: 500 });
  }
}
