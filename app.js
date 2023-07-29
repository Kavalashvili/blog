const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Author = require('./models/author');
const bcrypt = require('bcryptjs');

const apiRouter = require('./routes/api');

const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Set up JWT strategy for Passport
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true
    },
    async (req, jwtPayload) => {
      try {
        const author = await Author.findById(jwtPayload.author._id);
        if (author) {
          req.user = author;
          return author;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const author = await Author.findOne({ username: username });
      if (!author) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isPasswordValid = await bcrypt.compare(password, author.password);
      if (isPasswordValid) {
        return done(null, author);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function(author, done) {
  done(null, author.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const author = await Author.findById(id);
    done(null, author);
  } catch(err) {
    done(err);
  };
});

// Set default title for all pages
app.locals.title = 'Blog';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use(passport.initialize());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
