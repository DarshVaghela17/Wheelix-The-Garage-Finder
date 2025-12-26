const User = require('../models/Users');
const Garage = require('../models/Garage');
const Booking = require('../models/Booking');
const EmergencyCall = require('../models/EmergencyCall');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// ============ HOME / DASHBOARD ============

/**
 * Get dashboard statistics - IMPROVED with real rating calculation
 * @route GET /api/user/dashboard/stats
 * @access Private (User only)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📊 Fetching dashboard stats for user:', userId);

    // Fetch all stats in parallel
    const [
      nearbyGaragesCount,
      emergencyCallsCount,
      myBookingsCount,
      completedBookings
    ] = await Promise.all([
      Garage.countDocuments({ isActive: true, isVerified: true }),
      EmergencyCall.countDocuments({
        user: userId,
        status: { $in: ['pending', 'active', 'assigned', 'responded'] }
      }),
      Booking.countDocuments({
        user: userId,
        status: { $in: ['pending', 'confirmed', 'in-progress'] }
      }),
      Booking.find({
        user: userId,
        status: 'completed',
        rating: { $exists: true, $ne: null }
      }).select('rating')
    ]);

    console.log('📈 Stats Results:', {
      nearbyGarages: nearbyGaragesCount,
      emergencyCalls: emergencyCallsCount,
      myBookings: myBookingsCount,
      completedBookings: completedBookings.length
    });

    // Calculate average rating
    let avgRating = 0;
    if (completedBookings.length > 0) {
      const totalRating = completedBookings.reduce((sum, booking) => {
        return sum + (booking.rating || 0);
      }, 0);
      avgRating = totalRating / completedBookings.length;
    }

    const stats = {
      nearbyGarages: nearbyGaragesCount,
      emergencyCalls: emergencyCallsCount,
      myBookings: myBookingsCount,
      avgRating: parseFloat(avgRating.toFixed(1))
    };

    console.log('✅ Sending stats:', stats);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

/**
 * Get nearby garages
 * @route GET /api/user/garages/nearby
 * @access Private (User only)
 */
exports.getNearbyGarages = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    // In production, use MongoDB geospatial queries
    // For now, return all active garages
    const garages = await Garage.find({ isActive: true, isVerified: true })
      .select('garageName location services rating pricing operatingHours phone')
      .limit(10);

    res.json({
      success: true,
      garages
    });
  } catch (error) {
    console.error('Nearby garages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby garages',
      error: error.message
    });
  }
};

/**
 * Get top-rated garages - IMPROVED with distance
 * @route GET /api/user/garages/top-rated
 * @access Private (User only)
 */
exports.getTopRatedGarages = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const garages = await Garage.find({ isActive: true, isVerified: true })
      .populate('owner', 'firstName lastName phone')
      .select('garageName location rating reviewCount services phone isActive')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    // Add mock distance (in production, use geospatial queries)
    const garagesWithDistance = garages.map((garage, index) => {
      const mockDistances = ['1.2 km', '2.5 km', '3.1 km', '4.8 km', '5.2 km'];
      return {
        _id: garage._id,
        garageName: garage.garageName,
        rating: garage.rating || 0,
        reviewCount: garage.reviewCount || 0,
        phone: garage.phone || garage.owner?.phone || 'N/A',
        isActive: garage.isActive,
        distance: mockDistances[index] || `${(Math.random() * 10).toFixed(1)} km`,
        location: garage.location,
        services: garage.services
      };
    });

    res.json({
      success: true,
      garages: garagesWithDistance
    });
  } catch (error) {
    console.error('Top rated garages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated garages',
      error: error.message
    });
  }
};

// ============ GARAGE LIST ============

/**
 * Get all garages with filters
 * @route GET /api/user/garages
 * @access Private (User only)
 */
