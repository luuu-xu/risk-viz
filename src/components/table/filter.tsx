import { Column, Table } from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";

export default function Filter({
  column,
  table,
  setRiskFactor
}: {
  column: Column<any, unknown>
  table: Table<any>
  setRiskFactor: (name: any) => void
}) {
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
          onChange={value => {
            column.setFilterValue(value);
            setRiskFactor(value);
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
  value: string | number
  onChange: (value: string | number) => void
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