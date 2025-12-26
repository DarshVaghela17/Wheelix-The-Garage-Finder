const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Import controller AFTER defining router
const userController = require('../controller/userController');

// Apply middleware to all routes
router.use(auth);
router.use(roleCheck('user'));

// ============ HOME PAGE ============
router.get('/dashboard/stats', userController.getDashboardStats);
router.get('/garages/top-rated', userController.getTopRatedGarages);
router.get('/garages/nearby', userController.getNearbyGarages);

// ============ GARAGE LIST ============
router.get('/garages', userController.getAllGarages);
router.get('/garages/search', userController.searchGarages);
router.get('/garages/:id', userController.getGarageById);
router.post('/garages/:id/book', userController.bookGarageService);

// ============ EMERGENCY ============
router.get('/emergencies', userController.getUserEmergencies);
router.post('/emergencies', userController.createEmergency);
router.get('/emergencies/stats', userController.getEmergencyStats);
router.get('/emergencies/:id', userController.getEmergencyById);
router.patch('/emergencies/:id/cancel', userController.cancelEmergency);

// ============ HISTORY ============
router.get('/history', userController.getUserHistory);
router.get('/history/bookings', userController.getBookingHistory);
router.get('/history/:id', userController.getHistoryItemById);
router.post('/history/:id/rate', userController.rateService);
router.get('/history/:id/receipt', userController.downloadReceipt);

// ============ PROFILE ============
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/profile/password', userController.changePassword);

// ============ BOOKINGS ============
router.get('/bookings', userController.getUserBookings);
router.post('/bookings', userController.createBooking);
router.patch('/bookings/:id/cancel', userController.cancelBooking);

module.exports = router;
