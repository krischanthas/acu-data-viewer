import { NextRequest, NextResponse } from "next/server";
import { syncStockLevels } from "@/lib/fetchStockJob";

export async function GET(request: NextRequest) {
  console.log(request);
  try {

    const inventoryData = await syncStockLevels();

    return NextResponse.json(inventoryData, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return NextResponse.json({ message: "Error fetching inventory data - Check syncStockLevels function" }, { status: 500 });
  }
}
