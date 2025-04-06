const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ]
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    trim: true
  },
  subscribedDate: {
    type: Date,
    default: Date.now
  },
  unsubscribedDate: {
    type: Date
  },
  categories: [{
    type: String,
    enum: ['general', 'blog', 'resources', 'updates', 'tutorials']
  }]
});

module.exports = mongoose.model('Newsletter', NewsletterSchema); 