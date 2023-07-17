const express = require('express');
const router = express.Router();
const blogpostController = require('../controllers/blogpostController');
const authorController = require('../controllers/authorController');

router.post('/login', authorController.login);

router.post('/logout', authorController.logout);

router.get('/blogposts', blogpostController.allBlogposts);

router.get('/blogposts/:blogpostid', blogpostController.singleBlogpost);

router.delete('/blogposts/:blogpostid', blogpostController.deleteBlogpost);

module.exports = router;
