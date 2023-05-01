import { CsvRecord } from '../types';
import { getRiskColor } from '../lib/riskColor';
import { InfoWindowF, MarkerClustererF, MarkerF } from '@react-google-maps/api';
import React from 'react';

export default function MarkerCluster({ data }: { data: CsvRecord[] | [] }): JSX.Element {
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