exports.getAllGarages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      service,
      minRating,
      sortBy = 'rating'
    } = req.query;
    
    const query = { isActive: true, isVerified: true };

    if (search) {
      query.$or = [
        { garageName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    if (service) {
      query.services = { $in: [service] };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'distance':
        sortOptions = { 'location.city': 1 };
        break;
      case 'price':
        sortOptions = { 'pricing.hourlyRate': 1 };
        break;
      default:
        sortOptions = { rating: -1 };
    }

    const garages = await Garage.find(query)
      .populate('owner', 'firstName lastName phone')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('garageName location services rating reviewCount pricing operatingHours phone isActive');

    const count = await Garage.countDocuments(query);

    // Add mock distance
    const garagesWithDetails = garages.map((garage, index) => {
      const mockDistances = ['1.2 km', '2.5 km', '3.1 km', '4.8 km', '5.2 km', '6.7 km'];
      return {
        _id: garage._id,
        name: garage.garageName,
        rating: garage.rating || 0,
        reviews: garage.reviewCount || 0,
        distance: mockDistances[index % mockDistances.length],
        price: garage.pricing?.hourlyRate ? `₹${garage.pricing.hourlyRate}/hr` : 'N/A',
        hours: garage.operatingHours?.monday ? 
          `${garage.operatingHours.monday.open} - ${garage.operatingHours.monday.close}` : 
          '9 AM - 6 PM',
        services: garage.services || [],
        available: garage.isActive,
        phone: garage.phone || garage.owner?.phone || 'N/A',
        location: garage.location
      };
    });

    res.json({
      success: true,
      garages: garagesWithDetails,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get garages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch garages',
      error: error.message
    });
  }
};

/**
 * Search garages
 * @route GET /api/user/garages/search
 * @access Private (User only)
 */
exports.searchGarages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.json({
        success: true,
        garages: []
      });
    }

    const garages = await Garage.find({
      $or: [
        { garageName: { $regex: query, $options: 'i' } },
        { services: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.address': { $regex: query, $options: 'i' } }
      ],
      isActive: true,
      isVerified: true
    })
      .populate('owner', 'phone')
      .limit(20)
      .select('garageName rating reviewCount location services phone pricing isActive');

    const garagesWithDetails = garages.map((garage, index) => {
      const mockDistances = ['1.2 km', '2.5 km', '3.1 km', '4.8 km', '5.2 km'];
      return {
        _id: garage._id,
        name: garage.garageName,
        rating: garage.rating || 0,
        reviews: garage.reviewCount || 0,
        distance: mockDistances[index % mockDistances.length],
        price: garage.pricing?.hourlyRate ? `₹${garage.pricing.hourlyRate}/hr` : 'N/A',
        services: garage.services || [],
        available: garage.isActive,
        phone: garage.phone || garage.owner?.phone || 'N/A',
        location: garage.location
      };
    });

    res.json({
      success: true,
      garages: garagesWithDetails,
      count: garagesWithDetails.length
    });
  } catch (error) {
    console.error('Search garages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search garages',
      error: error.message
    });
  }
};

/**
 * Get garage by ID
 * @route GET /api/user/garages/:id
 * @access Private (User only)
 */
exports.getGarageById = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');

    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }

    res.json({
      success: true,
      garage: {
        _id: garage._id,
        name: garage.garageName,
        rating: garage.rating || 0,
        reviews: garage.reviewCount || 0,
        price: garage.pricing?.hourlyRate ? `₹${garage.pricing.hourlyRate}/hr` : 'N/A',
        hours: garage.operatingHours,
        services: garage.services || [],
        available: garage.isActive,
        phone: garage.phone || garage.owner?.phone || 'N/A',
        location: garage.location,
        description: garage.description,
        images: garage.images,
        owner: garage.owner
      }
    });
  } catch (error) {
    console.error('Get garage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch garage',
      error: error.message
    });
  }
};

/**
 * Book garage service
 * @route POST /api/user/garages/:id/book
 * @access Private (User only)
 */
