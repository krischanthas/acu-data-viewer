import redisClient from "@/lib/redis";
import { fetchStock } from "@/lib/fetchStock"; // call your API

export async function syncStockLevels() {
  try {
    const response = await fetchStock(); // raw JSON
    const records = response.value; // 21,000+ items

    interface StockRecord {
      Warehouse: string;
      InventoryID: string;
      Branch: string;
      Description: string;
      QtyOnHand: string;
      QtyAvailable: string;
      WarehouseID: string;
      LocationID: string;
      InventoryID_2: string;
      Subitem: string;
      Warehouse_2: string;
      Location: string;
    }

    const groupedByItem = new Map<string, StockRecord[]>();

    // Group records by item ID
    for (const record of records) {
      const rawItemId = record.InventoryID;
      const itemId = rawItemId?.trim();

      if (!itemId) continue;

      if (!groupedByItem.has(itemId)) {
        groupedByItem.set(itemId, []);
      }

      groupedByItem.get(itemId)?.push(record);
    }

    // Save to Redis
    for (const [itemId, records] of groupedByItem.entries()) {
      await redisClient.set(`stock:${itemId}`, JSON.stringify(records), 'EX', 600); // TTL 5 minutes
    }

    console.log(`Cached ${groupedByItem.size} items`);
    return "Stock levels successfully synced and cached.";
  } catch (error) {
    console.error("Error syncing stock levels:", error);
    return `Error syncing stock levels: ${error instanceof Error ? error.message : String(error)}`;
  }
}
