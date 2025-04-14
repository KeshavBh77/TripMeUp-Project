import React, { useState } from 'react';
import './User.css';

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Searching for:', searchTerm);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('User data submitted:', userForm);
    setIsEditing(false);
  };

  return (
    <div className="user-module">
      <div className="container">
        <h1>User Management</h1>
        
        <section className="search-section">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </section>
        
        <div className="user-content">
          <div className="user-list">
            <h2>Users</h2>
            <ul>
              {users.length > 0 ? (
                users.map(user => (
                  <li 
                    key={user.id} 
                    onClick={() => handleUserSelect(user)}
                    className={selectedUser?.id === user.id ? 'active' : ''}
                  >
                    {user.name} - {user.email}
                  </li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedUser(null);
                setUserForm({ name: '', email: '', role: 'user' });
                setIsEditing(true);
              }}
            >
              Add New User
            </button>
          </div>
          
          <div className="user-details">
            {selectedUser && !isEditing ? (
              <>
                <h2>User Details</h2>
                <div className="detail-card">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                    <button className="btn">Delete</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>{selectedUser ? 'Edit User' : 'Create New User'}</h2>
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {selectedUser ? 'Update' : 'Create'}
                    </button>
                    <button 
                      type="button" 
                      className="btn"
                      onClick={() => {
                        setIsEditing(false);
                        if (!selectedUser) {
                          setUserForm({ name: '', email: '', role: 'user' });
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;