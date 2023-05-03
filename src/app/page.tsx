"use client";

import { CsvRecord, BoundsLatLng } from './types';
import { use, useEffect, useState} from 'react'
import DecadeSlider from '../components/decadeSlider/decadeSlider';
import TableFilter from '../components/table/tableFilter';
import Map from '../components/map/map';
import Graph from '../components/graph/graph';
import { filterData } from './lib/filterData';
import { fetchData, fetchJSONData, getDecadesFromData } from './api/get-csv-data/getData';

// const dataPromise = fetchData();
const dataPromise = fetchJSONData();

export default function Home() {
  const data = use(dataPromise);
  // const data = fetchJSONData();

  console.log('homepage:', data.length);

  const decades = getDecadesFromData(data);
  const [decadeIndex, setDecadeIndex] = useState<number>(0);
  // const initialDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));
  // const [decadeData, setDecadeData] = useState<CsvRecord[]>(initialDecadeData);
  const [decadeData, setDecadeData] = useState<CsvRecord[]>([]);
  const [assetName, setAssetName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [riskFactor, setRiskFactor] = useState<string>("");
  const [boundsLatLng, setBoundsLatLng] = useState<BoundsLatLng | any>({});

  useEffect(() => {
    const initialDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));

    console.log('home initialDecadeData', initialDecadeData.length);
    setDecadeData(initialDecadeData);
  }, []);

  useEffect(() => {
    const newDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));
    const newFilteredDecadeData = filterData(newDecadeData, assetName, category, riskFactor, boundsLatLng);

    console.log('home newFitlteredDecadeData', newFilteredDecadeData.length);

    setDecadeData(newFilteredDecadeData);
  }, [decadeIndex, assetName, category, riskFactor, boundsLatLng]);

  return (
    <>
      <div className='h-1/2 w-100 mb-3 px-3'>
        <div className='h-100 d-flex flex-col bg-white shadow rounded'>
          {/* <div className='h-100 w-100'>
            <Map 
              data={decadeData}
              setBoundsLatLng={setBoundsLatLng}
            />
          </div> */}
          <Map 
            data={decadeData}
            setBoundsLatLng={setBoundsLatLng}
          />
          <DecadeSlider 
            decadeIndex={decadeIndex} 
            setDecadeIndex={setDecadeIndex} 
            decades={decades} />
        </div>
      </div>
      <div className='h-1/2 w-100 d-flex flex-row gap-3 px-3 mb-3'>
        <div className='basis-2/3 h-100 overflow-auto bg-white rounded shadow p-3 pt-0'>
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
        <div className='basis-1/3 bg-white rounded shadow p-3'>
          <Graph
            data={data}
            assetName={assetName} 
            category={category} 
            riskFactor={riskFactor}
            boundsLatLng={boundsLatLng}
          />
        </div>
      </div>
    </>
  );
}
