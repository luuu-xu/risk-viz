import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { addVarianceToData } from '@/app/lib/addVarianceToData';

export async function GET(request: Request) {
  const fileContents = await fs.readFile(path.join(process.cwd(), 'src/data/sample_data.json'), 'utf8');
  const modifiedDataArray = addVarianceToData(JSON.parse(fileContents), Number(process.env.DATA_VARIANCE));
  return NextResponse.json(modifiedDataArray);
}