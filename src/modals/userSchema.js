const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6,
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('User', userSchema);


