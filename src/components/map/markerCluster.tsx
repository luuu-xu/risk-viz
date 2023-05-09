import { CsvRecord } from '../../app/types';
import { getRiskColor } from '../../app/lib/riskColor';
import { InfoWindowF, MarkerClustererF, MarkerF } from '@react-google-maps/api';
import React from 'react';
import { updateAssetName, updateCategory } from '@/redux/features/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function MarkerCluster({ 
  data,
}: { 
  data: CsvRecord[] | undefined | any,
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
        data.map((dataPoint: CsvRecord, index: number): JSX.Element => {
          return (
            <Marker 
              key={dataPoint.lat + dataPoint.long + index} 
              dataPoint={dataPoint} 
              clusterer={clusterer}
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
  markerClicked,
  setMarkerClicked
}:{ 
  dataPoint: CsvRecord, 
  clusterer: any,
  markerClicked: boolean,
  setMarkerClicked: React.Dispatch<boolean>
}): JSX.Element {

  const dispatch = useAppDispatch();

  const [showInfoWindow, setShowInfoWindow] = React.useState(false);

  const markerPosition = {
    lat: dataPoint.lat,
    lng: dataPoint.long
  }
  const markerIconColour = getRiskColor(dataPoint.riskRating);

  function handleClick(): void {
    if (markerClicked) {
      dispatch(updateAssetName(''));
      dispatch(updateCategory(''));
      setMarkerClicked(false);
    } else {
      dispatch(updateAssetName(dataPoint.assetName));
      dispatch(updateCategory(dataPoint.businessCategory));
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