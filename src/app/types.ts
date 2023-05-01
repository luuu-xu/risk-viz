export interface CsvRecord {
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: string;
  year: number;
}

export type BoundsLatLng = {
  north: number,
  south: number,
  west: number
  east: number,
};