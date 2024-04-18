"use client"

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CSSProperties, useState } from "react"
import Filters from "./Filters"
import { Card, CardContent, CardHeader } from "./ui/card"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]); //optionally initialize the column order
  // const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({left: ['name'], right: []});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    // onColumnPinningChange: setColumnPinning,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      columnPinning: { left: ['name'], right: [] },
    },
    enableExpanding: true,
    enableRowPinning: true,
    enableColumnPinning: true,
  });

  const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
    const isPinned = column.getIsPinned();

    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize() + 100,
      zIndex: isPinned ? 1 : 0,
      backgroundColor: isPinned ? 'white' : 'transpatent'
    }
  }

  return (
    <>
      <div className="w-[1020px] m-auto flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Manage & Automate Support</h1>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className="w-[1020px] h-[1010px] m-auto relative">
        <CardHeader className="sticky top-0 z-20 bg-white rounded-lg">
          <Filters table={table} />
        </CardHeader>
        <CardContent>
          <div className="max-w-full max-h-full rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white rounded-lg">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} style={{ ...getCommonPinningStyles(header.column) }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="max-h-screen">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
