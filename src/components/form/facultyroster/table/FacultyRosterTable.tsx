import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { columns } from "./FacultyRosterColumns"
import { FacultyRosterData } from "../FacultyRoster.type"
import { useState } from "react"

type Props = {
  data: FacultyRosterData[]
  onEdit: (index: string) => void
  onDelete: (index: string) => void
}

export default function FacultyTable({ data, onEdit, onDelete }: Props) {

  const columnVisibility = {
    "id": false
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEdit,
      onDelete
    }
  })

  return (
    <div className="overflow-x-auto">
      <table
        className="border-collapse w-full"
        style={{ width: table.getTotalSize() }}
      >
        <thead>
          {table.getHeaderGroups().map(group => (
            <tr key={group.id}>
              {group.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  className="relative border px-3 py-2 bg-leb text-white text-sm"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                  {/* resizer */}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-black"
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="even:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="border px-3 py-2 text-sm"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}