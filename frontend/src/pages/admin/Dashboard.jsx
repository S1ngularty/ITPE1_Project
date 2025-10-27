import React, { useState, useEffect } from "react";
import "../../styles/admin/pages/Dashboard.css";
import AdminSidebar from "../../components/admin/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          setAdminData({
            storageUsage: {
              cloudinary: {
                used: 45,
                usedGB: 4.5,
                totalGB: 10,
                files: 1247,
              },
              roboflow: {
                used: 28,
                usedGB: 2.8,
                totalGB: 10,
                datasets: 12,
                models: 8,
              },
            },
            requestUsage: [
              {
                date: "2024-01-01",
                count: 45,
                classification: 30,
                detection: 15,
              },
              {
                date: "2024-01-02",
                count: 52,
                classification: 35,
                detection: 17,
              },
              {
                date: "2024-01-03",
                count: 38,
                classification: 25,
                detection: 13,
              },
              {
                date: "2024-01-04",
                count: 61,
                classification: 42,
                detection: 19,
              },
              {
                date: "2024-01-05",
                count: 55,
                classification: 38,
                detection: 17,
              },
              {
                date: "2024-01-06",
                count: 48,
                classification: 32,
                detection: 16,
              },
              {
                date: "2024-01-07",
                count: 67,
                classification: 45,
                detection: 22,
              },
            ],
            userActivities: [
              { type: "Image Upload", count: 234 },
              { type: "Screw Detection", count: 189 },
              { type: "Classification", count: 156 },
              { type: "Results Saved", count: 98 },
              { type: "Results Shared", count: 45 },
            ],
            userStats: {
              totalUsers: 1247,
              activeUsers: 892,
              newUsers: 67,
              premiumUsers: 234,
            },
            systemMetrics: {
              uptime: 99.8,
              responseTime: 124,
              errorRate: 0.2,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [timeRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-dashboard-page">
          <div className="admin-header">
            <div className="header-left">
              <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
              </button>
              <h1>Admin Dashboard</h1>
            </div>
          </div>

          <div className="admin-dashboard-page">
            {/* Storage Usage Cards */}
            <div className="storage-cards-grid">
              {/* Cloudinary Storage Card */}
              <div className="storage-card">
                <div className="storage-card-header">
                  <h3>Cloudinary Storage</h3>
                  <span className="storage-subtitle">Image Storage</span>
                </div>
                <div className="storage-content">
                  <div className="circular-progress-container">
                    <div className="circular-progress">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="314"
                          strokeDashoffset={314 * (1 - 45 / 100)}
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="progress-content">
                        <div className="progress-percentage">45%</div>
                        <div className="progress-label">Used</div>
                      </div>
                    </div>
                  </div>
                  <div className="storage-details">
                    <div className="storage-stat">
                      <span className="stat-label">Storage Used</span>
                      <span className="stat-value">4.5 GB</span>
                    </div>
                    <div className="storage-stat">
                      <span className="stat-label">Total Storage</span>
                      <span className="stat-value">10 GB</span>
                    </div>
                    <div className="storage-stat">
                      <span className="stat-label">Files Stored</span>
                      <span className="stat-value">1,247</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roboflow Usage Card */}
              <div className="storage-card">
                <div className="storage-card-header">
                  <h3>Roboflow Usage</h3>
                  <span className="storage-subtitle">AI Model Services</span>
                </div>
                <div className="storage-content">
                  <div className="circular-progress-container">
                    <div className="circular-progress">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="314"
                          strokeDashoffset={314 * (1 - 28 / 100)}
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="progress-content">
                        <div className="progress-percentage">28%</div>
                        <div className="progress-label">Used</div>
                      </div>
                    </div>
                  </div>
                  <div className="storage-details">
                    <div className="storage-stat">
                      <span className="stat-label">API Usage</span>
                      <span className="stat-value">2.8 GB</span>
                    </div>
                    <div className="storage-stat">
                      <span className="stat-label">Total Limit</span>
                      <span className="stat-value">10 GB</span>
                    </div>
                    <div className="storage-stat">
                      <span className="stat-label">Active Datasets</span>
                      <span className="stat-value">12</span>
                    </div>
                    <div className="storage-stat">
                      <span className="stat-label">Trained Models</span>
                      <span className="stat-value">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              {/* Request Usage Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Request Usage</h3>
                  <span className="chart-subtitle">Daily API Requests</span>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          date: "Mon",
                          total: 45,
                          classification: 30,
                          detection: 15,
                        },
                        {
                          date: "Tue",
                          total: 52,
                          classification: 35,
                          detection: 17,
                        },
                        {
                          date: "Wed",
                          total: 38,
                          classification: 25,
                          detection: 13,
                        },
                        {
                          date: "Thu",
                          total: 61,
                          classification: 42,
                          detection: 19,
                        },
                        {
                          date: "Fri",
                          total: 55,
                          classification: 38,
                          detection: 17,
                        },
                        {
                          date: "Sat",
                          total: 48,
                          classification: 32,
                          detection: 16,
                        },
                        {
                          date: "Sun",
                          total: 67,
                          classification: 45,
                          detection: 22,
                        },
                      ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="total"
                        name="Total Requests"
                        fill="#3B82F6"
                      />
                      <Bar
                        dataKey="classification"
                        name="Classification"
                        fill="#10B981"
                      />
                      <Bar
                        dataKey="detection"
                        name="Detection"
                        fill="#F59E0B"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>User Growth</h3>
                  <span className="chart-subtitle">Monthly Progress</span>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { month: "Jan", total: 1000, active: 750 },
                        { month: "Feb", total: 1100, active: 820 },
                        { month: "Mar", total: 1200, active: 890 },
                        { month: "Apr", total: 1247, active: 892 },
                        { month: "May", total: 1350, active: 950 },
                        { month: "Jun", total: 1420, active: 1020 },
                      ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Users"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="active"
                        name="Active Users"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
