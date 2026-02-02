import { useState, useEffect } from 'react';
import { DollarSign, Car, Users, Calendar, PieChart } from 'lucide-react';
import { adminApi, DashboardStats, FleetDistribution } from '../../api/services';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!stats) return <div className="text-red-600">Failed to load dashboard</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Cars', value: stats.totalCars, icon: Car, color: 'bg-green-500' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Distribution</h2>
        <div className="flex flex-wrap gap-4">
          {stats.fleetDistribution?.map((fd: FleetDistribution) => (
            <div key={fd.type} className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <PieChart className="w-5 h-5 text-primary-600" />
              <span className="font-medium">{fd.type}</span>
              <span className="text-gray-600">{fd.count} cars</span>
            </div>
          ))}
          {(!stats.fleetDistribution || stats.fleetDistribution.length === 0) && (
            <p className="text-gray-500">No fleet data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
