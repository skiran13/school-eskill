const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const path = require('path')
const debug = process.env.NODE_ENV !== 'production'
const io = require('socket.io')(server)
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const EventEmitter = require('events')
const Schema = mongoose.Schema
const _ = require('lodash')
class Event extends EventEmitter {}
const dbCheck = new Event()
let validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
let getAcademicYear = () => {
  let academicYear
  if (new Date().getMonth + 1 < 7) {
    academicYear = `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`
  } else {
    academicYear = `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`
  }
  return academicYear
}
academicYear = getAcademicYear()
console.log(academicYear)
app.use(cookieParser())

app.use(express.static(path.resolve(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

const dburl = 'mongodb://test:test@ds135537.mlab.com:35537/eapproval'

const port_number = process.env.PORT || 2000

server.listen(port_number, () => {
  console.log('Listening on 2000')
})

mongoose.connect(dburl, { useNewUrlParser: true })

let db = mongoose.connection

let Users = mongoose.model(
  'Users',
  new Schema({
    _id: String,
    email: String,
    password: String,
    type: String,
    level: Number
  }),
  'Users'
)
let UserDetails = mongoose.model(
  'UserDetails',
  new Schema({
    _id: String,
    details: {
      name: String,
      regNo: String,
      mothersName: String,
      fathersName: String,
      dob: Date,
      gender: String,
      dateOfAdmission: Date,
      aadhar: String,
      passport: String,
      religion: String,
      lang: String,
      deg: String,
      department: String,
      courseDuration: String,
      currentYear: String,
      academicYear: String
    }
  }),
  'UserDetails'
)
let Category = mongoose.model(
  'Category',
  new Schema({
    _id: String,
    name: String,
    topics: Array
  }),
  'Category'
)
let validateLogin = (acc, content, e) => {
  console.log(content)
  if (acc != null) {
    if (acc.password == content.pass) {
      e.emit('success', acc)
    } else {
      e.emit('fail', 'np')
    }
  } else {
    e.emit('fail', 'nu')
  }
}
db.on('open', () => {
  console.log('connected to database')
})
io.on('connection', socket => {
  console.log('user connected')
  const loginCheck = new Event()
  let isLoggedIn = false
  socket.on('det', content => {
    console.log('details recieved')
    if (validateEmail(content.email)) {
      Users.findOne({ email: content.email }, (err, acc) => {
        validateLogin(acc, content, loginCheck)
      })
    } else {
      Users.findById(content.email, (err, acc) => {
        validateLogin(acc, content, loginCheck)
      })
    }
    loginCheck.on('success', acc => {
      console.log('login success')
      UserDetails.findById(acc._id, (err, details) => {
        socket.emit('validateLogin', {
          validate: true,
          details: details,
          level: acc.level,
          type: acc.type
        })
        Category.find().sort({ $natural: 1 }).exec((err, cats) => {
          socket.emit('categories', cats)
        })
      })

      socket.on('add', a => {})
    })
    loginCheck.on('fail', reason => {
      console.log(reason)
      socket.emit('fail', reason)
    })
  })
  socket.on('reg', r => {
    console.log(r)
    Users.findOne({ email: r.email }, (err, acc) => {
      if (acc == null) {
        Users.findById(r.email, (err, accid) => {
          if (accid == null) {
            loginCheck.emit('canRegister')
          }
        })
      }
    })
    loginCheck.on('canRegister', () => {
      let user = new Users({
        _id: r.regNo,
        email: r.email,
        password: r.password,
        type: 'Student',
        level: 0
      })
      let details = new UserDetails({
        _id: r.regNo,
        details: {
          name: r.name,
          regNo: r.regNo,
          mothersName: r.mothersName,
          fathersName: r.fathersName,
          dob: r.dob,
          gender: r.gender,
          dateOfAdmission: r.doa,
          aadhar: r.aadhar,
          passport: r.passport,
          religion: r.nationality,
          lang: r.medium,
          deg: r.deg,
          department: r.branch,
          courseDuration: r.courseDuration,
          currentYear: r.currentYear,
          academicYear: academicYear
        }
      })
      details.save()
      user.save()
    })
  })
  socket.on('addCategory', cat => {
    Category.findOne(
      {
        name: {
          $regex: new RegExp(`(${cat})\\b`, 'gi')
        }
      },
      (err, presentCat) => {
        if (presentCat == null) {
          socket.emit('catError', '')
          let el = Category.findOne()
            .limit(1)
            .sort({ $natural: -1 })
            .exec((err, el) => {
              // console.log(el)
              if (el == null) {
                let newCat = new Category({
                  _id: `1`,
                  name: `${cat}`,
                  topics: []
                })
                newCat.save()
              } else {
                let id = parseInt(el._id)
                id++
                let newCat = new Category({
                  _id: `${id}`,
                  name: `${cat}`,
                  topics: []
                })
                newCat.save(err => {
                  if (err == null) {
                    Category.find().sort({ $natural: 1 }).exec((err, cats) => {
                      socket.emit('categories', cats)
                    })
                  }
                })
              }
            })
        } else {
          socket.emit('catError', 'Category already exists!')
          console.log('exists')
        }
      }
    )
  })
  socket.on('addTopic', info => {
    Category.findOne(
      {
        name: {
          $regex: new RegExp(`(${info.category})\\b`, 'gi')
        }
      },
      (err, cat) => {
        if (_.findIndex(cat.topics, { name: info.topic }) == -1) {
          cat.topics.push({
            id: `${cat._id * 100 + cat.topics.length + 1}`,
            name: info.topic
          })
          cat.markModified('topics')
          cat.save((err, sct) => {
            console.log(sct)
          })
        } else {
          socket.emit('topError', 'Topic already exists!')
          console.log('exists')
        }
      }
    )
  })
})
