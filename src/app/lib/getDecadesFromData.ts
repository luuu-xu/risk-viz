import { CsvRecord } from '@/app/types';

export function getDecadesFromData(
  data: CsvRecord[] | undefined
): number[] {
  if (!data) {
    return [];
  }
  const decades = data
    .map((dataPoint : CsvRecord) => dataPoint.year)
    .filter((year: number, index: number, self: any) => self.indexOf(year) === index)
    .sort((a: number, b: number) => a - b);
    return decades;
}