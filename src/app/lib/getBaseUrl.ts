export const getBaseUrl = () =>
  process.env.VERCEL_URL
    ? `https://risk-viz-inky.vercel.app`
    : `http://localhost:${process.env.PORT ?? 3033}`;