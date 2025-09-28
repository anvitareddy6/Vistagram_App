const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
});

// Validation middleware
const validatePost = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Username must be between 1 and 50 characters'),
  body('caption')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Caption must be between 1 and 500 characters')
];

const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid post ID')
];

// GET /api/posts - Get all posts (timeline)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({ isActive: true });
    
    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/trending - Get trending posts
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.getTrendingPosts(limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post
router.post('/', upload.single('image'), validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { username, caption, location, address } = req.body;
    
    const postData = {
      username,
      caption,
      image: req.file.filename
    };

    // Add location if provided
    if (location && Array.isArray(location) && location.length === 2) {
      postData.location = {
        type: 'Point',
        coordinates: location,
        address: address || ''
      };
    }

    const post = new Post(postData);
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Clean up uploaded file if post creation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// POST /api/posts/:id/like - Like/Unlike post
router.post('/:id/like', validateObjectId, [
  body('userId').trim().isLength({ min: 1 }).withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = post.hasUserLiked(userId);
    
    if (hasLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    
    res.json({ 
      likes: post.likes, 
      hasLiked: !hasLiked,
      message: hasLiked ? 'Post unliked' : 'Post liked'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// POST /api/posts/:id/share - Share post
router.post('/:id/share', validateObjectId, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.shares += 1;
    await post.save();
    
    res.json({ 
      shares: post.shares,
      shareUrl: `${req.protocol}://${req.get('host')}/post/${post._id}`,
      message: 'Post shared successfully'
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ error: 'Failed to share post' });
  }
});

// DELETE /api/posts/:id - Delete post (soft delete)
router.delete('/:id', validateObjectId, [
  body('userId').trim().isLength({ min: 1 }).withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // In a real app, you'd check if the user owns the post
    post.isActive = false;
    await post.save();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// GET /api/posts/user/:username - Get posts by user
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      username: username, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({ 
      username: username, 
      isActive: true 
    });
    
    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

module.exports = router;