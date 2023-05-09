import { getBaseUrl } from '@/app/lib/getBaseUrl';

export async function fetchJSONData() {
  const res = await fetch(`${getBaseUrl()}/api/get-json-data`);
  // const res = await fetch(`https://risk-viz-inky.vercel.app/api/get-json-data`);
  return res.json();
}