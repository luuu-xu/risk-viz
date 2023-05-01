import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { NextResponse } from 'next/server';
import { CsvRecord } from '@/app/types';

async function parseCsvData(): Promise<CsvRecord[]> {
  const csvData = await loadSampleData();
  const result = parse(csvData, {
    from: 2,
    cast: (value, context) => {
      if (context.header) return null;
      if (context.column === 'assetName') return String(value);
      if (context.column === 'businessCategory') return String(value);
      if (context.column === 'riskFactors') return String(value);
      return Number(value);
    },
    columns: ['assetName', 'lat', 'long', 'businessCategory', 'riskRating', 'riskFactors', 'year'],
    skip_empty_lines: true,
  });
  return result;
}

async function loadSampleData(): Promise<string> {
  const csvData = await fs.promises.readFile(
    path.join(process.cwd(), 'src/data/sample_data.csv'),
    'utf-8'
  );
  return csvData;
}

function addVarianceToData(data: CsvRecord[], variance: number): CsvRecord[] {
  return data.map((dataPoint: CsvRecord) => ({
    ...dataPoint,
    lat: dataPoint.lat + (Math.random() * 2 - 1) * variance,
    long: dataPoint.long + (Math.random() * 2 - 1) * variance
  }));
}

export async function GET(request: Request): Promise<Response> {
  let dataArray = await parseCsvData();
  dataArray = dataArray.map((data: CsvRecord) => {
    return {
      ...data,
      // riskFactors: JSON.parse(data.riskFactors),
      riskFactors: Object.entries(JSON.parse(data.riskFactors)).map(([key, value]) => `${key}: ${value}`).join(', '),
      // riskFactors: data.riskFactors.toString(),
    };
  });
  
  // Adding random variation to the latitude and longitude of each asset
  const modifiedDataArray = addVarianceToData(dataArray, Number(process.env.DATA_VARIANCE));

  return NextResponse.json(modifiedDataArray);
}