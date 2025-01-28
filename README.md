# Crypto Rates Challenge

A take-home coding challenge to build a cryptocurrency rate viewer using Next.js and the CoinCap API.

> **Time Expectation**: Please spend no more than 4-5 hours on this assignment. Focus on implementing the core requirements first, then add bonus features if time permits.

## Challenge Requirements

Build a web application that:
1. Displays a list of cryptocurrency rates
2. Shows detailed information for individual cryptocurrencies
3. Handles loading and error states appropriately
4. Bonus: Implements real-time price updates

### Required Features

#### List View (`/rates`)
- Display a grid of cryptocurrencies showing:
  - Rank
  - Name
  - Symbol
  - Current price in USD
  - Icon (use something like [cryptocurrency-icons](https://github.com/spothq/cryptocurrency-icons))
- Make each item clickable to navigate to its detail page
- Bonus: Implement real-time price updates using WebSocket

#### Detail View (`/rates/[id]`)
- Show comprehensive information about the selected cryptocurrency
- Display a price history chart
- Bonus: Implement real-time price updates for the selected asset  using WebSocket

## Getting Started

1. Clone this repository
2. Install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the starter template

## API Information

### REST Endpoints
- Base URL: `https://api.coincap.io/v2`
- List all assets: `GET /assets`
- Get single asset: `GET /assets/{id}`
- Get asset history: `GET /assets/{id}/history`



## Project Structure

- `app/page.tsx` - Landing page with challenge instructions
- `app/rates/page.tsx` - Implement the rates list view here
- `app/rates/[id]/page.tsx` - Implement the detail view here
- `lib/api.ts` - Add your API utilities here

## Evaluation Criteria

Your submission will be evaluated on:
1. **Functionality** - Does it meet all the requirements?
2. **Code Quality** - Is the code clean, well-organized, and maintainable?
3. **Error Handling** - How well does it handle edge cases and errors?
4. **Performance** - Are there any obvious performance issues? Are the API's properly cached?
5. **UI/UX** - Is the interface intuitive and responsive?

## Technical Requirements

- Use Next.js 14 with App Router
- Implement TypeScript
- Style with any modern styling library (Tailwind, Chakra, Material-UI)
- Use any charting library you prefer (Recharts, chartjs, etc)
- Handle loading and error states
- Add proper TypeScript types for all data structures

## Bonus Points

- Implement WebSocket connection for real-time updates
- Add price change indicators (up/down arrows, colors)
- Implement client-side search/filtering

### WebSocket API
As an optional bonus: Connect to CoinCap's WebSocket for real-time price updates:

```typescript
// For all assets
const ws = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

// For specific assets
const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');
```

WebSocket data format:
```typescript
{
  "bitcoin": "28000.00",
  "ethereum": "1800.00"
  // ... more assets
}
```

## Submission

1. Implement your solution
2. Add clear documentation on how to run the code
4. Either share a zip file (with node_modules removed) or the repository link

## Development Tips

- Use Next.js's built-in loading and error states
- Implement proper cleanup for WebSocket connections
- Consider using SWR or React Query for data fetching
- Use TypeScript strictly to catch potential errors
- Follow React best practices and hooks guidelines