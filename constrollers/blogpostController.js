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
