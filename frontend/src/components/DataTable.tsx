import React from 'react'
import './DataTable.css'

export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
}

const DataTable = <T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  isLoading,
}: DataTableProps<T>) => {
  if (isLoading) {
    return <div className="loading-state">Loading data...</div>
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} onClick={() => onRowClick?.(item)}>
                {columns.map((column, index) => (
                  <td key={index} className={column.className}>
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
