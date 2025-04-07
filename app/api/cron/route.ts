// app/api/cron/route.ts
import { NextResponse } from "next/server";
import { syncStockLevels } from "@/lib/fetchStockJob";

export async function GET() {
  try {
    await syncStockLevels();  // Synchronize the stock levels
    console.log("Cron job completed successfully at " + new Date().toISOString());  // Log success message
    return NextResponse.json({ status: "success", message: "Stock levels synced." });
  } catch (error) {
    console.error("Cron job failed:", error);  // Log error if something goes wrong
    return NextResponse.json({ status: "error", message: "Cron job failed." }, { status: 500 });
  }
}
