'use client';

import React, { useState, useEffect, useRef } from 'react';

// Updated Type Definition
type InventoryItem = {
    Warehouse: string | null;
    InventoryID: string;
    Branch: string;
    Description: string;
    QtyOnHand: string;
    QtyAvailable: string;
    WarehouseID: string;
    LocationID: string | null;
    InventoryID_2: string;
    Subitem: string;
    Warehouse_2: string;
    Location: string;
};

const Stock = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [inventory, setInventory] = useState<InventoryItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Array<{ InventoryID: string; ItemDescription: string }>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isSelectingSuggestion, setIsSelectingSuggestion] = useState<boolean>(false);
    const cacheRef = useRef<Map<string, Array<{ InventoryID: string; ItemDescription: string }>>>(new Map());

    useEffect(() => {
        if (searchQuery.length < 3 || isSelectingSuggestion) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            return;
        }

        const handler = setTimeout(() => {
            if (cacheRef.current.has(searchQuery)) {
                setSuggestions(cacheRef.current.get(searchQuery) || []);
                setIsDropdownOpen(true);
            } else {
                fetch(`/api/inventoryAutocomplete?query=${searchQuery}`)
                    .then((res) => res.json())
                    .then((data) => {
                        cacheRef.current.set(searchQuery, data.suggestions || []);
                        setSuggestions(data.suggestions || []);
                        setIsDropdownOpen(true);
                    })
                    .catch(() => {
                        setSuggestions([]);
                        setIsDropdownOpen(false);
                    });
            }
        }, 200);

        return () => clearTimeout(handler);
    }, [searchQuery, isSelectingSuggestion]);

    useEffect(() => {
        if (searchQuery === '') {
            setIsSelectingSuggestion(false);
        }
    }, [searchQuery]);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/stock/${searchQuery}`);

            // Check if the response is successful (status 200-299)
            if (!response.ok) {
                const errorData = await response.json(); // Parse the error body
                setError(errorData?.message || 'Failed to fetch inventory');
                return;
            }

            const data: InventoryItem[] = await response.json();
            setInventory(data);
        } catch (err) {
            setError(`Failed to fetch inventory: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Stock Check</h1>

            <div className="relative mb-4 w-full max-w-md mx-auto">
                <input
                    type="text"
                    value={searchQuery.trim()}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter inventory code..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />

                {isDropdownOpen && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="p-3 text-gray-700 cursor-pointer hover:bg-blue-100 transition"
                                onClick={() => {
                                    setSearchQuery(suggestion.InventoryID);
                                    setSuggestions([]);
                                    setIsDropdownOpen(false);
                                    setIsSelectingSuggestion(true);
                                }}
                            >
                                <span className="font-semibold">{suggestion.InventoryID}</span> - {suggestion.ItemDescription}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative mb-4 w-full max-w-md mx-auto">
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full py-3 px-6 text-white bg-[var(--customBlue)] rounded-lg hover:bg-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {inventory && inventory.length > 0 ? (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Inventory Results:</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-separate border border-gray-300 rounded-lg">
                            <thead className="bg-gray-300 text-gray-700">
                                <tr>
                                    <th className="p-3 border-b">Branch</th>
                                    <th className="p-3 border-b">Inventory ID</th>
                                    <th className="p-3 border-b">Description</th>
                                    <th className="p-3 border-b">Qty On Hand</th>
                                    <th className="p-3 border-b">Qty Available</th>
                                    <th className="p-3 border-b">Warehouse ID</th>
                                    <th className="p-3 border-b">Location ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`border-t hover:bg-gray-50 ${index % 2 === 1 ? 'bg-white' : 'bg-gray-200'}`}
                                    >
                                        <td className="p-3">{item.Branch.trim()}</td>
                                        <td className="p-3">{item.InventoryID.trim()}</td>
                                        <td className="p-3">{item.Description}</td>
                                        <td className="p-3 text-right">{parseFloat(item.QtyOnHand).toFixed(2)}</td>
                                        <td className="p-3 text-right">{parseFloat(item.QtyAvailable).toFixed(2)}</td>
                                        <td className="p-3">{item.WarehouseID.trim()}</td>
                                        <td className="p-3">{item.LocationID ? item.LocationID.trim() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                inventory && <p className="mt-4 text-gray-600">No results found.</p>
            )}
        </div>
    );
};

export default Stock;
