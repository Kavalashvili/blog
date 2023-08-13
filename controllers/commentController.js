const Blogpost = require('../models/blogpost');
const Author = require('../models/author');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");

// Display comments on a post
exports.allComments = async (req, res, next) => {
    try {
        let comments = await Comment.find({blogpostid: req.params.blogpostid})

        return res.status(200).json({comments});
    }
    catch (err) {
        return res.status(404).json({err:'No comments'});
    }
}

// Create comment
exports.createComment = [
    body('comment').trim().isLength({min: 1}).withMessage('Comment cannot be empty'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body
            });
        }
        try {
            const comment = new Comment({
                comment: req.body.comment,
                author: req.body.author,
                blogpostid: req.params.blogpostid
            });
            
            // Save the comment
            const savedComment = await comment.save();

            // Update the corresponding blogpost with the comment
            await Blogpost.findOneAndUpdate(
                {_id: req.params.blogpostid},
                {$push: {comments: savedComment._id}}
            );

            return res.status(200).json({message: 'Comment saved', comment: savedComment});
        }
        catch (err) {
            return res.status(400).json({err});
        }
    }
];

// Delete a comment
exports.deleteComment = async (req, res, next) => {
    try {
        let comment = await Comment.findByIdAndDelete({_id: req.params.commentid})
        if (!comment) {
            return res.status(404).json({message: 'No such comment exists'})
        }
        else {
            let deleteComment = await Blogpost.findOneAndUpdate({
                _id: req.params.blogpostid
            })
        }
        return res.status(200).json({message: 'Comment deleted', comment: comment, deleteComment})
    }
    catch (err) {
        return next(err);
    }
}