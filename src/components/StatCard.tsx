import React from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, className = '' }) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
