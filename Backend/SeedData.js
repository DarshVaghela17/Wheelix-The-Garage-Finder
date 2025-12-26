const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Garage = require('./models/Garage');
const User = require('./models/Users');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    // await Garage.deleteMany({});
    // console.log('🗑️  Cleared existing garages');

    // Create sample garages
    const garages = [
      {
        garageName: 'QuickFix Auto',
        location: {
          address: '123 Main St, Ahmedabad',
          city: 'Ahmedabad',
          state: 'Gujarat',
          coordinates: { lat: 23.0225, lng: 72.5714 }
        },
        phone: '9876543210',
        services: ['Towing', 'Repair', 'Maintenance'],
        rating: 4.9,
        reviewCount: 234,
        isActive: true,
        isVerified: true,
        pricing: { hourlyRate: 500 },
        operatingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' }
        }
      },
      {
        garageName: 'Speedy Repairs',
        location: {
          address: '456 Park Ave, Ahmedabad',
          city: 'Ahmedabad',
          state: 'Gujarat',
          coordinates: { lat: 23.0325, lng: 72.5814 }
        },
        phone: '9876543211',
        services: ['Engine', 'Brakes', 'Oil Change'],
        rating: 4.7,
        reviewCount: 189,
        isActive: true,
        isVerified: true,
        pricing: { hourlyRate: 450 },
        operatingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '17:00' }
        }
      },
      {
        garageName: 'AutoCare Pro',
        location: {
          address: '789 Center St, Ahmedabad',
          city: 'Ahmedabad',
          state: 'Gujarat',
          coordinates: { lat: 23.0425, lng: 72.5914 }
        },
        phone: '9876543212',
        services: ['Full Service', 'AC Repair', 'Detailing'],
        rating: 4.8,
        reviewCount: 312,
        isActive: true,
        isVerified: true,
        pricing: { hourlyRate: 600 },
        operatingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '18:00' }
        }
      }
    ];

    const createdGarages = await Garage.insertMany(garages);
    console.log(`✅ Created ${createdGarages.length} garages`);

    console.log('🎉 Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
};

seedData();
