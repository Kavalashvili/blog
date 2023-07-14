const express = require('express');
const router = express.Router();
const blogpostController = require('../controllers/blogpostController');
const authorController = require('../controllers/authorController');

router.post('/login', authorController.login);

router.get('/blogposts', blogpostController.allBlogposts);

router.get('/blogposts/:blogpostid', blogpostController.singleBlogpost);

module.exports = router;
