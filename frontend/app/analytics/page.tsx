'use client';
import { API_BASE } from '../lib/api';
import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Brain, TrendingUp, BookOpen, Users, Clock, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// this is to add the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  totalSessions: number;
  featureUsage: {
    explain: number;
    notes: number;
    flashcards: number;
    quiz: number;
  };
  topTopics: { topic: string; count: number }[];
  last7Days: { date: string; count: number }[];
  recentSessions: any[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // this makes sure it refreshes every 10 seconds
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/api/analytics/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data && typeof data.totalSessions === "number") {
  setAnalytics(data);
} else {
  setAnalytics(null);
}
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }
  setLoading(false);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to study
          </Link>
        </div>
      </div>
    );
  }

  // this sets the chart configurations
  const lineChartData = {
    labels: analytics.last7Days.map(d => d.date),
    datasets: [
      {
        label: 'Study Sessions',
        data: analytics.last7Days.map(d => d.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const doughnutData = {
    labels: ['Explain', 'Study Notes', 'Flashcards', 'Quiz'],
    datasets: [
      {
        data: [
          analytics.featureUsage.explain,
          analytics.featureUsage.notes,
          analytics.featureUsage.flashcards,
          analytics.featureUsage.quiz
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const barChartData = {
    labels: analytics.topTopics.map(t => t.topic),
    datasets: [
      {
        label: 'Times Studied',
        data: analytics.topTopics.map(t => t.count),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* This is the header for the dashboard */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track your learning progress and patterns</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Study
          </Link>
        </div>

        {/* This is for the statistic cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Brain />}
            title="Total Sessions"
            value={analytics.totalSessions}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<TrendingUp />}
            title="This Week"
            value={analytics.last7Days.reduce((sum, day) => sum + day.count, 0)}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={<BookOpen />}
            title="Topics Covered"
            value={analytics.topTopics.length}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<Award />}
            title="Study Streak"
            value={`${analytics.last7Days.filter(d => d.count > 0).length} days`}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* This is for the charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* This sets the data up for the week */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">7-Day Activity</h3>
            {analytics.totalSessions > 0 ? (
              <Line data={lineChartData} options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                  }
                }
              }} />
            ) : (
              <p className="text-gray-500 text-center py-8">Start studying to see activity</p>
            )}
          </div>

          {/* This makes the circular chart for feature usage */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
            {analytics.totalSessions > 0 ? (
              <Doughnut data={doughnutData} options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' as const }
                }
              }} />
            ) : (
              <p className="text-gray-500 text-center py-8">Try different features to see usage</p>
            )}
          </div>
        </div>

        {/* This informs the user of the top topics studied */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Top Topics</h3>
          {analytics.topTopics.length > 0 ? (
            <Bar data={barChartData} options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }} />
          ) : (
            <p className="text-gray-500 text-center py-8">No topics studied yet</p>
          )}
        </div>

        {/* This informs users of their recent sessions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Study Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Topic</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentSessions.length > 0 ? (
                  analytics.recentSessions.map((session, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{session.topic}</td>
                      <td className="py-2 capitalize">{session.feature_type ?? session.type}</td>
<td className="py-2">
  {new Date(session.created_at ?? session.timestamp).toLocaleString()}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No sessions recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

// This sets up the statistic cards
function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
}