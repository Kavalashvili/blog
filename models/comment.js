const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentScheam = new Schema({
    username: { type: String, required: true, minLength: 3, maxLength: 50 },
    text: { type: String, required: true, minLegth: 1, maxLength: 1000 },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', CommentScheam);
