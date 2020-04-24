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

db.on('open', () => {
  console.log('connected to database');
  fs.readdir('./upload', (err, files) => {
    files.map((file) => {
      let filename = file;
      let name = file.replace(/_/g, ' ').split('+');
      let cid = parseInt(name[1].slice(0, 2));

      let cname = name[0];

      let tid = name[1];

      let tname = name[2].split('.').shift();
      console.log(cid, cname, tid, tname);
      csv()
        .fromFile('./upload/' + filename)
        .then((jsonObj) => {
          jsonObj.map((k, i) => {
            console.log(i);
            let que = k.Question;
            que = que.split('. ');
            que.shift();
            let newdef = k.Question;
            // if (que.length > 0) {
            //   newdef = newdef.split(". ");
            // } else {
            //   newdef = newdef.split("\t");
            // }
            // newdef.shift();
            // console.log(newdef, que);
            let obj = {
              category: {
                _id: cid,
                name: cname,
              },
              label: [],
              topic: {
                _id: tid,
                name: tname,
              },
              number: i,
              answer: k.Answer.toLowerCase(),
              options: {
                a: 'a) ' + k['Option A'],
                b: 'b) ' + k['Option B'],
                c: 'c) ' + k['Option C'],
                d: 'd) ' + k['Option D'],
              },
              qname: `Question ${i}`,
              qdef: newdef,
              hints: k['Explanation'],
            };
            let q = new Questions(obj);
            q.save();
          });
          /**
           * [
           * 	{a:"1", b:"2", c:"3"},
           * 	{a:"4", b:"5". c:"6"}
           * ]
           */
        });
    });
  });
});
