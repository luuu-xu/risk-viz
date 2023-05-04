import { getRiskColor } from '../../app/lib/riskColor';

export function AssetNameCell(
  info: any, 
  assetNameClicked: string | undefined, 
  handleClickAssetName: (e: React.MouseEvent<HTMLButtonElement>) => void
): JSX.Element {
  const assetName = info.getValue();
  return (
    <button
      className={`btn btn-light py-1 px-2 rounded-pill fs-6 fw-normal 
      ${assetNameClicked === assetName ? 'active' : ''}`}
      onClick={handleClickAssetName}
    >
      {assetName}
    </button>
  );
};

export function CategoryCell(
  info: any, 
  categoryClicked: string | undefined, 
  handleClickCategory: (e: React.MouseEvent<HTMLButtonElement>) => void
): JSX.Element {
  const category = info.getValue();
  return (
    <button
      className={`btn btn-light py-1 px-2 rounded-pill fs-6 fw-normal 
      ${categoryClicked === category ? 'active' : ''}`}
      onClick={handleClickCategory}
    >
      {category}
    </button>
  );
};

export function RiskFactorCells(
  info: any, 
  riskFactorNameClicked: string | undefined, 
  handleClickRiskFactor: (e: React.MouseEvent<HTMLButtonElement>) => void
): JSX.Element[] {
  let riskFactorsArray = info.getValue().split(',').map((riskFactor: string) => riskFactor.trim());
  if (riskFactorNameClicked) {
    const index = riskFactorsArray.findIndex((riskFactor: string) => riskFactor.includes(riskFactorNameClicked));
    const riskFactorWithRating = riskFactorsArray[index];
    riskFactorsArray = [riskFactorWithRating, ...riskFactorsArray.slice(0, index), ...riskFactorsArray.slice(index + 1)];
  }
  return riskFactorsArray.map((risk : any, index: number): JSX.Element => {
    const riskFactorName = risk?.split(':')[0];
    const riskFactorRating = risk?.split(':')[1];
    return (
      <button key={index}
        className={`btn btn-light py-1 px-2 rounded-pill fs-6 fw-normal 
        ${riskFactorNameClicked === riskFactorName ? 'active' : ''}`}
        onClick={handleClickRiskFactor}
      >
        <span>{riskFactorName}: </span>
        <span 
          style={{color: `${riskFactorNameClicked === riskFactorName ? getRiskColor(riskFactorRating) : ''}`}}
        >
          {riskFactorRating}
        </span>
      </button>
    );
  }
)};