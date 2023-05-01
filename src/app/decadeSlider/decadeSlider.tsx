export default function DecadeSlider({ 
  decadeIndex, setDecadeIndex, decades 
}: { 
  decadeIndex: number, setDecadeIndex: (decadeIndex: number) => void, decades: number[]
}) : 
  JSX.Element 
{
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDecadeIndex(parseInt(e.target.value));
  }

  return (
    <form className="container d-flex flex-row items-center p-2">
      <label htmlFor="decadeRange" className="form-label basis-1/3 m-0">
        Select a decade {`(${decades.at(0)} - ${decades.at(-1)})`}: <b>{decades[decadeIndex]}</b>
      </label>
      <input type="range" className="form-range basis-2/3" id="decadeRange"
        min="0" max={decades.length - 1} step="1"
        onChange={handleSliderChange}
        list='decade-list'
        value={decadeIndex}
      />
    </form>
  );
}