import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import QuickAddModal from './QuickAddModal'

const QuickAddFAB: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Quick add application"
      >
        <Plus className="w-6 h-6" />
      </button>

      <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default QuickAddFAB
