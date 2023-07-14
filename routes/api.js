const express = require('express');
const router = express.Router();
const blogpostController = require('../constrollers/blogpostController');

router.get('/blogposts', blogpostController.allBlogposts);

router.get('/blogposts/:blogpostid', blogpostController.singleBlogpost);

module.exports = router;
