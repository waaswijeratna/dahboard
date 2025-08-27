"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Megaphone, 
  FileText,
  Eye,
  Users,
  Activity
} from 'lucide-react';

// Import your service
import { getOverviewStats, OverviewStats } from '@/services/overviewService';



const OverviewSection: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getOverviewStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch overview statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-xl"></div>
              <div className="h-80 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare data for charts
  const timeDistributionData = [
    { name: 'Daily', posts: stats.posts.timeDistribution.daily, ads: stats.advertisements.timeDistribution.daily },
    { name: 'Weekly', posts: stats.posts.timeDistribution.weekly, ads: stats.advertisements.timeDistribution.weekly },
    { name: 'Monthly', posts: stats.posts.timeDistribution.monthly, ads: stats.advertisements.timeDistribution.monthly }
  ];

  const noticesData = [
    { name: 'Active', value: stats.notices.active, color: '#10b981' },
    { name: 'Inactive', value: stats.notices.inactive, color: '#6b7280' }
  ];

//   const campaignData = [
//     { name: 'Campaigns', count: stats.campaigns.totalCampaigns, funds: stats.campaigns.totalFundsRaised }
//   ];



  return (
    <div className="h-[81vh] overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Posts Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {stats.posts.timeDistribution.daily > 0 ? `+${stats.posts.timeDistribution.daily} today` : 'No posts today'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.posts.total.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Total Posts</p>
          </div>

          {/* Exhibitions Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {stats.exhibitions.todayCount > 0 ? `${stats.exhibitions.todayCount} today` : 'None today'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.exhibitions.total}</h3>
            <p className="text-gray-600 text-sm">Total Exhibitions</p>
          </div>

          {/* Campaigns Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {stats.campaigns.totalCampaigns} active
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">${stats.campaigns.totalFundsRaised.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Funds Raised</p>
          </div>

          {/* Advertisements Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Megaphone className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {stats.advertisements.timeDistribution.daily > 0 ? `+${stats.advertisements.timeDistribution.daily} today` : 'No ads today'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.advertisements.total}</h3>
            <p className="text-gray-600 text-sm">Total Ads</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Distribution Chart */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Content Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="posts" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Posts" />
                <Bar dataKey="ads" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Advertisements" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Notices Distribution */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Notices Status</h3>
              </div>
              <span className="text-sm text-gray-500">{stats.notices.total} total</span>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={noticesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {noticesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Active ({stats.notices.active})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Inactive ({stats.notices.inactive})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Insights */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Campaign Performance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl">
              <h4 className="text-2xl font-bold text-emerald-700">{stats.campaigns.totalCampaigns}</h4>
              <p className="text-emerald-600 text-sm">Active Campaigns</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl">
              <h4 className="text-2xl font-bold text-blue-700">${stats.campaigns.totalFundsRaised.toLocaleString()}</h4>
              <p className="text-blue-600 text-sm">Total Raised</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl">
              <h4 className="text-2xl font-bold text-purple-700">
                ${stats.campaigns.totalCampaigns > 0 ? Math.round(stats.campaigns.totalFundsRaised / stats.campaigns.totalCampaigns).toLocaleString() : '0'}
              </h4>
              <p className="text-purple-600 text-sm">Avg per Campaign</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;