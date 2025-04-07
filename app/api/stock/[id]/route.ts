
import RedisClient from "@/lib/redis";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const itemId = id?.toUpperCase();

  const stock = await RedisClient.get(`stock:${itemId}`);

  if (!stock) {
    return new Response(
      JSON.stringify({ message: "Stock unavailable" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(stock, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
