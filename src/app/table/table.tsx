import { createColumnHelper, getCoreRowModel, useReactTable, flexRender, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { CsvRecord } from '../types';
import React from 'react';

const columnHelper = createColumnHelper<CsvRecord>();

// Making columns
const columns = [
  columnHelper.accessor('assetName', {
    header: () => <span>Asset Name</span>,
    cell: info => info.getValue(),
  }),
  // Grouping Column
  columnHelper.group({
    header: 'Coordinates',
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor('lat', {
        header: () => <span>Latitude</span>,
        cell: info => info.getValue().toFixed(3),
        // footer: props => props.column.id,
      }),
      columnHelper.accessor('long', {
        header: () => <span>Longitude</span>,
        cell: info => info.getValue().toFixed(3),
        // footer: props => props.column.id,
      }),
    ],
  }),
  columnHelper.accessor('businessCategory', {
    header: () => <span>Business Category</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('riskRating', {
    header: () => <span>Risk Rating</span>,
    cell: info => info.getValue(),
  }),
  columnHelper.group({
    header: 'Risk Factors',
    columns: [

    ]
  }),
  columnHelper.accessor('year', {
    header: () => <span>Year</span>,
    cell: info => info.getValue(),
    // footer: props => props.column.id,
  })
]

export default function Table({ data }: { data: CsvRecord[] }): JSX.Element {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className='table-auto border-collapse border border-slate-400'>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => {
          return (
            <th key={header.id} colSpan={header.colSpan} className='border border-slate-300 bg-slate-50'>
              {header.isPlaceholder ? null : (
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              )}
            </th>
          )
        })}
      </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => {
              return (
                <td key={cell.id} className='border border-slate-300'>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}