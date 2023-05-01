import { GoogleMap, InfoWindowF, MarkerClustererF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { CsvRecord } from '../types';
import { getRiskColor } from '../lib/riskColor';

export default function MapComponent({ data }: { data: CsvRecord[] | [] }): JSX.Element {
  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const initialCenter = {
    lat: 43.664474,
    lng: -79.392398
  } as google.maps.LatLngLiteral;

  const initialZoom = 7 as number;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  // const [map, setMap] = React.useState(null)
  const [mapCenter, setMapCenter] = React.useState(initialCenter as google.maps.LatLngLiteral);

  // const onLoad = React.useCallback(function callback(map: google.maps.Map) {
  //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
  //   // const bounds = new window.google.maps.LatLngBounds(center);
  //   // map.fitBounds(bounds);
  //   // setMapCenter(map.getCenter());
  //   // setMap(map);
  // }, [])

  // const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
  //   setMapCenter(map.getCenter() as any);
  //   // setMap(null);
  // }, [])

  if (loadError) {
    return <div>Error loading Google Maps...</div>
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={initialZoom}
      // onLoad={onLoad}
      // onUnmount={onUnmount}
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

function MarkerCluster({ data }: { data: CsvRecord[] | [] }): JSX.Element {
  const mcOptions = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    minimumClusterSize: 10
  }

  return (
    <MarkerClustererF
      options={mcOptions}
    >
      {(clusterer): any =>
        data.map((dataPoint: CsvRecord, index): JSX.Element => {
          return (
            <Marker 
              key={dataPoint.lat + dataPoint.long + index} 
              dataPoint={dataPoint} 
              clusterer={clusterer} 
            />
          );
        })
      }
    </MarkerClustererF>
  )
}

function Marker({ dataPoint, clusterer }:{ dataPoint: CsvRecord, clusterer: any }): JSX.Element {
  const [showInfoWindow, setShowInfoWindow] = React.useState(false);

  const markerPosition = {
    lat: dataPoint.lat,
    lng: dataPoint.long
  }
  const markerIconColour = getRiskColor(dataPoint.riskRating);

  return (
    <MarkerF 
      key={markerPosition.lat + markerPosition.lng} 
      position={markerPosition} 
      clusterer={clusterer}
      icon={
        {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: markerIconColour,
          scale: 3,
          strokeWeight: 15,
        }
      }
      onMouseOver={() => {
        setShowInfoWindow(true);
      }}
      onMouseOut={() => {
        setShowInfoWindow(false);
      }}
    >
      {showInfoWindow && <InfoWindowF
        position={markerPosition}
      >
        <>
          <div><b>{dataPoint.assetName}</b></div>
          <div>{dataPoint.businessCategory}</div>
        </>
      </InfoWindowF>}
    </MarkerF>
  );
}