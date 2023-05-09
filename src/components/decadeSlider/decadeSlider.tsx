import { set } from '@/redux/features/decadeIndexSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function DecadeSlider({ 
  decades 
}: { 
  decades: number[]
}) : 
  JSX.Element 
{

  const dispatch = useAppDispatch();
  const decadeIndex = useAppSelector((state) => state.decadeIndexReducer.value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(set(parseInt(e.target.value)));
  }

  return (
    <form className="container flex flex-col lg:flex-row items-center p-2">
      <label 
        className="form-label basis-1/3 m-0"
        htmlFor="decadeRange" 
      >
        Select a decade {`(${decades.at(0)} - ${decades.at(-1)})`}: <b>{decades[decadeIndex]}</b>
      </label>
      <input 
        className="form-range basis-2/3" 
        type="range" 
        id="decadeRange"
        min="0" max={decades.length - 1} step="1"
        onChange={handleSliderChange}
        list='decade-list'
        value={decadeIndex}
      />
    </form>
  );
}