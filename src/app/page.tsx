"use client";

import { CsvRecord } from './types';
import React, { use, useEffect } from 'react'
import DecadeSlider from './map/decadeSlider';
import TableFilter from './table/tableFilter';
import MapComponent from './map/mapComponent';
import Graph from './graph/graph';

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

export default function Home() {
  const data = use(dataPromise);
  const decades = getDecadesFromCsvData(data);
  const [decadeIndex, setDecadeIndex] = React.useState<number>(0);
  const [decadeData, setDecadeData] = React.useState<CsvRecord[]>([]);
  const [assetName, setAssetName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [riskFactor, setRiskFactor] = React.useState<string>("");

  useEffect(() => {
     setDecadeData(data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex)));
  }, [decadeIndex]);

  return (
    <main className='h-screen w-screen'>
      <div className='h-1/2 d-flex flex-col'>
        <MapComponent data={decadeData} />
        <DecadeSlider decadeIndex={decadeIndex} setDecadeIndex={setDecadeIndex} decades={decades} />
      </div>
      <div className='d-flex flex-row w-100'>
        <div className='basis-1/2'>
          <TableFilter 
            data={decadeData}
            assetName={assetName}
            category={category}
            riskFactor={riskFactor}
            setAssetName={setAssetName} 
            setCategory={setCategory} 
            setRiskFactor={setRiskFactor}
          />
        </div>
        <div className='basis-1/2'>
          <Graph
            data={data} 
            assetName={assetName} 
            category={category} 
            riskFactor={riskFactor}
          />
        </div>
      </div>
      {/* <Link href="map">Map</Link>
      <Link href="table">Table</Link>
      <Link href="graph">Graph</Link> */}
    </main>
  );
}
