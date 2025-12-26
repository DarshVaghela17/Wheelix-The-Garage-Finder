const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Apply middleware to all routes
router.use(auth);
router.use(roleCheck('garage'));

// ============ GARAGE ROUTES ============
// These routes will be implemented when you build the garage dashboard

// Example routes (you can implement these later):
// router.get('/dashboard', garageController.getDashboard);
// router.get('/profile', garageController.getProfile);
// router.patch('/profile', garageController.updateProfile);
// router.get('/bookings', garageController.getBookings);
// router.get('/emergencies', garageController.getEmergencies);
// router.patch('/emergencies/:id/respond', garageController.respondToEmergency);

// Placeholder route for testing
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Garage routes working!',
    garageId: req.user.id 
  });
});

module.exports = router;
