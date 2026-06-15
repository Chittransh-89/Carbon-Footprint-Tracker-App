This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

1. IPCC AR6 Report (2023)
   - Transport emissions

2. India Central Electricity Authority
   - Grid factor: 0.7-0.82 kg CO2/kWh

3. EPA Greenhouse Gas Equivalencies
   - Vehicle emissions

4. Our World in Data (Hannah Ritchie)
   - Food carbon footprint
   - https://ourworldindata.org/carbon-footprint-food-methane

5. DEFRA UK Conversion Factors
   - Standard reference for businesses

6. Indian Ministry of Environment
   - LPG cylinder emissions

## Data Sources
- IPCC AR6 Climate Report (2023)
- India Central Electricity Authority
- EPA Greenhouse Gas Equivalencies
- DEFRA UK Conversion Factors
- Our World in Data

## Flight Emissions
All flight emissions are calculated PER SINGLE TRIP using:
- Domestic average: 1000 km × 0.255 kg/km = 255 kg
- International average: 3000 km × 0.195 kg/km = 585 kg