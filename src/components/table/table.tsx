"use client";

import { useEffect, useState } from 'react';
import { getRiskColor } from '../../app/lib/riskColor';
import { CsvRecord } from '../../app/types'
import Filter from './filter';
import { AssetNameCell, CategoryCell, RiskFactorCells } from './cells';
import { fuzzyFilter } from './fuzzyFilter';

import {
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<CsvRecord>();

export default function Table({ 
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
    <>
      <table className='table table-hover'>
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
    </>
  );
}