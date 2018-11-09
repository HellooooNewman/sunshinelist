const express = require('express');
const router = express.Router();

// Post Model
const Person = require('../models/People');

const pagingLimit = 15;

// @route  GET api/posts/test
// @desc   Tests posts route
// @access Public
router.get('/test', (req, res) => res.json({
    msg: 'People works'
}));

// @route  GET api/sunshiners
// @desc   Get sunshiners
// @access Public
router.get('/', (req, res) => {
  const errors = {};
  Person
    .find()
    .limit(pagingLimit)
    .sort({salary_paid: -1})
    .then(people => {
      if (!people) {
        errors.noprofile = 'There are no profiles';
        res.status(404).json(errors);
      }

      return res.json(people)
    })
    .catch(err => res.status(404).json({
        nopeoplefound: 'No people found'
    }));
});

// @route  GET api/sunshiners?sector=&taxable_benefits=&salary_paid=&last_name=&first_name=&calendar=&job_title=&employer=
// @desc   Get sunshiners
// @access Public
router.get('/search', (req, res) => {
  const errors = {};

  let { sector, taxable_benefits, taxable_benefits_sort, salary_paid, salary_paid_sort, last_name, first_name, calendar, job_title, employer, page } = req.query;

  let searchArray = {}
  if(sector != undefined){
    searchArray.sector = sector
  }
  if(taxable_benefits != undefined){
    if(taxable_benefits_sort === undefined) {
      if(taxable_benefits_sort === "gt") {
        searchArray.taxable_benefits = { $gt : taxable_benefits }
      } else {
        searchArray.taxable_benefits = { $lt : taxable_benefits }
      }
    } else {
      searchArray.taxable_benefits = { $gt : taxable_benefits}
    }
  }
  if(salary_paid != undefined){
    if(salary_paid_sort === undefined) {
      if(salary_paid_sort === "gt") {
        searchArray.salary_paid = { $gt : salary_paid }
      } else {
        searchArray.salary_paid = { $lt : salary_paid }
      }
    } else {
      searchArray.salary_paid = { $gt : salary_paid}
    }
  }
  if(last_name != undefined){
    searchArray.last_name = {$regex : last_name}
    // searchArray.last_name = last_name
  }
  if(first_name != undefined){
    searchArray.first_name = {$regex : first_name}
    // searchArray.first_name = first_name
  }
  if(calendar != undefined){
    searchArray.calendar = calendar
  }
  if(job_title != undefined){
    searchArray.job_title = job_title
  }
  if(employer != undefined){
    searchArray.employer = employer
  }
  if(page != undefined){
    page = 0;
  }

  Person
    .find(searchArray)
    .limit(pagingLimit)
    .skip(pagingLimit * page)
    .sort({salary_paid: -1})
    .then(people => {
      if (!people) {
        errors.noprofile = 'There are no profiles';
        res.status(404).json(errors);
      }

      return res.json(people)
    })
    .catch(err => res.status(404).json({
        nopeoplefound: 'No people found'
    }));
});


// @route  GET api/people/:id
// @desc   Get post by id
// @access Public
// /$year/$sector/$page/salary_paid_num


module.exports = router;