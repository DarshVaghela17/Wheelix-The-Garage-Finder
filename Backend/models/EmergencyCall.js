const mongoose = require('mongoose');

const emergencyCallSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage'
  },
  issueDescription: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  vehicleDetails: {
    model: String,
    licensePlate: String,
    year: Number
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'assigned', 'responded', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  estimatedArrival: Date,
  notes: String,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  review: String,
  amount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for faster queries
emergencyCallSchema.index({ user: 1, createdAt: -1 });
emergencyCallSchema.index({ garage: 1, status: 1 });
emergencyCallSchema.index({ status: 1, priority: -1 });
emergencyCallSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('EmergencyCall', emergencyCallSchema);
