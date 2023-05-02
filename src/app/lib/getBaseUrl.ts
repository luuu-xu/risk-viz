import { cache } from 'react';

export const getBaseUrl = cache(() =>
  process.env.VERCEL_URL
    ? `https://risk-265sd3h5p-luuu-xu.vercel.app`
    : `http://localhost:${process.env.PORT ?? 3033}`,
);