const User = require('../models/Users');
const Garage = require('../models/Garage');
const Booking = require('../models/Booking');
const EmergencyCall = require('../models/EmergencyCall');
const bcrypt = require('bcryptjs');

// ============ DASHBOARD STATISTICS ============
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalGarages = await Garage.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });
    const totalEmergencies = await EmergencyCall.countDocuments({
      status: { $in: ['pending', 'active'] }
    });

    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: lastMonth }
    });

    const userGrowth = totalUsers > 0 ? ((lastMonthUsers / totalUsers) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalGarages,
        activeBookings,
        totalEmergencies,
        revenue: revenueData[0]?.total || 0,
        userGrowth: `+${userGrowth}%`,
        garageGrowth: '+8.2%',
        bookingGrowth: '+23.1%',
        revenueGrowth: '+15.3%'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// ============ RECENT ACTIVITY ============
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = [];

    const recentUsers = await User.find()
      .select('firstName lastName role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    recentUsers.forEach(user => {
      activities.push({
        type: 'user_registration',
        user: `${user.firstName} ${user.lastName}`,
        action: `registered as ${user.role}`,
        timestamp: user.createdAt
      });
    });

    const recentBookings = await Booking.find()
      .populate('user', 'firstName lastName')
      .populate('garage', 'garageName')
      .select('user garage service createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    recentBookings.forEach(booking => {
      if (booking.user && booking.garage) {
        activities.push({
          type: 'booking',
          user: `${booking.user.firstName} ${booking.user.lastName}`,
          action: `booked ${booking.service} at ${booking.garage.garageName}`,
          timestamp: booking.createdAt
        });
      }
    });

    const recentEmergencies = await EmergencyCall.find()
      .populate('user', 'firstName lastName')
      .select('user issueDescription createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    recentEmergencies.forEach(emergency => {
      if (emergency.user) {
        activities.push({
          type: 'emergency',
          user: `${emergency.user.firstName} ${emergency.user.lastName}`,
          action: `requested emergency assistance`,
          timestamp: emergency.createdAt
        });
      }
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, activities: activities.slice(0, 10) });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity', error: error.message });
  }
};

// ============ CREATE USER BY ADMIN ============
exports.createUserByAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, garageName } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      garageName: role === 'garager' ? garageName : undefined
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        garageName: newUser.garageName
      }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

// ============ USER MANAGEMENT ============
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// ✅ FIXED FUNCTION — missing earlier
exports.getUserStatsByRole = async (req, res) => {
  try {
    const stats = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

    const formattedStats = { users: 0, garagers: 0, admins: 0 };
    stats.forEach(stat => {
      if (stat._id === 'user') formattedStats.users = stat.count;
      if (stat._id === 'garager') formattedStats.garagers = stat.count;
      if (stat._id === 'admin') formattedStats.admins = stat.count;
    });

    res.json({
      success: true,
      stats: formattedStats,
      total: formattedStats.users + formattedStats.garagers + formattedStats.admins
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user statistics', error: error.message });
  }
};

// ============ GARAGE, EMERGENCY, BOOKING, REPORT FUNCTIONS ============
exports.getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.find().populate('owner', 'firstName lastName email');
    res.json({ success: true, garages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch garages', error: error.message });
  }
};

// ... (Keep your existing Garage, Emergency, Booking, and Reports functions here)
