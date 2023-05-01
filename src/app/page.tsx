"use client";

import { CsvRecord } from './types';
import React, { use, useEffect } from 'react'
import DecadeSlider from './map/decadeSlider';
import TableFilter from './table/tableFilter';
import MapComponent from './map/mapComponent';
import Graph from './graph/graph';
import { filterData } from './lib/filterData';

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
    const newDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));
    const newFilteredDecadeData = filterData(newDecadeData, assetName, category, riskFactor);
    setDecadeData(newFilteredDecadeData);
  }, [decadeIndex, assetName, category, riskFactor]);

  return (
    <>
      <div className='h-1/2 w-100 mb-4 px-4'>
        <div className='h-100 d-flex flex-col bg-white shadow rounded'>
          <MapComponent data={decadeData} />
          <DecadeSlider decadeIndex={decadeIndex} setDecadeIndex={setDecadeIndex} decades={decades} />
        </div>
      </div>
      <div className='h-1/2 w-100 d-flex flex-row gap-4 px-4 mb-4'>
        <div className='basis-2/3 h-100 overflow-auto bg-white rounded shadow p-4 pt-0'>
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
        <div className='basis-1/3 bg-white rounded shadow p-4'>
          <Graph
            data={data}
            assetName={assetName} 
            category={category} 
            riskFactor={riskFactor}
          />
        </div>
      </div>
    </>
  );
}
