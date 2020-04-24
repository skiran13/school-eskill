const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const path = require('path');
const debug = process.env.NODE_ENV !== 'production';
const io = require('socket.io')(server);
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const EventEmitter = require('events');
const Schema = mongoose.Schema;
const _ = require('lodash');
const dburl = require('../config.json').dburl;
const csv = require('csvtojson');
mongoose.connect(dburl, { useNewUrlParser: true });

let db = mongoose.connection;

let Questions = mongoose.model(
  'Questions',
  new Schema({
    category: Object,
    label: Array,
    topic: Object,
    answer: String,
    options: Object,
    qname: String,
    qdef: String,
    hints: String,
    number: Number,
  }),
  'Questions'
);
const fs = require('fs');
let UserDetails = mongoose.model(
  'UserDetails',
  new Schema({
    _id: String,
    level: Number,
    notifications: Array,
    details: {
      name: String,
      regNo: String,
      dob: Date,
      gender: String,
      department: String,
      students: Array,
      problems: Array,
      branch: String,
    },
  }),
  'UserDetails'
);
let Users = mongoose.model(
  'Users',
  new Schema({
    _id: String,
    email: String,
    password: String,
    type: String,
    level: Number,
    questions: Object,
  }),
  'Users'
);
db.on('open', () => {
  console.log('connected to database');

  Questions.remove({ 'topic.name': 'Aptitude Questions Part 1' });
});
