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

exports.createComment = [
    body('comment').trim().isLength({min:1}).withMessage('Comment can not be empty'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body
            })
        }
        try {
            const comment = new Comment({
                comment: req.body.comment,
                author: req.author._id,
                blogpostid: req.params.blogpostid
            })
            comment.save(err => {
                if (err) {
                    res.status(400),json({err});
                }
                res.status(200).json({message: 'Comment saved', comment});
            })
            await Blogpost.findOneAndUpdate(
                {_id: req.params.blogpostid},
                {$push: {comments: comment}}
            )
        }
        catch (err) {
            res.status(400).json({err})
        }
    }
];