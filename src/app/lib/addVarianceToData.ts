import { CsvRecord } from '@/app/types';

export function addVarianceToData(data: CsvRecord[], variance: number): CsvRecord[] {
  return data.map((dataPoint: CsvRecord) => ({
    ...dataPoint,
    lat: dataPoint.lat + (Math.random() * 2 - 1) * variance,
    long: dataPoint.long + (Math.random() * 2 - 1) * variance
  }));
}