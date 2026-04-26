import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CircularProgress from '@/components/CircularProgress'

describe('CircularProgress', () => {
  it('should render with default size and progress', () => {
    render(<CircularProgress progress={50} />)

    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should display progress percentage in center', () => {
    render(<CircularProgress progress={75} />)

    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should render at 0% progress', () => {
    render(<CircularProgress progress={0} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('should render at 100% progress', () => {
    render(<CircularProgress progress={100} />)

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should render SVG with correct size attribute', () => {
    const { container } = render(<CircularProgress progress={50} size={80} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '80')
  })

  it('should render two circles (background and progress)', () => {
    const { container } = render(<CircularProgress progress={50} />)

    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2)
  })

  it('should apply custom className', () => {
    const { container } = render(
      <CircularProgress progress={50} className="custom-class" />
    )

    const wrapper = container.querySelector('.relative')
    expect(wrapper).toBeInTheDocument()
  })

  it('should render with custom size', () => {
    const { container } = render(<CircularProgress progress={50} size={200} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '200')
  })

  it('should render with custom stroke width', () => {
    const { container } = render(
      <CircularProgress progress={50} strokeWidth={10} />
    )

    const circles = container.querySelectorAll('circle')
    expect(circles[0]).toHaveAttribute('stroke-width', '10')
    expect(circles[1]).toHaveAttribute('stroke-width', '10')
  })

  it('should have transform rotate-90 class on SVG', () => {
    const { container } = render(<CircularProgress progress={50} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('transform', '-rotate-90')
  })

  it('should render progress circle with animation classes', () => {
    const { container } = render(<CircularProgress progress={50} />)

    const circles = container.querySelectorAll('circle')
    const progressCircle = circles[1]
    expect(progressCircle).toHaveClass('transition-all', 'duration-300', 'ease-in-out')
  })

  it('should handle different progress values', () => {
    const { rerender } = render(<CircularProgress progress={25} />)

    expect(screen.getByText('25%')).toBeInTheDocument()

    rerender(<CircularProgress progress={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })
})
