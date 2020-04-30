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

db.on('open', () => {
  console.log('connected to database');
  Users.bulkWrite(
    Array(11)
      .fill()
      .map((_, i) => {
        var h;
        var id = 's' + i.toString();
        h = bcrypt.hashSync(id, 10);

        return {
          insertOne: {
            document: {
              _id: id,
              email: id + '@s.com',
              password: h,
              type: 'Student',
              level: 0,
              __v: 0,
            },
          },
        };
      })
  );

  UserDetails.bulkWrite(
    Array(11)
      .fill()
      .map((_, i) => {
        var id = 's' + i.toString();
        return {
          insertOne: {
            document: {
              _id: id,
              level: 0,
              details: {
                name: id,
                regNo: id,
                department: 'Class ' + i,
                branch: 'SRM Public School',
                students: [],
              },
              __v: 0,
            },
          },
        };
      }),
    (e, res) => {
      console.log(res);
    }
  );
});
