const Blogpost = require('../models/blogpost');
const Author = require('../models/author');
const Comment = require('../models/comment');

const { body, validationResult } = require("express-validator");

exports.allComments = async (req, res, next) => {
    try {
        let comments = await Comment.find({blogpostid: req.params.blogpostid})

        return res.status(200).json({comments});
    }
    catch (err) {
        return res.status(404).json({err:'No comments'});
    }
}