const Blogpost = require('../models/blogpost');
const Author = require('../models/author');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const blogpost = require('../models/blogpost');

// Display all posts
exports.allBlogposts = async function (req, res, next) {
    try {
        let blogposts = await Blogpost.find({}, {title: 1, text: 1, timestamp: 1})

        return res.status(200).json(blogposts);
    }
    catch(err) {
        return res.status(404).json({message: 'No Posts'});
    }
}

// Display single post
exports.singleBlogpost = async function (req, res, next) {
    try {
        let blogpost = await Blogpost.find({_id: req.params.blogpostid})

        if (!blogpost || blogpost.length === 0) {
            return res.status(404).json({message:'No post with this id'});
        }
        return res.status(200).json({blogpost});
    }
    catch(err) {
        return res.json({message:'Post does not exist'});
    }
}

// Delete single post
exports.deleteBlogpost = async function (req, res, next) {
    try {
        let blogpost = await Blogpost.findByIdAndDelete({_id: req.params.blogpostid});
        if(!blogpost) {
            return res.status(404).json({err: 'No such blogpost exists'});
        }
        // Remove comments for the blogpost
        let deleteComments = await Comment.deleteMany({blogpostId: req.params.blogpostid});
        res.status(200).json({message: `Post deleted successfully`, comments: deleteComments});
    }
    catch (err) {
        return next(err);
    }
}

// Create a blogpost
exports.createBlogpost = [
    body('title').trim().isLength({ min: 1 }).withMessage('Add a title'),
    body('text').trim().isLength({ min: 1 }).withMessage('Add text'),
  
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          data: req.body,
        });
      }
  
      try {
        const blogpost = new Blogpost({
          title: req.body.title,
          text: req.body.text,
          author: req.author._id,
        });
  
        await blogpost.save();
        console.log('Blogpost saved');
        res.status(200).json({ blogpost, token: req.author });
      } catch (err) {
        return next(err);
      }
    },
  ];

// Update blogpost
exports.updateBlogpost = async (req, res, next) => {
    try {
        let blogpost = await Blogpost.findByIdAndUpdate(req.params.blogpostid, {
            title: req.body.title,
            text: req.body.text
        });
        if (!blogpost) {
            return res.status(404).json({err: 'No such blogpost exists'});
        }
        res.status(200).json({message: 'Blogpost updated', blogpost: blogpost});
    }
    catch(err) {
        return next(err);
    }
}