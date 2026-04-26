import React from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, className = '' }) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div 
          className="p-3 rounded-full" 
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)' }}
        >
          <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