exports.bookGarageService = async (req, res) => {
  try {
    const garageId = req.params.id;
    const { service, scheduledTime, description, vehicleDetails } = req.body;

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({
        success: false,
        message: 'Garage not found'
      });
    }

    if (!garage.isActive || !garage.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This garage is not available for bookings'
      });
    }

    const booking = new Booking({
      user: req.user.id,
      garage: garageId,
      service,
      scheduledTime: new Date(scheduledTime),
      description,
      vehicleDetails,
      status: 'pending',
      amount: garage.pricing?.hourlyRate || 0
    });

    await booking.save();
    await booking.populate('garage', 'garageName location phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking
    });
  } catch (error) {
    console.error('Book garage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// ============ EMERGENCY SERVICES ============

/**
 * Get all user's emergencies
 * @route GET /api/user/emergencies
 * @access Private (User only)
 */
exports.getUserEmergencies = async (req, res) => {
  try {
    const userId = req.user.id;

    const emergencies = await EmergencyCall.find({ user: userId })
      .populate('garage', 'garageName location phone')
      .populate('respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emergencies,
      count: emergencies.length
    });
  } catch (error) {
    console.error('Get emergencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergencies',
      error: error.message
    });
  }
};

/**
 * Create new emergency call
 * @route POST /api/user/emergencies
 * @access Private (User only)
 */
exports.createEmergency = async (req, res) => {
  try {
    const { issueDescription, location, priority, vehicleDetails } = req.body;

    if (!issueDescription || !location) {
      return res.status(400).json({
        success: false,
        message: 'Issue description and location are required'
      });
    }

    const emergency = new EmergencyCall({
      user: req.user.id,
      issueDescription,
      location,
      priority: priority || 'high',
      vehicleDetails,
      status: 'pending'
    });

    await emergency.save();
    await emergency.populate('user', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Emergency call created successfully! Help is on the way!',
      emergency
    });
  } catch (error) {
    console.error('Create emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create emergency call',
      error: error.message
    });
  }
};

/**
 * Get emergency by ID
 * @route GET /api/user/emergencies/:id
 * @access Private (User only)
 */
exports.getEmergencyById = async (req, res) => {
  try {
    const emergency = await EmergencyCall.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('garage', 'garageName location phone services')
      .populate('respondedBy', 'firstName lastName');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    if (emergency.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.json({ success: true, emergency });
  } catch (error) {
    console.error('Get emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency',
      error: error.message
    });
  }
};

/**
 * Cancel emergency call
 * @route PATCH /api/user/emergencies/:id/cancel
 * @access Private (User only)
 */
