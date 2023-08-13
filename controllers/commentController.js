const Blogpost = require('../models/blogpost');
const Author = require('../models/author');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");

// Display comments on a post
exports.allComments = async (req, res, next) => {
    try {
        const blogpostId = req.params.blogpostid;
        const blogpost = await Blogpost.findById(blogpostId).populate('comments');

        if (!blogpost) {
            return res.status(404).json({ err: 'No such blogpost exists' });
        }

        const comments = blogpost.comments;

        return res.status(200).json({ comments });
    }
    catch (err) {
        return res.status(500).json({ err: 'Internal Server Error' });
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
                blogpost: req.params.blogpostid
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
        const commentId = req.params.commentid;
        const blogpostId = req.params.blogpostid;

        // Find and delete the comment
        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'No such comment exists' });
        }

        // Remove the comment ID from the blogpost's 'comments' array
        const blogpost = await Blogpost.findByIdAndUpdate(
            blogpostId,
            { $pull: { comments: commentId } },
            { new: true } // To get the updated blogpost after the comment is removed
        );

        return res.status(200).json({ message: 'Comment deleted', comment, blogpost });
    } catch (err) {
        return next(err);
    }
};