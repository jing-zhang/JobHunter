import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'
import { Briefcase } from 'lucide-react'

describe('StatCard', () => {
  it('should render with title, value, and icon', () => {
    render(
      <StatCard
        title="Active Applications"
        value={42}
        icon={Briefcase}
      />
    )

    expect(screen.getByText('Active Applications')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render string values correctly', () => {
    render(
      <StatCard
        title="Status"
        value="In Progress"
        icon={Briefcase}
      />
    )

    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value={10}
        icon={Briefcase}
        className="custom-class"
      />
    )

    const card = container.querySelector('.custom-class')
    expect(card).toBeInTheDocument()
  })

  it('should have glass-card styling', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value={5}
        icon={Briefcase}
      />
    )

    const card = container.querySelector('.glass-card')
    expect(card).toBeInTheDocument()
  })

  it('should render zero values', () => {
    render(
      <StatCard
        title="Offers"
        value={0}
        icon={Briefcase}
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should render large numbers', () => {
    render(
      <StatCard
        title="Large Number"
        value={999999}
        icon={Briefcase}
      />
    )

    expect(screen.getByText('999999')).toBeInTheDocument()
  })
})
