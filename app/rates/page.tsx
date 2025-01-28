"use client";

import { useEffect, useState } from "react";
import { CryptoIcon } from "@ledgerhq/crypto-icons";
import { Asset, getAssets } from "@/lib/api";
import Link from "next/link";

type RealTimePrices = Record<string, string>;

export default function RatesPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>(""); // Search state
  const [realTimePrices, setRealTimePrices] = useState<RealTimePrices>({});
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const fetchData = async () => {
    try {
      const data = await getAssets();
      setAssets(data.data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError("Failed to fetch assets. Please try again later.");
    } finally {
      setLoading(false); // Stop loading spinner once fetch is complete
    }
  };

  useEffect(() => {
    fetchData();

    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
    ws.onmessage = (event) => {
      try {
        const updatedPrices = JSON.parse(event.data);
        setRealTimePrices((prev) => ({ ...prev, ...updatedPrices }));
      } catch (err) {
        console.error("Failed to process WebSocket message:", err);
      }
    };

    ws.onerror = () => {
      console.error("WebSocket connection error.");
    };

    ws.onclose = () => {
      console.warn("WebSocket connection closed.");
    };

    return () => {
      ws.close(); // Cleanup WebSocket on component unmount
    };
  }, []);

  if (loading) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Crypto Rates</h1>
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Crypto Rates</h1>
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  // Filter assets based on search input
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Crypto Rates</h1>
        <div>
          <input
            type="text"
            id="search"
            value={search} // Bind search state to input
            onChange={(e) => setSearch(e.target.value)} // Update search state
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Search by name or symbol."
            required
          />
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <Link key={asset.id} href={`/rates/${asset.id}`}>
            <div className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-1">
                <CryptoIcon
                  ledgerId={asset.id}
                  ticker={asset.symbol}
                  size="24px"
                />
                <div className="font-bold text-lg">{asset.name}</div>
              </div>
              <div className="text-gray-500 my-1">Rank: {asset.rank}</div>
              <div className="flex items-center gap-1">
                <div
                  className={`text-${
                    realTimePrices[asset.id] > asset.priceUsd ? "green" : "red"
                  }-600`}
                >
                  Price: $
                  {realTimePrices[asset.id]
                    ? parseFloat(realTimePrices[asset.id]).toFixed(2)
                    : parseFloat(asset.priceUsd).toFixed(2)}{" "}
                </div>
                {realTimePrices[asset.id] > asset.priceUsd ? (
                  <svg
                    className="w-3 h-3 text-green-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13V1m0 0L1 5m4-4 4 4"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5 text-red-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1v12m0 0 4-4m-4 4L1 9"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
