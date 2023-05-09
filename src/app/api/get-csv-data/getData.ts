import { getBaseUrl } from '@/app/lib/getBaseUrl';

export async function fetchData() {
  // console.log(`${getBaseUrl()}/api/get-csv-data`);
  const res = await fetch(`${getBaseUrl()}/api/get-csv-data`);
  return res.json();
}