import { CsvRecord } from '@/app/types';
import { getBaseUrl } from '@/app/lib/getBaseUrl';

export async function fetchJSONData() {
  const res = await fetch(`${getBaseUrl()}/api/get-json-data`);
  // const res = await fetch(`https://risk-viz-inky.vercel.app/api/get-json-data`);
  return res.json();
}

export function getDecadesFromData(data: CsvRecord[]): number[] {
  const decades = data
    .map((dataPoint : CsvRecord) => dataPoint.year)
    .filter((year: number, index: number, self: any) => self.indexOf(year) === index)
    .sort((a: number, b: number) => a - b);
  return decades;
}