import { CsvRecord } from '../types';

export function filterData(
  data: CsvRecord[], assetName: string, category: string, riskFactor: string
): CsvRecord[] {
  return data.filter((dataPoint: CsvRecord) => {
    const assetNameMatch = !assetName || dataPoint.assetName === assetName;
    const categoryMatch = !category || dataPoint.businessCategory === category;
    const riskFactorMatch = !riskFactor || dataPoint.riskFactors.includes(riskFactor);
    return assetNameMatch && categoryMatch && riskFactorMatch;
  });
}

export function sortYearAscending(data: CsvRecord[]): CsvRecord[] {
  return data.sort((a: CsvRecord, b: CsvRecord) => a.year - b.year);
}

export function filterAndSortData(
  data: CsvRecord[], assetName: string, category: string, riskFactor: string
): CsvRecord[] 
  {
  const filteredData = filterData(data, assetName, category, riskFactor);
  return sortYearAscending(filteredData);
}