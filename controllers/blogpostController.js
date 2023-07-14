const Blogpost = require('../models/blogpost');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

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
