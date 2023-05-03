import { CsvRecord } from '../../app/types';
import { getRiskColor } from '../../app/lib/riskColor';
import { InfoWindowF, MarkerClustererF, MarkerF } from '@react-google-maps/api';
import React from 'react';

export default function MarkerCluster({ 
  data,
  setAssetName,
  setCategory
}: { 
  data: CsvRecord[] | [],
  setAssetName: React.Dispatch<string>,
  setCategory: React.Dispatch<string>
}): JSX.Element {

  const [markerClicked, setMarkerClicked] = React.useState(false);

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
              setAssetName={setAssetName}
              setCategory={setCategory}
              markerClicked={markerClicked}
              setMarkerClicked={setMarkerClicked}
            />
          );
        })
      }
    </MarkerClustererF>
  )
}

function Marker({ 
  dataPoint, 
  clusterer,
  setAssetName,
  setCategory,
  markerClicked,
  setMarkerClicked
}:{ 
  dataPoint: CsvRecord, 
  clusterer: any,
  setAssetName: React.Dispatch<string>,
  setCategory: React.Dispatch<string>,
  markerClicked: boolean,
  setMarkerClicked: React.Dispatch<boolean>
}): JSX.Element {

  const [showInfoWindow, setShowInfoWindow] = React.useState(false);

  const markerPosition = {
    lat: dataPoint.lat,
    lng: dataPoint.long
  }
  const markerIconColour = getRiskColor(dataPoint.riskRating);

  function handleClick(): void {
    if (markerClicked) {
      setAssetName('');
      setCategory('');
      setMarkerClicked(false);
    } else {
      setAssetName(dataPoint.assetName);
      setCategory(dataPoint.businessCategory);
      setMarkerClicked(true);
    }
  }

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
      onClick={handleClick}
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