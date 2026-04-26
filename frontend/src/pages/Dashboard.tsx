import React from 'react'
import { Briefcase, Calendar, Trophy, TrendingUp } from 'lucide-react'
import { useDashboardStats } from '@/hooks/api'
import StatCard from '@/components/StatCard'
import CircularProgress from '@/components/CircularProgress'
import QuickAddFAB from '@/components/QuickAddFAB'

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <p style={{ color: 'var(--color-danger)' }}>
          Error loading dashboard: {error.message}
        </p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="glass-card p-6">
        <p>No dashboard data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Applications" value={stats.activeApplications} icon={Briefcase} />
        <StatCard title="Upcoming Interviews" value={stats.upcomingInterviews} icon={Calendar} />
        <StatCard title="Pending Offers" value={stats.pendingOffers} icon={Trophy} />
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">
                Job Hunt Progress
              </h3>
              <p className="text-2xl font-bold">
                {stats.progressPct}%
              </p>
            </div>
            <CircularProgress progress={stats.progressPct} size={60} strokeWidth={6} />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Overall Progress
        </h2>
        <div className="flex items-center space-x-6">
          <CircularProgress progress={stats.progressPct} size={120} strokeWidth={8} />
          <div className="flex-1">
            <p className="mb-2">
              You're making great progress on your job hunt! Keep up the momentum.
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Applications</span>
                <span className="font-medium">
                  {stats.activeApplications} active
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Interviews</span>
                <span className="font-medium">
                  {stats.upcomingInterviews} upcoming
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Offers</span>
                <span className="font-medium">
                  {stats.pendingOffers} pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add FAB */}
      <QuickAddFAB />
    </div>
  )
}

export default Dashboard

