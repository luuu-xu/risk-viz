export interface CsvRecord {
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskRating: number;
  // riskFactors: {[key: string]: number}[];
  riskFactors: string;
  year: number;
}