exports.cancelEmergency = async (req, res) => {
  try {
    const emergency = await EmergencyCall.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    if (emergency.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (emergency.status === 'completed' || emergency.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${emergency.status} emergency`
      });
    }

    emergency.status = 'cancelled';
    emergency.cancelledAt = new Date();
    await emergency.save();

    res.json({
      success: true,
      message: 'Emergency cancelled successfully',
      emergency
    });
  } catch (error) {
    console.error('Cancel emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel emergency',
      error: error.message
    });
  }
};

/**
 * Get emergency stats
 * @route GET /api/user/emergencies/stats
 * @access Private (User only)
 */
exports.getEmergencyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await EmergencyCall.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      pending: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json({
      success: true,
      stats: formattedStats
    });
  } catch (error) {
    console.error('Get emergency stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency stats',
      error: error.message
    });
  }
};

// ============ HISTORY ============

/**
 * Get user history (bookings + emergencies)
 * @route GET /api/user/history
 * @access Private (User only)
 */
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    let logs = [];

    if (type === 'booking' || type === 'all' || !type) {
      const bookings = await Booking.find({ user: userId })
        .populate('garage', 'garageName location')
        .sort({ scheduledTime: -1 });

      bookings.forEach(booking => {
        logs.push({
          id: booking._id,
          type: 'booking',
          garage: booking.garage.garageName,
          service: booking.service,
          date: booking.scheduledTime,
          time: new Date(booking.scheduledTime).toLocaleTimeString(),
          status: booking.status,
          amount: booking.amount || '₹0',
          rating: booking.rating || 0,
          location: booking.garage.location?.address || 'N/A'
        });
      });
    }

    if (type === 'emergency' || type === 'all' || !type) {
      const emergencies = await EmergencyCall.find({ user: userId })
        .populate('garage', 'garageName location')
        .sort({ createdAt: -1 });

      emergencies.forEach(emergency => {
        logs.push({
          id: emergency._id,
          type: 'emergency',
          garage: emergency.garage?.garageName || 'Not Assigned',
          service: emergency.issueDescription,
          date: emergency.createdAt,
          time: new Date(emergency.createdAt).toLocaleTimeString(),
          status: emergency.status,
          amount: emergency.amount || '₹0',
          rating: emergency.rating || 0,
          location: emergency.location?.address || 'N/A'
        });
      });
    }

    logs.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      logs,
      total: logs.length
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
};

/**
 * Get booking history
 * @route GET /api/user/history/bookings
 * @access Private (User only)
 */
exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('garage', 'garageName location')
      .sort({ scheduledTime: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get booking history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking history',
      error: error.message
    });
  }
};

/**
 * Get history item by ID
 * @route GET /api/user/history/:id
 * @access Private (User only)
 */
exports.getHistoryItemById = async (req, res) => {
  try {
    let item = await Booking.findById(req.params.id)
      .populate('garage', 'garageName location phone services')
      .populate('user', 'firstName lastName email phone');

    if (item) {
      return res.json({ success: true, item, type: 'booking' });
    }

    item = await EmergencyCall.findById(req.params.id)
      .populate('garage', 'garageName location phone')
      .populate('user', 'firstName lastName email phone');

    if (item) {
      return res.json({ success: true, item, type: 'emergency' });
    }

    res.status(404).json({
      success: false,
      message: 'History item not found'
    });
  } catch (error) {
    console.error('Get history item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history item',
      error: error.message
    });
  }
};

/**
 * Rate service
 * @route POST /api/user/history/:id/rate
 * @access Private (User only)
 */
exports.rateService = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params;

    let item = await Booking.findById(id);

    if (!item) {
      item = await EmergencyCall.findById(id);
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    item.rating = rating;
    item.review = review;
    item.ratedAt = new Date();
    await item.save();

    if (item.garage) {
      const garage = await Garage.findById(item.garage);
      if (garage) {
        const totalRatings = garage.reviewCount || 0;
        const currentRating = garage.rating || 0;
        garage.rating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
        garage.reviewCount = totalRatings + 1;
        await garage.save();
      }
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      item
    });
  } catch (error) {
    console.error('Rate service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
};

/**
 * Download receipt
 * @route GET /api/user/history/:id/receipt
 * @access Private (User only)
 */
exports.downloadReceipt = async (req, res) => {
  try {
    let item = await Booking.findById(req.params.id)
      .populate('garage', 'garageName location')
      .populate('user', 'firstName lastName email');

    if (!item) {
      item = await EmergencyCall.findById(req.params.id)
        .populate('garage', 'garageName location')
        .populate('user', 'firstName lastName email');
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    if (item.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const receipt = {
      receiptNumber: `REC-${item._id}`,
      date: item.completedAt || item.createdAt,
      user: `${item.user.firstName} ${item.user.lastName}`,
      garage: item.garage?.garageName || 'N/A',
      service: item.service || item.issueDescription,
      amount: item.amount || 0,
      status: item.status
    };

    res.json({
      success: true,
      receipt
    });
  } catch (error) {
    console.error('Download receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download receipt',
      error: error.message
    });
  }
};

// ============ PROFILE ============

/**
 * Get user profile
 * @route GET /api/user/profile
 * @access Private (User only)
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * @route PATCH /api/user/profile
 * @access Private (User only)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, phone, location },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Change password
 * @route PATCH /api/user/profile/password
 * @access Private (User only)
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// ============ BOOKINGS ============

/**
 * Get user bookings
 * @route GET /api/user/bookings
 * @access Private (User only)
 */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('garage', 'garageName location phone services')
      .sort({ scheduledTime: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * Create booking
 * @route POST /api/user/bookings
 * @access Private (User only)
 */
exports.createBooking = async (req, res) => {
  try {
    const { garageId, service, scheduledTime, description } = req.body;

    const booking = new Booking({
      user: req.user.id,
      garage: garageId,
      service,
      scheduledTime,
      description,
      status: 'pending'
    });

    await booking.save();
    await booking.populate('garage', 'garageName location');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

/**
 * Cancel booking
 * @route PATCH /api/user/bookings/:id/cancel
 * @access Private (User only)
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};
