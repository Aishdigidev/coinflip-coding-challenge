"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AssetHistoryResponse,
  AssetResponse,
  getAsset,
  getAssetHistory,
} from "@/lib/api";

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type RealTimePrices = Record<string, string>;

export default function AssetPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [asset, setAsset] = useState<AssetResponse>();
  const [priceHistory, setPriceHistory] = useState<AssetHistoryResponse>();
  const [realTimePrices, setRealTimePrices] = useState<RealTimePrices>({});

  // Prepare data for the chart
  const chartData = {
    labels: priceHistory?.data.map((item) =>
      new Date(item.time).toLocaleDateString()
    ), // Dates
    datasets: [
      {
        label: "Price (USD)",
        data: priceHistory?.data.map((item) => parseFloat(item.priceUsd)), // Prices
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Curve the line
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        beginAtZero: false,
      },
    },
  };

  useEffect(() => {
    // Unwrap params
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };

    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (params?.id) {
      const fetchData = async () => {
        try {
          setAsset(await getAsset(params.id));
          setPriceHistory(await getAssetHistory(params.id));
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };

      fetchData();

      const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
      ws.onmessage = (event) => {
        const updatedPrices = JSON.parse(event.data);
        setRealTimePrices((prev) => ({ ...prev, ...updatedPrices }));
      };

      return () => {
        ws.close(); // Cleanup WebSocket on component unmount
      };
    }
  }, [params]);

  if (!params || !asset || priceHistory?.data.length === 0) {
    return (
      <main className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Asset Details</h1>
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mx-auto text-gray-200 animate-spin fill-blue-600"
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

  return (
    <main className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Asset Details</h1>
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{asset.data.name}</h2>
        <p className="text-gray-500">Symbol: {asset.data.symbol}</p>
        <p className="text-gray-500">Rank: {asset.data.rank}</p>
        <div className="flex items-center gap-1">
          <div
            className={`text-${
              realTimePrices[asset.data.id] > asset.data.priceUsd
                ? "green"
                : "red"
            }-600`}
          >
            Price: $
            {realTimePrices[asset.data.id]
              ? parseFloat(realTimePrices[asset.data.id]).toFixed(2)
              : parseFloat(asset.data.priceUsd).toFixed(2)}{" "}
          </div>
          {realTimePrices[asset.data.id] > asset.data.priceUsd ? (
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
        <p className="text-gray-500">
          Market Cap: ${parseFloat(asset.data.marketCapUsd).toLocaleString()}
        </p>
      </div>

      {/* Price History Chart */}
      <div className="mt-8">
        <h3 className="text-lg text-center font-bold mb-4">Price History</h3>
        <div className="w-full h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
}
