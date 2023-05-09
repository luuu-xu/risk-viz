export const getBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? `https://risk-viz-inky.vercel.app`
    : `http://localhost:${process.env.PORT ?? 3033}`;