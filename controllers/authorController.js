const Blogpost = require('../models/blogpost');
const Author = require('../models/author');
const Comment = require('../models/comment');

const jwt = require('jsonwebtoken');
const passport = require('passport')
const { body, validationResult } = require('express-validator')

// login
exports.login = async function (req, res, next) {
    try {
      passport.authenticate('local', async (err, author) => {
        if (err || !author) {
          return res.status(403).json({ error: 'Authentication failed' });
        }
  
        const body = { _id: author._id, username: author.username };
        const token = jwt.sign({ author: body }, process.env.SECRET_KEY);
  
        return res.status(200).json({ body, token });
      })(req, res, next);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

exports.logout = (req, res, next) => {
    console.log('logged out')  
  };