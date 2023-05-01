import { CsvRecord, BoundsLatLng } from '../types';

export function filterData(
  data: CsvRecord[], 
  assetName: string, 
  category: string, 
  riskFactor: string,
  boundsLatLng: BoundsLatLng
): CsvRecord[] {
  return data.filter((dataPoint: CsvRecord) => {
    const assetNameMatch = !assetName || dataPoint.assetName === assetName;
    const categoryMatch = !category || dataPoint.businessCategory === category;
    const riskFactorMatch = !riskFactor || dataPoint.riskFactors.includes(riskFactor);
    const boundsLatLngMatch = !boundsLatLng || 
      dataPoint.lat >= boundsLatLng.south && dataPoint.lat <= boundsLatLng.north && 
      dataPoint.long >= boundsLatLng.west && dataPoint.long <= boundsLatLng.east;
    return assetNameMatch && categoryMatch && riskFactorMatch && boundsLatLngMatch;
  });
}

export function sortYearAscending(data: CsvRecord[]): CsvRecord[] {
  return data.sort((a: CsvRecord, b: CsvRecord) => a.year - b.year);
}

export function filterAndSortData(
  data: CsvRecord[], 
  assetName: string, 
  category: string, 
  riskFactor: string,
  boundsLatLng: BoundsLatLng
): CsvRecord[] 
  {
  const filteredData = filterData(data, assetName, category, riskFactor, boundsLatLng);
  return sortYearAscending(filteredData);
}