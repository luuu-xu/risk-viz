"use client";

import { CsvRecord } from '../types';
import React, { use, useEffect } from 'react'
import DecadeSlider from '../map/decadeSlider';
import Graph from './graph';

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

export default function GraphPage(): JSX.Element {
  const data = use(dataPromise);
  const decades = getDecadesFromCsvData(data);
  const [decadeIndex, setDecadeIndex] = React.useState<number>(0);
  const [decadeData, setDecadeData] = React.useState<CsvRecord[] | []>([]);

  useEffect(() => {
     setDecadeData(data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex)));
  }, [decadeIndex]);

  return (
    <>
      <DecadeSlider decadeIndex={decadeIndex} setDecadeIndex={setDecadeIndex} decades={decades} />
      <Graph data={data} />
    </>
  )
}