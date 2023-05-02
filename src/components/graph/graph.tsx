"use client";

import { CsvRecord, BoundsLatLng } from "../../app/types";
import { Chart, registerables } from 'chart.js';
import { useState, useEffect } from "react";
Chart.register(...registerables);
import { Chart as ChartReact } from "react-chartjs-2";
import { getRiskGradient } from "../../app/lib/riskColor";
import { filterAndSortData } from '../../app/lib/filterData';
import { makeBarData, makeLineData, BarData, LineData } from './makeGraphData';

export default function Graph({ 
  data, 
  assetName, 
  category, 
  riskFactor, 
  boundsLatLng
} : {
  data: CsvRecord[], 
  assetName: string, 
  category: string, 
  riskFactor: string,
  boundsLatLng: BoundsLatLng
}) : JSX.Element {

  console.log('graph:', data.length);

  const [barData, setBarData] = useState<BarData[]>([]);
  const [lineData, setLineData] = useState<LineData[]>([]);

  useEffect(() => {
    const newBarData = makeBarData(filterAndSortData(data, assetName, category, riskFactor, boundsLatLng));
    const newLineData = makeLineData(filterAndSortData(data, assetName, category, riskFactor, boundsLatLng));
    setBarData(newBarData);
    setLineData(newLineData);
  }, [assetName, category, riskFactor, boundsLatLng]);

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
  return getRiskGradient(ctx, chartArea.bottom, chartArea.top);
}