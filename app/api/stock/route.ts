import { fetchStock } from '@/lib/fetchStock';

export async function GET(request: { url: string | URL; }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('search');  // Get the search query from the URL

  if (!searchQuery) {
    return new Response(JSON.stringify({ message: 'Search query is required' }), { status: 400 });
  }

  try {
    const inventoryData = await fetchStock(searchQuery);
    return new Response(JSON.stringify(inventoryData.value), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching inventory data' }), { status: 500 });
  }
}
