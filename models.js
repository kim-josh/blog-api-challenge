const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String},
  author: {
    firstName: String,
    lastName: String
  },
  created: {type: Date, default: Date.now}
});

// adding a virtual to combine the first and last name of the author 
blogPostSchema.virtual('authorName').get(function() {
  const auth = this.author;
  return `${auth.firstName} ${auth.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created
  };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = {BlogPost};