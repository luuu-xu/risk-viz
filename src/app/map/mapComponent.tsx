import { GoogleMap, InfoWindowF, MarkerClustererF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { Spinner } from 'react-bootstrap';

interface CsvRecord {
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: string;
  year: number;
}

export default function MapComponent({ data }: { data: CsvRecord[] | [] }): JSX.Element {
  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const center = {
    lat: 43.664474,
    lng: -79.392398
  };

  const zoom = 4;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    // libraries: ["visualization"],
  });

  // const [map, setMap] = React.useState(null)
  const [mapCenter, setMapCenter] = React.useState(center as google.maps.LatLngLiteral);

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
      zoom={zoom}
      // onLoad={onLoad}
      // onUnmount={onUnmount}
    >
      <MarkerCluster data={data} />
    </GoogleMap>
  ) : 
    <Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
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
        data.map((dataPoint: CsvRecord): JSX.Element => {
          return <Marker key={dataPoint.lat + dataPoint.long} dataPoint={dataPoint} clusterer={clusterer} />
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
        {path: google.maps.SymbolPath.CIRCLE,
        strokeColor: markerIconColour,
        scale: 6}
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

function getRiskColor( riskRating: number ): string {
  const green = [50, 200, 10]; // RGB value for green
  const red = [225, 15, 10]; // RGB value for red
  
  // Interpolate between green and red based on the risk rating
  const color = [
    Math.round(green[0] + (red[0] - green[0]) * riskRating),
    Math.round(green[1] + (red[1] - green[1]) * riskRating),
    Math.round(green[2] + (red[2] - green[2]) * riskRating),
  ];
  
  // Format the color as a CSS RGB string
  return `rgb(${color.join(',')})`;
}