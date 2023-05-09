import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { NextResponse } from 'next/server';
import { CsvRecord } from '@/app/types';
import { addVarianceToData } from '@/app/lib/addVarianceToData';

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
  console.log(path.join(process.cwd(), 'src/data/sample_data.csv'));
  const csvData = await fs.promises.readFile(
    path.join(process.cwd(), 'src/data/sample_data.csv'),
    'utf-8'
  );
  return csvData;
}

export async function GET(request: Request): Promise<Response> {
  // console.log('host: ', request.headers.get('host'));
  let dataArray = await parseCsvData();
  // console.log(dataArray);
  dataArray = dataArray.map((data: CsvRecord) => {
    return {
      ...data,
      // riskFactors: Object.entries(JSON.parse(data.riskFactors)).map(([key, value]) => `${key}: ${value}`).join(', '),
      riskFactors: data.riskFactors.replace(/[\{\}\"]/g, '').replace(/:/g, ':').replace(/,/g, ',')
    };
  });
  
  // Adding random variation to the latitude and longitude of each asset
  const modifiedDataArray = addVarianceToData(dataArray, Number(process.env.DATA_VARIANCE));

  return NextResponse.json(modifiedDataArray);
}