# Climate Prediction

Climate Prediction is a lightweight web app I use to keep tabs on day-to-day conditions across India. It focuses on practical details - a clean search flow, an easy-to-read breakdown of today's weather, and a friendly look at what tomorrow may hold.

## What's inside

- City and PIN search with helpful suggestions pulled from an up-to-date list of Indian locations.
- A dynamic backdrop that reflects the current mood outside (clear skies, rain, clouds, or a quiet night).
- Current readings (temperature, humidity, wind, feels like) alongside a tomorrow preview with hourly trends.
- Responsive layout that stays readable on phones, tablets, and desktops.

## Getting started

1. Install dependencies
   `npm install`
2. Create a `.env.local` file and add your weather model key
   `GEMINI_API_KEY=your_key_here`
   The app uses this key to contact the hosted forecast model - keep it private and out of version control.
3. Start the development server
   `npm run dev`
4. Visit the printed URL (usually `http://localhost:5173`) and try searching for a city like `New Delhi` or `Pune`.

## Project structure

```
 App.tsx                // Page layout and screen state
 components/            // Reusable UI sections (background, search, tabs)
 services/              // Forecast service wrapper
 constants.ts           // City and PIN reference data
 types.ts               // Shared TypeScript types
 vite.config.ts         // Vite + React configuration
```

## Useful scripts

- `npm run dev` - launch the local dev server.
- `npm run build` - create a production build.
- `npm run preview` - serve the production build locally.

## Notes

- The UI currently requests forecasts directly from the model provider. For production use you may prefer a small proxy service so the key stays on the server.
- Feel free to swap in your own imagery or tweak the gradients in `DynamicBackground.tsx` to match your brand.
