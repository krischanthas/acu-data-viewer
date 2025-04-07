'use client';

import React, { useState, useEffect, useRef } from 'react';

// Updated Type for the inventory data
type InventoryItem = {
    id: string;
    rowNumber: number;
    note: string | null;
    BaseUOM?: { value?: string };
    EstimatedTotalCost?: { value?: number };
    EstimatedUnitCost?: { value?: number };
    ExpirationDate?: { value?: string };
    LocationID?: { value?: string };
    LotSerialNbr?: { value?: string };
    QtyAvailable?: { value?: string };
    QtyAvailableForShipment?: { value?: string };
    QtyNotAvailable?: { value?: string };
    QtyOnHand?: { value?: string };
    WarehouseID?: { value?: string };
    custom: Record<string, unknown>; // Use unknown instead of any
};

const InventorySummary = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [, setInventory] = useState<InventoryItem[] | null>(null);
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
        }, 300);

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
            const response = await fetch(`/api/testCache?search=${searchQuery}`);
            const data: InventoryItem[] = await response.json();

            if (response.ok) {
                setInventory(data);
            } else {
                setError('Failed to fetch inventory');
            }
        } catch (err) {
            setError(`Failed to fetch inventory: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Test Caching</h1>

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


        </div>
    );
};

export default InventorySummary;
