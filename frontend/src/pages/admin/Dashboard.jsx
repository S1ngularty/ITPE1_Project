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
        const response = await fetch(
          `${import.meta.env.VITE_APP_API}api/v1/admin/dashboardy`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setAdminData(data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [timeRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Format Cloudinary storage data with max 100%
  const formatCloudinaryStorage = (cloudinaryData) => {
    if (!cloudinaryData) return { used: 0, usedGB: 0, totalGB: 25, files: 0 };

    const storageBytes = cloudinaryData.storage?.usage || 0;
    const usedGB = (storageBytes / 1024 ** 3).toFixed(2); // bytes → GB
    const totalGB = 25; // free plan limit
    const usedPercentage = Math.min((usedGB / totalGB) * 100, 100).toFixed(1); // Cap at 100%

    return {
      used: parseFloat(usedPercentage),
      usedGB: parseFloat(usedGB),
      totalGB,
      files: cloudinaryData.resources || 0,
    };
  };

  // Format Roboflow usage data with max 100%
  const formatRoboflowUsage = (roboflowData) => {
    if (!roboflowData)
      return { used: 0, datasets: 0, imagesLabeled: 0, boxesDrawn: 0 };

    const imagesLabeled = roboflowData.stats?.numImagesLabeled || 0;
    const boxesDrawn = roboflowData.stats?.numBoxesDrawn || 0;
    const datasets = roboflowData.data?.length || 0;

    // Cap usage percentage at 100%
    const usedPercentage = Math.min((imagesLabeled / 1000) * 100, 100).toFixed(
      1
    );

    return {
      used: parseFloat(usedPercentage),
      datasets: datasets,
      imagesLabeled: imagesLabeled,
      boxesDrawn: boxesDrawn,
      projects: roboflowData.data || [],
    };
  };

  // Format request usage data for chart
  const formatRequestUsage = (requestData) => {
    if (!requestData || !Array.isArray(requestData)) return [];

    return requestData.map((item) => ({
      month: getMonthName(item.month),
      classification: item.classificationCount,
      count: item.countCount,
      total: item.classificationCount + item.countCount,
      year: item.year,
    }));
  };

  // Format user growth data for chart with proper Y-axis domain
  const formatUserGrowth = (userGrowthData) => {
    if (!userGrowthData || !Array.isArray(userGrowthData)) return [];

    return userGrowthData.map((item) => ({
      month: getMonthName(item.month),
      users: item.userCount,
      year: item.year,
    }));
  };

  // Calculate max value for user growth Y-axis (1.5x highest data point)
  const getUserGrowthYAxisDomain = (userGrowthData) => {
    if (!userGrowthData || userGrowthData.length === 0) return [0, 10];

    const maxUsers = Math.max(...userGrowthData.map((item) => item.users));
    const maxDomain = Math.ceil(maxUsers * 1.5); // 1.5x the highest value, rounded up
    return [0, maxDomain];
  };

  // Calculate max value for request usage Y-axis (1.5x highest data point)
  const getRequestUsageYAxisDomain = (requestUsageData) => {
    if (!requestUsageData || requestUsageData.length === 0) return [0, 10];

    const maxRequests = Math.max(...requestUsageData.map((item) => item.total));
    const maxDomain = Math.ceil(maxRequests * 1.5); // 1.5x the highest value, rounded up
    return [0, maxDomain];
  };

  // Helper function to get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  };

  // Calculate Cloudinary credits usage with max 100%
  const getCloudinaryCreditsUsage = (cloudinaryData) => {
    if (!cloudinaryData) return { used: 0, limit: 25, percentage: 0 };

    const used = cloudinaryData.credits?.usage || 0;
    const limit = cloudinaryData.credits?.limit || 25;
    const percentage = Math.min((used / limit) * 100, 100).toFixed(1); // Cap at 100%

    return {
      used: used,
      limit: limit,
      percentage: parseFloat(percentage),
    };
  };

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

  if (!adminData) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main-content">
          <div className="error-container">
            <p>Failed to load dashboard data.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const cloudinaryStorage = formatCloudinaryStorage(adminData.cloudinaryUsage);
  const roboflowUsage = formatRoboflowUsage(adminData.roboflowUsage);
  const requestUsageData = formatRequestUsage(adminData.requestUsage);
  const userGrowthData = formatUserGrowth(adminData.userGrowth);
  const creditsUsage = getCloudinaryCreditsUsage(adminData.cloudinaryUsage);

  const userGrowthYAxisDomain = getUserGrowthYAxisDomain(userGrowthData);
  const requestUsageYAxisDomain = getRequestUsageYAxisDomain(requestUsageData);

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

          {/* Storage Usage Cards */}
          <div className="storage-cards-grid">
            {/* Cloudinary Storage Card */}
            <div className="storage-card">
              <div className="storage-card-header">
                <h3>Cloudinary Storage</h3>
                <span className="storage-subtitle">Image & Media Storage</span>
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
                        strokeDashoffset={
                          314 * (1 - cloudinaryStorage.used / 100)
                        }
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="progress-content">
                      <div className="progress-percentage">
                        {cloudinaryStorage.used}%
                      </div>
                      <div className="progress-label">Used</div>
                    </div>
                  </div>
                </div>
                <div className="storage-details">
                  <div className="storage-stat">
                    <span className="stat-label">Storage Used</span>
                    <span className="stat-value">
                      {cloudinaryStorage.usedGB} GB
                    </span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Total Storage</span>
                    <span className="stat-value">
                      {cloudinaryStorage.totalGB} GB
                    </span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Files Stored</span>
                    <span className="stat-value">
                      {cloudinaryStorage.files.toLocaleString()}
                    </span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Credits Used</span>
                    <span className="stat-value">
                      {creditsUsage.used} / {creditsUsage.limit}
                    </span>
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
                        strokeDashoffset={314 * (1 - roboflowUsage.used / 100)}
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="progress-content">
                      <div className="progress-percentage">
                        {roboflowUsage.used}%
                      </div>
                      <div className="progress-label">Used</div>
                    </div>
                  </div>
                </div>
                <div className="storage-details">
                  <div className="storage-stat">
                    <span className="stat-label">Images Labeled</span>
                    <span className="stat-value">
                      {roboflowUsage.imagesLabeled}
                    </span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Boxes Drawn</span>
                    <span className="stat-value">
                      {roboflowUsage.boxesDrawn}
                    </span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Active Projects</span>
                    <span className="stat-value">{roboflowUsage.datasets}</span>
                  </div>
                  <div className="storage-stat">
                    <span className="stat-label">Labelers</span>
                    <span className="stat-value">
                      {adminData.roboflowUsage?.labelers?.length || 0}
                    </span>
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
                <span className="chart-subtitle">Monthly API Requests</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={requestUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={requestUsageYAxisDomain} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Total Requests" fill="#3B82F6" />
                    <Bar
                      dataKey="classification"
                      name="Classification"
                      fill="#10B981"
                    />
                    <Bar
                      dataKey="count"
                      name="Count Detection"
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
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={userGrowthYAxisDomain} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Total Users"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
