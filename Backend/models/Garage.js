const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  garageName: {
    type: String,
    required: [true, 'Garage name is required'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  services: [{
    type: String,
    trim: true
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  pricing: {
    hourlyRate: Number,
    emergencyFee: Number
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes
garageSchema.index({ 'location.coordinates': '2dsphere' });
garageSchema.index({ isActive: 1, isVerified: 1 });
garageSchema.index({ rating: -1 });

module.exports = mongoose.model('Garage', garageSchema);
