const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
  companyDesignation: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
  },

  phoneNumbers: [
    {
      label: {
        type: String,
        enum: ['work', 'personal', 'home', 'other'],
        default: 'other',
      },
      countryCode: {
        type: String,
        trim: true,
      },
      number: {
        type: String,
        trim: true,
      },
    },
  ],

  emails: [
    {
      label: {
        type: String,
        enum: ['work', 'personal', 'other'],
        default: 'other',
      },
      emailAddress: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
  ],

  contactDetails: {
    address: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    googleMapLink: { type: String, trim: true },
  },
},
{
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
