"use client";

import { CsvRecord, BoundsLatLng } from '../../app/types';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MarkerCluster from './markerCluster';

export default function Map({ 
  data,
  setBoundsLatLng
}: { 
  data: CsvRecord[],
  setBoundsLatLng: React.Dispatch<BoundsLatLng>
}): JSX.Element {

  console.log("map:", data);

  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const initialCenter = {
    lat: 43.664474,
    lng: -79.392398
  } as google.maps.LatLngLiteral;

  const initialZoom = 4 as number;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = React.useState<null | google.maps.Map>(null);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    map.setCenter(initialCenter);
    map.setZoom(initialZoom);
    setMap(map);
  }, [])

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, [])

  const onBoundsChanged = () => {
    const mapsBounds = map?.getBounds()?.toJSON();
    const boundsLatLng : BoundsLatLng = {
      north: Number(mapsBounds?.north),
      south: Number(mapsBounds?.south),
      west: Number(mapsBounds?.west),
      east: Number(mapsBounds?.east)
    };
    setBoundsLatLng(boundsLatLng);
  }

  if (loadError) {
    return <div>Error loading Google Maps...</div>
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      // center={initialCenter}
      // zoom={initialZoom}
      onBoundsChanged={onBoundsChanged}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <MarkerCluster data={data} />
    </GoogleMap>
  ) : 
    <div className='h-100 w-100 d-grid justify-center items-center'>
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
}