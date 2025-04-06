const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  summary: {
    type: String,
    maxlength: [200, 'Summary cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['technology', 'design', 'development', 'tutorial', 'insights']
  },
  featuredImage: {
    type: String,
    default: 'default-blog.jpg'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    name: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title
BlogSchema.pre('save', function(next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

// Add summary from content if not provided
BlogSchema.pre('save', function(next) {
  if (!this.summary && this.content) {
    this.summary = this.content.substring(0, 197) + '...';
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema); 