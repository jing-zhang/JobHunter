import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DataTable from '@/components/DataTable'

interface MockData {
  id: number
  name: string
  status: string
}

const columns = [
  { header: 'Name', accessor: 'name' as keyof MockData },
  { header: 'Status', accessor: 'status' as keyof MockData },
]

const data: MockData[] = [
  { id: 1, name: 'Google', status: 'Applied' },
  { id: 2, name: 'Meta', status: 'Interviewing' },
]

describe('DataTable', () => {
  it('renders table headers correctly', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders data rows correctly', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
    expect(screen.getByText('Interviewing')).toBeInTheDocument()
  })

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />)

    fireEvent.click(screen.getByText('Google'))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('renders "No records found" when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('renders custom accessor correctly', () => {
    const customColumns = [
      { header: 'Name', accessor: (item: MockData) => `Company: ${item.name}` },
    ]
    render(<DataTable columns={customColumns} data={data} />)
    expect(screen.getByText('Company: Google')).toBeInTheDocument()
  })
})
