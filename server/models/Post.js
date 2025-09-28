const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    maxlength: [500, 'Caption cannot be more than 500 characters']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  shares: {
    type: Number,
    default: 0,
    min: [0, 'Shares cannot be negative']
  },
  likedBy: [{
    type: String,
    trim: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: {
      type: String,
      trim: true
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ createdAt: -1 });
postSchema.index({ username: 1 });
postSchema.index({ likes: -1 });
postSchema.index({ tags: 1 });

// Virtual for formatted timestamp
postSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
});

// Instance method to check if user has liked the post
postSchema.methods.hasUserLiked = function(userId) {
  return this.likedBy.includes(userId);
};

// Static method to get trending posts
postSchema.statics.getTrendingPosts = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to extract hashtags from caption
postSchema.pre('save', function(next) {
  if (this.isModified('caption')) {
    const hashtags = this.caption.match(/#\w+/g);
    if (hashtags) {
      this.tags = hashtags.map(tag => tag.slice(1).toLowerCase());
    }
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);