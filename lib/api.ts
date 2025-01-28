// TODO: Implement the following API functions:
// - getAssets(): Fetches list of assets from /assets endpoint
// - getAsset(id): Fetches single asset from /assets/{id} endpoint
// - getAssetHistory(id): Fetches price history from /assets/{id}/history endpoint

export type Asset = {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
};

export type AssetResponse = {
  data: Asset;
  timestamp: number;
};

export type AssetsResponse = {
  data: Asset[];
  timestamp: number;
};

export type AssetHistory = {
  priceUsd: string;
  time: number;
  date: string;
};

export type AssetHistoryResponse = {
  data: AssetHistory[];
  timestamp: number;
};

export const getAssets = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
  if (!response.ok) throw new Error("Failed to fetch assets.");

  const data: AssetsResponse = await response.json();
  return data;
};

export const getAsset = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch asset data.");
  const data: AssetResponse = await response.json();
  return data;
};

export const getAssetHistory = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${id}/history?interval=d1`
  );
  if (!response.ok) throw new Error("Failed to fetch asset price history.");
  const data: AssetHistoryResponse = await response.json();
  return data;
};
