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
    <form style={{height: 'auto'}}>
      <label htmlFor="decadeRange" className="form-label">
        Select a decade {`(${decades.at(0)} - ${decades.at(-1)})`}: <b>{decades[decadeIndex]}</b>
      </label>
      <input type="range" className="form-range" id="decadeRange"
        min="0" max={decades.length - 1} step="1"
        onChange={handleSliderChange}
        list='decade-list'
        value={decadeIndex}
      />
    </form>
  );
}