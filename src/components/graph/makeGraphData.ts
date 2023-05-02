import { CsvRecord } from "../../app/types";

export type BarData = {
  year: number;
  riskRatings: number[];
}

export type LineData = {
  year: number;
  averageRiskRating: number;
}

export function makeBarData(data: CsvRecord[]): BarData[] {
  const groups = data.reduce((acc : any, obj) => {
    const { year, riskRating } = obj;
    if (acc[year]) {
      acc[year].push(riskRating);
    } else {
      acc[year] = [riskRating];
    }
    return acc;
  }, {});

  return Object.keys(groups).map((year) => ({
    year: Number(year),
    riskRatings: [Math.min(...groups[year]), Math.max(...groups[year])]
  }));
}

export function makeLineData(data: CsvRecord[]): LineData[] {
  const groups = data.reduce((acc : any, obj) => {
    const { year, riskRating } = obj;
    if (acc[year]) {
      acc[year].push(riskRating);
    } else {
      acc[year] = [riskRating];
    }
    return acc;
  }, {});

  return Object.keys(groups).map((year) => ({
    year: Number(year),
    averageRiskRating: [...groups[year]].reduce((acc, num) => acc + num, 0) / groups[year].length,
  }));
}