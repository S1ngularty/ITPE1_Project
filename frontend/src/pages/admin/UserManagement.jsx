import React, { useState, useEffect } from "react";
import "../../styles/admin/pages/UserManagement.css";
import AdminSidebar from "../../components/admin/Sidebar";
import UpdateUserModal from "../../components/admin/UpdateModal";
import DeleteUserModal from "../../components/admin/DeleteModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setUsers([
            {
              id: 1,
              name: "John Doe",
              email: "john.doe@email.com",
              role: "user",
              status: "active",
              joinDate: "2024-01-15",
              lastActive: "2024-03-20",
              analysisCount: 45,
              subscription: "free"
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane.smith@email.com",
              role: "premium",
              status: "active",
              joinDate: "2024-01-10",
              lastActive: "2024-03-21",
              analysisCount: 128,
              subscription: "premium"
            },
            {
              id: 3,
              name: "Mike Johnson",
              email: "mike.johnson@email.com",
              role: "user",
              status: "inactive",
              joinDate: "2024-02-01",
              lastActive: "2024-03-15",
              analysisCount: 12,
              subscription: "free"
            },
            {
              id: 4,
              name: "Sarah Wilson",
              email: "sarah.wilson@email.com",
              role: "admin",
              status: "active",
              joinDate: "2024-01-05",
              lastActive: "2024-03-22",
              analysisCount: 267,
              subscription: "premium"
            },
            {
              id: 5,
              name: "Alex Brown",
              email: "alex.brown@email.com",
              role: "user",
              status: "suspended",
              joinDate: "2024-02-20",
              lastActive: "2024-03-10",
              analysisCount: 8,
              subscription: "free"
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", class: "status-active" },
      inactive: { label: "Inactive", class: "status-inactive" },
      suspended: { label: "Suspended", class: "status-suspended" }
    };
    const config = statusConfig[status] || { label: status, class: "status-default" };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: "Admin", class: "role-admin" },
      premium: { label: "Premium", class: "role-premium" },
      user: { label: "User", class: "role-user" }
    };
    const config = roleConfig[role] || { label: role, class: "role-default" };
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="user-management-page">
          {/* Header */}
          <div className="page-header">
            <h1>User Management</h1>
            <p>Manage system users and their permissions</p>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="role-filter"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="premium">Premium</option>
                <option value="user">User</option>
              </select>

              <button className="add-user-btn">
                + Add New User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <div className="table-header">
              <h3>Users ({filteredUsers.length})</h3>
            </div>
            
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Last Active</th>
                    <th>Analyses</th>
                    <th>Subscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                      <td>
                        <span className="analysis-count">{user.analysisCount}</span>
                      </td>
                      <td>
                        <span className={`subscription-badge subscription-${user.subscription}`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleUpdateUser(user)}
                            title="Edit User"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No users found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UpdateUserModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onSave={handleSaveUser}
          />

          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;