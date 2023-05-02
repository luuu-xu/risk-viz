import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { CsvRecord } from '@/app/types';

function addVarianceToData(data: CsvRecord[], variance: number): CsvRecord[] {
  return data.map((dataPoint: CsvRecord) => ({
    ...dataPoint,
    lat: dataPoint.lat + (Math.random() * 2 - 1) * variance,
    long: dataPoint.long + (Math.random() * 2 - 1) * variance
  }));
}

export async function GET(request: Request) {
  const fileContents = await fs.readFile(path.join(process.cwd(), 'src/data/sample_data.json'), 'utf8');
  const modifiedDataArray = addVarianceToData(JSON.parse(fileContents), Number(process.env.DATA_VARIANCE));
  return NextResponse.json(modifiedDataArray);
}