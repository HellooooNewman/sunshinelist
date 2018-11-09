const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PeopleSchema = new Schema({
  sector: {
    type: String,
  },
  taxable_benefits: {
    type: Number,
  },
  salary_paid: {
    type: Number,
  },
  last_name: {
    type: String
  },
  first_name: {
    type: String,
  },
  calendar: {
    type: Number,
  },
  job_title: {
    type: String,
  },
  employer: {
    type: String,
  }
}, { collection: 'people' });


module.exports = Person = mongoose.model('people', PeopleSchema);