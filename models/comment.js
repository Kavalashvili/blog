const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentScheam = new Schema({
    author: { type: String, required: true, minLength: 3, maxLength: 50 },
    comment: { type: String, required: true, minLegth: 1, maxLength: 1000 },
    timestamp: { type: Date, default: Date.now },
    blogpost: { type: Schema.Types.ObjectId, ref: 'Blogpost', required: true }
})

module.exports = mongoose.model('Comment', CommentScheam);
