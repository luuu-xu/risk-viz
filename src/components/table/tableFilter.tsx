"use client";

import { useEffect, useState, useMemo } from 'react';
import { getRiskColor } from '../../app/lib/riskColor';

import {
  Column,
  Table,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from '@tanstack/react-table'

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

import { CsvRecord } from '../../app/types'

const columnHelper = createColumnHelper<CsvRecord>();

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export default function TableFilter({ 
  data, 
  setAssetName, 
  setCategory, 
  setRiskFactor, 
  assetName,
  category,
  riskFactor
}: { 
  data: CsvRecord[], 
  setAssetName: React.Dispatch<string>, 
  setCategory: React.Dispatch<string>, 
  setRiskFactor: React.Dispatch<string>,
  assetName: string,
  category: string,
  riskFactor: string
}): JSX.Element {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Setting States when column filters change
  useEffect(() => {
    // console.log(columnFilters);
    const assetNameColumnFilter = columnFilters.filter((columnFilter) => columnFilter.id === "assetName");
    setAssetName(assetNameColumnFilter[0]?.value as string);
    const categoryColumnFilter = columnFilters.filter((columnFilter) => columnFilter.id === "businessCategory");
    setCategory(categoryColumnFilter[0]?.value as string);
    const riskFactorsColumnFilter = columnFilters.filter((columnFilter) => columnFilter.id === "riskFactors");
    setRiskFactor(riskFactorsColumnFilter[0]?.value as string);
  }, [columnFilters]);

  const handleClickAssetName = (e: React.MouseEvent<HTMLButtonElement>) => {
    const assetName: string | null = e.currentTarget.textContent;
    if (e.currentTarget.classList.contains('active')) {
      const newColumnFilters = columnFilters.filter((columnFilter) => columnFilter.id !== 'assetName');
      setColumnFilters(newColumnFilters);
    } else {
      const riskFactorsColumnFilterExists = columnFilters.some((columnFilter) => columnFilter.id === 'assetName');
      if (riskFactorsColumnFilterExists) {
        const index = columnFilters.findIndex((columnFilter) => columnFilter.id === 'assetName');
        const updatedColumnFilters = columnFilters.map((columnFilter, i) => {
          if (i === index) {
            return {
              id: 'assetName',
              value: assetName,
            }
          } else {
            return columnFilter;
          }
        });
        setColumnFilters(updatedColumnFilters);
      } else {
        const newColumnFilters = [...columnFilters, {
          id: 'assetName',
          value: assetName
        }];
        setColumnFilters(newColumnFilters);
      }
    }
  }

  const handleClickCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    const businessCategory: string | null = e.currentTarget.textContent;
    if (e.currentTarget.classList.contains('active')) {
      const newColumnFilters = columnFilters.filter((columnFilter) => columnFilter.id !== 'businessCategory');
      setColumnFilters(newColumnFilters);
    } else {
      const riskFactorsColumnFilterExists = columnFilters.some((columnFilter) => columnFilter.id === 'businessCategory');
      if (riskFactorsColumnFilterExists) {
        const index = columnFilters.findIndex((columnFilter) => columnFilter.id === 'businessCategory');
        const updatedColumnFilters = columnFilters.map((columnFilter, i) => {
          if (i === index) {
            return {
              id: 'businessCategory',
              value: businessCategory,
            }
          } else {
            return columnFilter;
          }
        });
        setColumnFilters(updatedColumnFilters);
      } else {
        const newColumnFilters = [...columnFilters, {
          id: 'businessCategory',
          value: businessCategory
        }];
        setColumnFilters(newColumnFilters);
      }
    }
  }

  const handleClickRiskFactor = (e: React.MouseEvent<HTMLButtonElement>) => {
    const riskFactorName: string | undefined = e.currentTarget.textContent?.split(':')[0];
    if (e.currentTarget.classList.contains('active')) {
      const newColumnFilters = columnFilters.filter((columnFilter) => columnFilter.id !== 'riskFactors');
      setColumnFilters(newColumnFilters);
    } else {
      const riskFactorsColumnFilterExists = columnFilters.some((columnFilter) => columnFilter.id === 'riskFactors');
      if (riskFactorsColumnFilterExists) {
        const index = columnFilters.findIndex((columnFilter) => columnFilter.id === 'riskFactors');
        const updatedColumnFilters = columnFilters.map((columnFilter, i) => {
          if (i === index) {
            return {
              id: 'riskFactors',
              value: riskFactorName,
            }
          } else {
            return columnFilter;
          }
        });
        setColumnFilters(updatedColumnFilters);
      } else {
        const newColumnFilters = [...columnFilters, {
          id: 'riskFactors',
          value: riskFactorName
        }];
        setColumnFilters(newColumnFilters);
      }
    }
  }

  const columns =  [
      columnHelper.accessor('assetName', {
        header: () => <span>Asset Name</span>,
        // cell: info => info.getValue(),
        cell: info => AssetNameCell(info, assetName, handleClickAssetName),
      }),
      columnHelper.accessor('lat', {
        header: () => <span>Latitude</span>,
        cell: info => info.getValue().toFixed(3),
        enableColumnFilter: false
      }),
      columnHelper.accessor('long', {
        header: () => <span>Longitude</span>,
        cell: info => info.getValue().toFixed(3),
        enableColumnFilter: false
      }),
      columnHelper.accessor('businessCategory', {
        header: () => <span>Business Category</span>,
        // cell: info => info.getValue(),
        cell: info => CategoryCell(info, category, handleClickCategory),
      }),
      columnHelper.accessor('riskRating', {
        header: () => <span>Risk Rating</span>,
        cell: info => {
          return (
            <div style={{color: `${getRiskColor(info.getValue())}`}}>
              {info.getValue()}
            </div>
          )},
        enableColumnFilter: false
      }),
      columnHelper.accessor('riskFactors', {
        header: () => <span>Risk Factors</span>,
        cell: info => RiskFactorCells(info, riskFactor, handleClickRiskFactor),
      }),
      columnHelper.accessor('year', {
        header: () => <span>Year</span>,
        cell: info => info.getValue(),
        enableSorting: false,
        enableColumnFilter: false
      })
    ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    debugAll: false,
  });

  return (
    // <div className="p-2">
    <div>
      <table className='table table-hover'>
        {/* <thead className='table-light'> */}
      {/* <table className='table-auto'> */}
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
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
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} setRiskFactor={setRiskFactor} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
    </div>
  );
}

function Filter({
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
      <>
        {/* <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value: any, index: number) => (
            <option value={value} key={index} />
          ))}
        </datalist> */}
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => {
            column.setFilterValue(value);
            setRiskFactor(value);
          }}
          // placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          placeholder={`Search...`}
          className="w-36 border shadow rounded"
          // list={column.id + 'list'}
        />
        <div className="h-1" />
      </>
    );
  }

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
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
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
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

function AssetNameCell(
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

function CategoryCell(
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

function RiskFactorCells(
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