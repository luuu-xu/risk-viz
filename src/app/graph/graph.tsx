// "use client";

import { CsvRecord } from "../types";
import { Chart, ChartArea, registerables } from 'chart.js';
import React, { useEffect } from "react";
Chart.register(...registerables);
import { Chart as ChartReact } from "react-chartjs-2";

// function filterByAssetName(assetName: string, data: CsvRecord[]): CsvRecord[] {
//   if (assetName === undefined) {
//     return data;
//   }
//   return data.filter((dataPoint: CsvRecord) => dataPoint.assetName === assetName);
// }

// function filterByCategory(category: string, data: CsvRecord[]): CsvRecord[] {
//   if (category === undefined) {
//     return data;
//   }
//   return data.filter((dataPoint: CsvRecord) => dataPoint.businessCategory === category);
// }

// function filterByRiskFactor(riskFactor: string, data: CsvRecord[]): CsvRecord[] {
//   if (riskFactor === undefined || riskFactor === "") {
//     return data;
//   }
//   return data.filter((dataPoint: CsvRecord) => dataPoint.riskFactors.includes(riskFactor));
// }

function sortYearAscending(data: CsvRecord[]): CsvRecord[] {
  return data.sort((a: CsvRecord, b: CsvRecord) => a.year - b.year);
}

function filterData(
  data: CsvRecord[], assetName: string, category: string, riskFactor: string
): CsvRecord[] {
  return data.filter((dataPoint: CsvRecord) => {
    const assetNameMatch = !assetName || dataPoint.assetName === assetName;
    const categoryMatch = !category || dataPoint.businessCategory === category;
    const riskFactorMatch = !riskFactor || dataPoint.riskFactors.includes(riskFactor);
    return assetNameMatch && categoryMatch && riskFactorMatch;
  });
}

function filterAndSortData(
  data: CsvRecord[], assetName: string, category: string, riskFactor: string
): CsvRecord[] 
  {
  // return sortYearAscending(filterByAssetName(assetName, filterByCategory(category, filterByRiskFactor(riskFactor, data))));
  const filteredData = filterData(data, assetName, category, riskFactor);
  // console.log("filteredData", filteredData);
  return sortYearAscending(filteredData);
}

type BarData = {
  year: number;
  riskRatings: number[];
}

type LineData = {
  year: number;
  averageRiskRating: number;
}

function makeBarData(data: CsvRecord[]): BarData[] {
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

function makeLineData(data: CsvRecord[]): LineData[] {
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

export default function Graph({ 
  data, assetName, category, riskFactor
} : {
  data: CsvRecord[], 
  assetName: string, 
  category: string, 
  riskFactor: string 
}) : JSX.Element {
  const [barData, setBarData] = React.useState<BarData[]>([]);
  const [lineData, setLineData] = React.useState<LineData[]>([]);

  useEffect(() => {
    const newBarData = makeBarData(filterAndSortData(data, assetName, category, riskFactor));
    const newLineData = makeLineData(filterAndSortData(data, assetName, category, riskFactor));
    setBarData(newBarData);
    setLineData(newLineData);
  }, [assetName, category, riskFactor]);

  return (
    <ChartReact
      type="bar"
      data={{
        labels: lineData.map((dataPoint) => dataPoint.year),
        datasets: [
          {
            type: "line",
            label: "Average Risk Rating",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: lineData.map((dataPoint) => dataPoint.averageRiskRating),
          },
          {
            type: "bar",
            label: "Risk Ratings",
            minBarLength: 5,
            backgroundColor: (context: any) => barChartRiskGradient(context),
            data: barData.map((dataPoint) => dataPoint.riskRatings) as any,
          }
        ]
      }}
    />
  );
}

function barChartRiskGradient(context: any) {
  const chart: Chart = context.chart;
  const {ctx, chartArea} = chart;
  if (!chartArea) {
    // This case happens on initial chart load
    return;
  }
  return getGradient(ctx, chartArea);
}

function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, "#32C80A");
  gradient.addColorStop(0.5, "#F0F005");
  gradient.addColorStop(1, "#E10F0A");

  return gradient;
}