const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    // Query parameters
    const { category, author, tag, limit, page, sort } = req.query;

    // Build query
    let query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }
    
    if (author) {
      query.author = author;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    
    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    
    if (sort === 'title') sortOptions = { title: 1 };
    if (sort === 'views') sortOptions = { viewCount: -1 };
    if (sort === 'likes') sortOptions = { 'likes.length': -1 };
    
    // Execute query
    const total = await Blog.countDocuments(query);
    
    const blogs = await Blog.find(query)
      .populate('author', 'username profileImage')
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limitNum);
    
    // Pagination info
    const pagination = {
      total,
      pages: Math.ceil(total / limitNum),
      current: pageNum,
      perPage: limitNum
    };
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email profileImage bio')
      .populate('comments.user', 'username profileImage');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment view count if not admin
    if (!req.user || req.user.role !== 'admin') {
      blog.viewCount += 1;
      await blog.save();
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, featuredImage, tags, status } = req.body;
    
    // Create blog
    const blog = await Blog.create({
      title,
      content,
      category,
      featuredImage,
      tags: tags || [],
      author: req.user.id,
      status: status || 'published'
    });
    
    // Add blog to user's blogs array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { blogs: blog._id }
    });
    
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user is the author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }
    
    // Fields to update
    const fieldsToUpdate = {};
    
    if (req.body.title) fieldsToUpdate.title = req.body.title;
    if (req.body.content) fieldsToUpdate.content = req.body.content;
    if (req.body.category) fieldsToUpdate.category = req.body.category;
    if (req.body.featuredImage) fieldsToUpdate.featuredImage = req.body.featuredImage;
    if (req.body.tags) fieldsToUpdate.tags = req.body.tags;
    if (req.body.status) fieldsToUpdate.status = req.body.status;
    
    // Update blog
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user is the author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }
    
    // Remove blog from user's blogs array
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id }
    });
    
    // Delete blog
    await blog.remove();
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Add comment
    blog.comments.unshift({
      user: req.user.id,
      text,
      name: req.user.username
    });
    
    await blog.save();
    
    res.status(201).json({
      success: true,
      data: blog.comments,
      message: 'Comment added successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like/unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if blog already liked by user
    const likedIndex = blog.likes.findIndex(
      like => like.toString() === req.user.id
    );
    
    if (likedIndex === -1) {
      // Add like
      blog.likes.unshift(req.user.id);
      await blog.save();
      
      return res.status(200).json({
        success: true,
        liked: true,
        likesCount: blog.likes.length,
        message: 'Blog liked successfully'
      });
    } else {
      // Remove like
      blog.likes = blog.likes.filter(
        like => like.toString() !== req.user.id
      );
      await blog.save();
      
      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: blog.likes.length,
        message: 'Blog unliked successfully'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 