const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
    title: { type: String, required: true, minLength: 1 },
    text: { type: String, required: true, minLength: 1 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    timestamp: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false }
})

// virtual for blogpost URL
BlogpostSchema.virtual('url').get(function () {
    return `/blogpost/${this._id}`;
})

module.exports = mongoose.model('Blogpost', BlogpostSchema);