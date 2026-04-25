import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import QuickAddFAB from './QuickAddFAB'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('QuickAddFAB', () => {
  it('should render FAB button', () => {
    render(<QuickAddFAB />, { wrapper })

    const button = screen.getByRole('button', { name: /quick add application/i })
    expect(button).toBeInTheDocument()
  })

  it('should have correct aria-label', () => {
    render(<QuickAddFAB />, { wrapper })

    const button = screen.getByRole('button', { name: /quick add application/i })
    expect(button).toHaveAttribute('aria-label', 'Quick add application')
  })

  it('should have fixed positioning classes', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6')
  })

  it('should have blue background styling', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
  })

  it('should open modal when clicked', async () => {
    const user = userEvent.setup()
    render(<QuickAddFAB />, { wrapper })

    const button = screen.getByRole('button', { name: /quick add application/i })
    await user.click(button)

    // Modal should appear with the heading
    expect(screen.getByText('Add New Application')).toBeInTheDocument()
  })

  it('should have rounded-full styling for circular shape', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('rounded-full')
  })

  it('should have shadow styling', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('shadow-lg', 'hover:shadow-xl')
  })

  it('should have correct z-index', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('z-40')
  })

  it('should render Plus icon', () => {
    render(<QuickAddFAB />, { wrapper })

    const button = screen.getByRole('button', { name: /quick add application/i })
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('w-6', 'h-6')
  })

  it('should have flexbox centering', () => {
    const { container } = render(<QuickAddFAB />, { wrapper })

    const button = container.querySelector('button')
    expect(button).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('should set modal state to false initially', () => {
    render(<QuickAddFAB />, { wrapper })

    // Modal should not be visible initially
    expect(screen.queryByText('Add New Application')).not.toBeInTheDocument()
  })
})
