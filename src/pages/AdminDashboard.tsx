import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Users, Car, AlertCircle, Calendar, TrendingUp, Activity, Settings, LogOut,
  Bell, Search, CheckCircle, Clock, DollarSign, Eye, Trash2, UserCheck, UserX,
  Filter, Download, RefreshCw, Phone, Mail, MapPin, Plus, UserPlus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Stats {
  totalUsers: number;
  totalGarages: number;
  activeBookings: number;
  revenue: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  garageName?: string;
}

interface Activity {
  type: string;
  user: string;
  action: string;
  timestamp: string;
}

interface EmergencyCall {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  issueDescription: string;
  status: string;
  priority: string;
  location: {
    address: string;
  };
  createdAt: string;
}

// New interface for user creation form
interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  garageName?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalGarages: 0,
    activeBookings: 0,
    revenue: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([]);

  // Filters
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ========== NEW: User Creation Modal States ==========
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    garageName: ''
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      toast.error('Please login as admin to access this page');
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchRecentActivity(),
        fetchEmergencyCalls()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, getAuthHeaders());
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (userFilter !== 'all') params.role = userFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${API_URL}/admin/users`, {
        ...getAuthHeaders(),
        params
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard/activity`, getAuthHeaders());
      if (response.data.success) {
        setRecentActivity(response.data.activities);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const fetchEmergencyCalls = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/emergencies`, getAuthHeaders());
      if (response.data.success) {
        setEmergencyCalls(response.data.emergencyCalls);
      }
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleSettings = () => {
    toast.info('Settings page coming soon!');
  };

  const handleNotifications = () => {
    toast.info(`You have ${emergencyCalls.length} active emergencies`);
  };

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/users/${userId}/status`,
        { isActive },
        getAuthHeaders()
      );

      if (response.data.success) {
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, getAuthHeaders());

      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleViewUser = (userId: string) => {
    toast.info(`Viewing user details for ID: ${userId}`);
    // Navigate to user details page or open modal
  };

  const handleEmergencyResponse = (emergencyId: string) => {
    toast.success('Emergency response dispatched!');
    // Add actual emergency response logic
  };

  const handleExportData = () => {
    toast.info('Exporting data as CSV...');
    // Add export logic
  };

  // ========== NEW: User Creation Functions ==========
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newUserForm.firstName || !newUserForm.lastName || !newUserForm.email || !newUserForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newUserForm.role === 'garager' && !newUserForm.garageName) {
      toast.error('Garage name is required for garager role');
      return;
    }

    setIsCreating(true);

    try {
      const response = await axios.post( `${API_URL}/auth/register`,
        {
          firstName: newUserForm.firstName,
          lastName: newUserForm.lastName,
          email: newUserForm.email,
          password: newUserForm.password,
          role: newUserForm.role,
          garageName: newUserForm.role === 'garager' ? newUserForm.garageName : undefined
        },
        getAuthHeaders() // This ensures admin doesn't get logged out
      );

      if (response.data.success) {
        toast.success(`User created successfully!`);
        
        // Reset form
        setNewUserForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'user',
          garageName: ''
        });
        
        // Close modal
        setIsCreateUserModalOpen(false);
        
        // Refresh users list and stats
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create user');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleFormChange = (field: keyof NewUserForm, value: string) => {
    setNewUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Garages',
      value: stats.totalGarages.toString(),
      change: '+8.2%',
      icon: Car,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings.toString(),
      change: '+23.1%',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wheelix Admin
                </h1>
                <p className="text-xs text-gray-500">Smart Garage Management</p>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, garages..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') fetchUsers();
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-blue-50 rounded-2xl"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotifications}
                className="relative hover:bg-blue-50 rounded-2xl"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {emergencyCalls.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSettings}
                className="hover:bg-blue-50 rounded-2xl"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>

              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h2>
          <p className="text-gray-600">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-1 cursor-pointer"
                onClick={() => toast.info(`Viewing ${stat.title} details`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1.5 rounded-2xl shadow-sm inline-flex">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 transition-all"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="garages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 transition-all"
            >
              Garages
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 transition-all"
            >
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="link" onClick={() => setActiveTab('users')} className="text-blue-600">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="font-semibold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Alerts */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Emergency Alerts
                    </CardTitle>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {emergencyCalls.length} Active
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {emergencyCalls.slice(0, 3).map((call) => (
                      <div key={call.id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-2xl">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {call.user.firstName} {call.user.lastName}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              call.priority === 'high'
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {call.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{call.issueDescription}</p>
                        <p className="text-xs text-gray-500">{new Date(call.createdAt).toLocaleString()}</p>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            onClick={() => handleEmergencyResponse(call.id)}
                          >
                            Respond
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="text-xl">User Management</CardTitle>
                  <div className="flex gap-3">
                    {/* ========== NEW: Create User Button ========== */}
                    <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                value={newUserForm.firstName}
                                onChange={(e) => handleFormChange('firstName', e.target.value)}
                                placeholder="John"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={newUserForm.lastName}
                                onChange={(e) => handleFormChange('lastName', e.target.value)}
                                placeholder="Doe"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUserForm.email}
                              onChange={(e) => handleFormChange('email', e.target.value)}
                              placeholder="john@example.com"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={newUserForm.password}
                              onChange={(e) => handleFormChange('password', e.target.value)}
                              placeholder="••••••••"
                              required
                              minLength={6}
                            />
                          </div>

                          <div>
                            <Label htmlFor="role">Role *</Label>
                            <select
                              id="role"
                              value={newUserForm.role}
                              onChange={(e) => handleFormChange('role', e.target.value)}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="user">Regular User</option>
                              <option value="garager">Garager</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>

                          {newUserForm.role === 'garager' && (
                            <div>
                              <Label htmlFor="garageName">Garage Name *</Label>
                              <Input
                                id="garageName"
                                value={newUserForm.garageName}
                                onChange={(e) => handleFormChange('garageName', e.target.value)}
                                placeholder="My Garage"
                                required={newUserForm.role === 'garager'}
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-3 mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateUserModalOpen(false)}
                              disabled={isCreating}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isCreating}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              {isCreating ? 'Creating...' : 'Create User'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleExportData} className="rounded-xl border-2">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    
                    <select
                      value={userFilter}
                      onChange={(e) => {
                        setUserFilter(e.target.value);
                        fetchUsers();
                      }}
                      className="px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="user">Regular Users</option>
                      <option value="garager">Garagers</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-900">Name</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Role</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Registered</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              {user.garageName && (
                                <p className="text-xs text-gray-500">{user.garageName}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">{user.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.role === 'garager'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewUser(user.id)}
                                className="rounded-xl"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                                className="rounded-xl"
                              >
                                {user.isActive ? (
                                  <UserX className="w-4 h-4" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                                className="rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Garages Tab */}
          <TabsContent value="garages">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Garage Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Garage management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Emergency Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Emergency management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
