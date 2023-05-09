"use client";

import { CsvRecord } from './types';
import { use, useEffect, useState, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import DecadeSlider from '../components/decadeSlider/decadeSlider';
import Table from '../components/table/table';
import Map from '../components/map/map';
import Graph from '../components/graph/graph';
import { filterData } from './lib/filterData';
import { fetchData, fetchJSONData, getDecadesFromData } from './api/get-csv-data/getData';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetDataQuery } from '@/redux/services/dataApi';

// const dataPromise = fetchData();
// const dataPromise = fetchJSONData();

export default function Home() {
  // const data = use(dataPromise);
  // const data = fetchJSONData();

  const { data, isLoading, isSuccess, isError, error } = useGetDataQuery(null);

  const mapBounds = useAppSelector((state) => state.mapBoundsReducer.value);
  const { assetName, category, riskFactor } = useAppSelector((state) => state.filtersReducer.value);
  const decadeIndex = useAppSelector((state) => state.decadeIndexReducer.value);

  let decadeData: CsvRecord[] = [];
  let decades : number[] = [];

  if (isLoading) {
    return (
      <div className='h-100 w-100 d-grid justify-center items-center'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  } else if (isError) {
    return <div>Error: {error.toString()}</div>;
  } else if (isSuccess) {
    decades = getDecadesFromData(data);
    const newDecadeData = data.filter((dataPoint: CsvRecord) => dataPoint.year === decades.at(decadeIndex));
    decadeData = filterData(newDecadeData, assetName, category, riskFactor, mapBounds);
  }

  return (
    <>
      <div className='h-96 lg:h-1/2 w-full px-3'>
        <div className='h-full flex flex-col bg-white shadow rounded'>
          <Map
            data={decadeData}
          />
          <DecadeSlider 
            decades={decades} 
          />
        </div>
      </div>
      <div className='lg:h-1/2 w-full flex flex-col lg:flex-row gap-3 px-3 overflow-auto'>
        <div className='lg:order-last lg:basis-1/3 bg-white rounded shadow p-3'>
          <Graph
            data={data}
          />
        </div>
        <div className='lg:basis-2/3 h-full overflow-auto bg-white rounded shadow p-3 pt-0'>
          <Table
            data={decadeData}
          />
        </div>
      </div>
    </>
  );
}
