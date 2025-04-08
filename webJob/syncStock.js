import { set } from './redis.js';
import fetchStock from './fetchStock.js';

async function syncStockLevels() {
    try {
        const response = await fetchStock(); // raw JSON
        const records = response.value; // 21,000+ items

        const groupedByItem = new Map();

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
            await set(`stock:${itemId}`, JSON.stringify(records), 'EX', 600); // TTL 5 minutes
        }

        console.log(`Cached ${groupedByItem.size} items`);
        return "Stock levels successfully synced and cached.";
    } catch (error) {
        console.error("Error syncing stock levels:", error);
        return `Error syncing stock levels: ${error instanceof Error ? error.message : String(error)}`;
    }
}

export default { syncStockLevels };
