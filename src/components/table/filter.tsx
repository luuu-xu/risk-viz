import { Column, Table } from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch } from '@/redux/hooks';
import { updateRiskFactor } from '@/redux/features/filtersSlice';

export default function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {

  const dispatch = useAppDispatch();

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  if (column.id === 'riskFactors') {
    return (
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => {
            column.setFilterValue(value);
            dispatch(updateRiskFactor(value));
          }}
          placeholder={`Search...`}
          className="w-28 border shadow rounded"
        />
    );
  }

  return  (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any, index: number) => (
          <option value={value} key={index} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-28 border shadow rounded"
        list={column.id + 'list'}
      />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}