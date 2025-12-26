const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'garage', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  vehicle: {
    model: String,
    licensePlate: String,
    year: Number
  },
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
