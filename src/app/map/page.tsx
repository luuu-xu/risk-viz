"use client";

import React, { use, useEffect } from 'react'
import MapComponent from './mapComponent';
import DecadeSlider from './decadeSlider';
import { CsvRecord } from '../types';

async function fetchData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-csv-data`);
  return res.json();
}

function getDecadesFromCsvData(data: CsvRecord[]): number[] {
  const decades = data
    .map((dataPoint : CsvRecord) => dataPoint.year)
    .filter((year: number, index: number, self: any) => self.indexOf(year) === index)
    .sort((a: number, b: number) => a - b);
  return decades;
}

const dataPromise = fetchData();

export default function MapPage() {
  // const fetchedData = await fetchData();
  const data = use(dataPromise);
  const decades = getDecadesFromCsvData(data);
  const [decadeIndex, setDecadeIndex] = React.useState<number>(0);
  const [decadeData, setDecadeData] = React.useState<CsvRecord[] | []>([]);

  useEffect(() => {
     setDecadeData(data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex)));
  }, [decadeIndex]);

  return (
    <main className="h-screen w-screen d-flex flex-col">
      <DecadeSlider decadeIndex={decadeIndex} setDecadeIndex={setDecadeIndex} decades={decades} />
      <MapComponent data={decadeData} />
    </main>
  );
}
