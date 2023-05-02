import { getBaseUrl } from '@/app/lib/getBaseUrl';
import { CsvRecord } from '@/app/types';
import sample_data from '@/data/sample_data.json';

export async function fetchData() {
  // console.log(`${getBaseUrl()}/api/get-csv-data`);
  const res = await fetch(`${getBaseUrl()}/api/get-csv-data`);
  return res.json();
}

export function getDecadesFromData(data: CsvRecord[]): number[] {
  const decades = data
    .map((dataPoint : CsvRecord) => dataPoint.year)
    .filter((year: number, index: number, self: any) => self.indexOf(year) === index)
    .sort((a: number, b: number) => a - b);
  return decades;
}

export async function fetchJSONData() {
  // console.log(`${getBaseUrl()}/api/get-json-data`);
  const res = await fetch(`https://risk-viz-inky.vercel.app/api/get-json-data`, { cache: 'no-store' });
  return res.json();
}