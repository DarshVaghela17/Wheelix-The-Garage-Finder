const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// ✅ All admin routes require authentication + admin role
router.use(auth);
router.use(roleCheck('admin'));

// ===== DASHBOARD =====
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/activity', adminController.getRecentActivity);

// ===== USER MANAGEMENT =====
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/users/stats', adminController.getUserStatsByRole);

// ✅ NEW: Create User (admin-only, safe, no logout)
router.post('/create-user', adminController.createUserByAdmin);

// ===== GARAGE MANAGEMENT =====
router.get('/garages', adminController.getAllGarages);
router.get('/garages/:id', adminController.getGarageById);
router.patch('/garages/:id/verify', adminController.verifyGarage);
router.patch('/garages/:id/status', adminController.updateGarageStatus);
router.delete('/garages/:id', adminController.deleteGarage);

// ===== EMERGENCY MANAGEMENT =====
router.get('/emergencies', adminController.getAllEmergencyCalls);
router.get('/emergencies/:id', adminController.getEmergencyById);
router.patch('/emergencies/:id/respond', adminController.updateEmergencyStatus);
router.patch('/emergencies/:id/assign', adminController.assignEmergencyToGarage);

// ===== BOOKING MANAGEMENT =====
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

// ===== REPORTS & ANALYTICS =====
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/users', adminController.getUserGrowthReport);

module.exports = router;
