import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QuickAddModal from './QuickAddModal'

const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()

vi.mock('@/hooks/api', () => ({
  useCreateApplication: () => ({
    mutate: mockMutate,
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('QuickAddModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(
      <QuickAddModal isOpen={false} onClose={vi.fn()} />,
      { wrapper }
    )

    expect(screen.queryByText('Quick Add Application')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    expect(screen.getByText('Quick Add Application')).toBeInTheDocument()
  })

  it('should have all required form fields', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    expect(screen.getByLabelText(/Company \*/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Position \*/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Location/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Salary/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Status/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Job URL/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument()
  })

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <QuickAddModal isOpen={true} onClose={onClose} />,
      { wrapper }
    )

    const closeButton = screen.getByRole('button', { name: '' }).parentElement?.querySelector('button')
    if (closeButton) {
      await user.click(closeButton)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('should close modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <QuickAddModal isOpen={true} onClose={onClose} />,
      { wrapper }
    )

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('should update form fields when user types', async () => {
    const user = userEvent.setup()
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const companyInput = screen.getByPlaceholderText('Company name') as HTMLInputElement
    await user.type(companyInput, 'Tech Corp')

    expect(companyInput.value).toBe('Tech Corp')
  })

  it('should update all form fields', async () => {
    const user = userEvent.setup()
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const companyInput = screen.getByPlaceholderText('Company name') as HTMLInputElement
    const positionInput = screen.getByPlaceholderText('Job title') as HTMLInputElement
    const locationInput = screen.getByPlaceholderText('City, State') as HTMLInputElement
    const salaryInput = screen.getByPlaceholderText('Annual salary') as HTMLInputElement
    const urlInput = screen.getByPlaceholderText('https://...') as HTMLInputElement

    await user.type(companyInput, 'Tech Corp')
    await user.type(positionInput, 'Senior Developer')
    await user.type(locationInput, 'San Francisco, CA')
    await user.type(salaryInput, '150000')
    await user.type(urlInput, 'https://techcorp.com/jobs/1')

    expect(companyInput.value).toBe('Tech Corp')
    expect(positionInput.value).toBe('Senior Developer')
    expect(locationInput.value).toBe('San Francisco, CA')
    expect(salaryInput.value).toBe('150000')
    expect(urlInput.value).toBe('https://techcorp.com/jobs/1')
  })

  it('should have status dropdown with correct options', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const statusSelect = screen.getByDisplayValue('Applied') as HTMLSelectElement
    expect(statusSelect).toBeInTheDocument()

    const options = statusSelect.querySelectorAll('option')
    expect(options.length).toBe(4)
    expect(options[0]).toHaveValue('applied')
    expect(options[1]).toHaveValue('interviewing')
    expect(options[2]).toHaveValue('offer')
    expect(options[3]).toHaveValue('rejected')
  })

  it('should change status when dropdown is changed', async () => {
    const user = userEvent.setup()
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const statusSelect = screen.getByDisplayValue('Applied') as HTMLSelectElement
    await user.selectOptions(statusSelect, 'interviewing')

    expect(statusSelect.value).toBe('interviewing')
  })

  it('should require company field', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const companyInput = screen.getByPlaceholderText('Company name') as HTMLInputElement
    expect(companyInput.required).toBe(true)
  })

  it('should require position field', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const positionInput = screen.getByPlaceholderText('Job title') as HTMLInputElement
    expect(positionInput.required).toBe(true)
  })

  it('should have textarea for notes', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const notesTextarea = screen.getByPlaceholderText('Any additional notes...') as HTMLTextAreaElement
    expect(notesTextarea).toBeInTheDocument()
    expect(notesTextarea.tagName).toBe('TEXTAREA')
  })

  it('should update notes textarea', async () => {
    const user = userEvent.setup()
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const notesTextarea = screen.getByPlaceholderText('Any additional notes...') as HTMLTextAreaElement
    await user.type(notesTextarea, 'Interesting company with good culture')

    expect(notesTextarea.value).toBe('Interesting company with good culture')
  })

  it('should have add application button', () => {
    render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const submitButton = screen.getByRole('button', { name: /Add Application/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('should have modal overlay with correct styling', () => {
    const { container } = render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const overlay = container.querySelector('.fixed.inset-0')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50')
  })

  it('should have glass-card styling on modal content', () => {
    const { container } = render(
      <QuickAddModal isOpen={true} onClose={vi.fn()} />,
      { wrapper }
    )

    const card = container.querySelector('.glass-card')
    expect(card).toBeInTheDocument()
  })
})
