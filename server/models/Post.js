import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  }
}, {
  timestamps: true
});

// Add text index for search functionality
postSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;