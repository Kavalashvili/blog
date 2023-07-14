const Author = require('../models/author');
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display log in form form on GET.
exports.log_in_get = (req, res) => {
    res.render("log-in-form");
  };