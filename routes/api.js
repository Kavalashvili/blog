const express = require('express');
const router = express.Router();
const passport = require('passport');
const blogpostController = require('../controllers/blogpostController');
const authorController = require('../controllers/authorController');
const commentController = require('../controllers/commentController');

router.post('/login', authorController.login);

router.post('/logout', authorController.logout);

router.get('/blogposts', blogpostController.allBlogposts);

router.get('/blogposts/:blogpostid', blogpostController.singleBlogpost);

router.delete('/blogposts/:blogpostid', passport.authenticate('jwt', {session: false}), blogpostController.deleteBlogpost);

router.post('/blogposts', passport.authenticate('jwt', {session: false}), blogpostController.createBlogpost);

router.put('/blogposts/:blogpostid/update', passport.authenticate('jwt', {session: false}), blogpostController.updateBlogpost);

router.get('/blogposts/:blogpostid/comments', commentControler.allComments);

module.exports = router;
