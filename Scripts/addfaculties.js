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
let Category = mongoose.model(
  'Category',
  new Schema({
    _id: Number,
    name: String,
    topics: Array,
  }),
  'Category'
);
let branches = [
  'Computer Science and Engineering',
  'Electronics and Communications Engineering',
  'Mechanical Engineering',
  'Electrical and Electronics Engineering',
  'Information Technology',
  'Civil Engineering',
];
let abbr = ['CSE', 'ECE', 'MECH', 'EEE', 'IT', 'CIVIL'];
let colleges = {
  'SRM Ramapuram': { id: '40000', a: 'RMP' },
  'SRM NCR': { id: '50000', a: 'NCR' },
  'SRM Amaravathi': { id: '60000', a: 'AMR' },
};
db.on('open', () => {
  console.log('connected to database');
  bcrypt.hash('eskilleskill', 10, function (err, hash) {
    user = new Users({
      _id: '200021',
      email: 'englishfaculty1@care.srumuniv.ac.in',
      password: hash,
      type: 'Faculty',
      level: 4,
    });
    details = new UserDetails({
      _id: '200021',
      level: 4,
      details: {
        name: 'SRM KTR Engish Faculty',
        regNo: '200021',
        department: 'English',
        branch: 'SRM Katankkulathur',
        students: [],
      },
    });
    user.save();
    details.save();
  });
});
