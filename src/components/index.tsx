import { CsvRecord, BoundsLatLng } from '../app/types';
import React from 'react'
import DecadeSlider from './decadeSlider/decadeSlider';
import TableFilter from './table/tableFilter';
import Map from './map/map';
import Graph from './graph/graph';
import { filterData } from '../app/lib/filterData';
import { fetchData, fetchJSONData, getDecadesFromData } from '../app/api/get-csv-data/getData';
import data from '../data/sample_data.json';

// const dataPromise = fetchData();
// const dataPromise = fetchJSONData();

export default function Home() {
  // const data = React.use(dataPromise);
  // const data = fetchJSONData();

  console.log('homepage:', data.length);

  const decades = getDecadesFromData(data);
  const [decadeIndex, setDecadeIndex] = React.useState<number>(0);
  const [decadeData, setDecadeData] = React.useState<CsvRecord[]>([]);
  const [assetName, setAssetName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [riskFactor, setRiskFactor] = React.useState<string>("");
  const [boundsLatLng, setBoundsLatLng] = React.useState<BoundsLatLng | any>({});

  React.useEffect(() => {
    const newDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));
    const newFilteredDecadeData = filterData(newDecadeData, assetName, category, riskFactor, boundsLatLng);
    setDecadeData(newFilteredDecadeData);
  }, [decadeIndex, assetName, category, riskFactor, boundsLatLng]);

  return (
    <>
      <div className='h-1/2 w-100 mb-3 px-3'>
        <div className='h-100 d-flex flex-col bg-white shadow rounded'>
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
