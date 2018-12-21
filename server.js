const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const debug = process.env.NODE_ENV !== "production";
const io = require("socket.io")(server, {
  path: "/eskill/socket.io",
  transports: ["polling", "xhr-polling"],
  pingTimeout: 360000
});

io.sockets.setMaxListeners(0);
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const EventEmitter = require("events");
const nodemailer = require("nodemailer");
var redis = require("socket.io-redis");
let sticky = require("sticky-session");
io.adapter(redis({ host: "localhost", port: 6379 }));
const Schema = mongoose.Schema;
const _ = require("lodash");
class Event extends EventEmitter {}
let mode = false;
var redis = require("redis-eventemitter");
var pubsub = redis({
  url: "redis://redis@localhost:6379/"
});
pubsub.setMaxListeners(0);
let concurrentUsers = 0;
const dbCheck = new Event();
dbCheck.setMaxListeners(8000000);
function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
let validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
let getAcademicYear = () => {
  let academicYear;
  if (new Date().getMonth + 1 < 7) {
    academicYear = `${new Date().getFullYear() -
      1} - ${new Date().getFullYear()}`;
  } else {
    academicYear = `${new Date().getFullYear()} - ${new Date().getFullYear() +
      1}`;
  }
  return academicYear;
};
let notifications = [];
let dbconnect = false;
academicYear = getAcademicYear();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/eskill", express.static(path.resolve(__dirname, "dist")));

let config = require("./config.json");
let { dburl, email: emailid, password, reset: resetURL, stagingurl } = config;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailid,
    pass: password
  }
});
mongoose.connect(
  dburl,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

let Users = mongoose.model(
  "Users",
  new Schema({
    _id: String,
    email: String,
    password: String,
    type: String,
    level: Number,
    questions: Object
  }),
  "Users"
);
let Label = mongoose.model(
  "Label",
  new Schema({
    _id: String,
    name: String
  })
);
let Tags = mongoose.model(
  "Tags",
  new Schema({
    group: String,
    name: String
  }),
  "Tags"
);
let Questions = mongoose.model(
  "Questions",
  new Schema({
    category: Object,
    label: Array,
    topic: Object,
    answer: String,
    options: Object,
    qname: String,
    qdef: String,
    hints: String,
    number: Number
  }),
  "Questions"
);
let UserDetails = mongoose.model(
  "UserDetails",
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
      branch: String
    }
  }),
  "UserDetails"
);
let Category = mongoose.model(
  "Category",
  new Schema({
    _id: Number,
    name: String,
    topics: Array,
    notified: Boolean
  }),
  "Category"
);

dbCheck.on("notify", name => {
  try {
    UserDetails.find((err, accounts) => {
      accounts.map(account => {
        if ([0, 4].includes(account.level)) {
          if (
            account.notifications == undefined ||
            account.notifications.length == 0
          ) {
            account.notifications = notifications;
          }
          if (_.find(account.notifications, { name: name }) == undefined) {
            account.notifications.push({ name: name, unread: true });
          }
          if (_.find(notifications, { name: name }) == undefined) {
            notifications.push({ name: name, unread: true });
          }
          account.markModified("notifications");
          account.save(err => {
            if (!err) {
              io.emit("change", [account._id]);
            }
          });
        }
      });
    });
  } catch (e) {}
});
dbCheck.on("singlenotify", ({ name, id: sid }) => {
  try {
    UserDetails.findById(sid, (err, account) => {
      if (
        account.notifications == undefined ||
        account.notifications.length == 0
      ) {
        account.notifications = notifications;
      }
      if (_.find(account.notifications, { name: name }) == undefined) {
        account.notifications.push({ name: name, unread: true });
      }
      account.markModified("notifications");
      account.save(err => {
        if (!err) {
          io.emit("change", [account._id]);
        }
      });
    });
  } catch (e) {}
});
let validateLogin = (acc, content, e) => {
  if (acc != null) {
    bcrypt.compare(content.pass, acc.password, function(err, res) {
      if (res) {
        e.emit("success", acc);
      } else {
        e.emit("fail", "np");
      }
    });
  } else {
    e.emit("fail", "nu");
  }
};
db.on("open", () => {
  dbconnect = true;
  // DO NOT UNCOMMENT IF YOU DONT NEED TO NUKE ---------------WARNING-------------
  // UserDetails.find({ level: 4 }, (err, faculties) => {
  //   faculties.map(faculty => {
  //     let requests = faculty.details.students;

  //     requests = [];
  //     faculty.details.students = requests;
  //     faculty.markModified("details");
  //     faculty.save();
  //   });
  // });
  // Users.find({ level: 0 }, (err, students) => {
  //   students.map(student => {
  //     student.questions = {};
  //     student.markModified("questions");
  //     student.save();
  //   });
  // });
});
let canReg = true;
let resetArray = [];
io.on("connection", socket => {
  socket.on("error", err => {
    console.log(err);
  });

  let loggedIn = false,
    level = 0,
    account = { _id: "" };
  socket.emit("mode", mode);
  socket.emit("canReg", canReg);
  socket.on("logout", () => {
    loggedIn = false;
    level = 0;
    account = { _id: "" };
  });
  pubsub.on("change", idlist => {
    if (idlist.includes(account._id)) {
      UserDetails.findById(account._id, (err, details) => {
        socket.emit("changeDetails", {
          details: details
        });
        if (level == 0) {
          Users.findById(account._id, (err, newacc) => {
            socket.emit("q", newacc.questions);
          });
        }
      });
    }
  });

  console.log("user connected");
  concurrentUsers++;
  const loginCheck = new Event();
  loginCheck.setMaxListeners(8000000);
  socket.setMaxListeners(0);
  socket.on("det", content => {
    if (validateEmail(content.email)) {
      Users.findOne({ email: content.email }, (err, acc) => {
        validateLogin(acc, content, loginCheck);
      });
    } else {
      Users.findById(content.email, (err, acc) => {
        validateLogin(acc, content, loginCheck);
      });
    }
    loginCheck.on("success", acc => {
      account = acc;
      pubsub.emit("count");
      pubsub.on("count", () => {
        Users.countDocuments({ level: 0 }, (err, c) => {
          Users.countDocuments({ level: 4 }, (err, c2) => {
            socket.emit("count", [c, c2]);
          });
        });
      });
      loggedIn = true;
      UserDetails.findById(acc._id, (err, details) => {
        socket.emit("validateLogin", {
          validate: true,
          details: details,
          level: acc.level,
          type: acc.type
        });

        level = acc.level;
        Questions.countDocuments((err, c) => {
          socket.emit("questionnumber", c);
        });
        if (level == 2) {
          pubsub.emit("count");
          socket.on("toggleReg", () => {
            canReg = !canReg;
            socket.emit("canReg", canReg);
          });
          socket.on("changeMode", checked => {
            mode = !mode;
            socket.emit("mode", mode);
          });
          socket.on("addCategory", cat => {
            if (loggedIn && level == 2) {
              Category.findOne(
                {
                  name: {
                    $regex: new RegExp(`(${cat})\\b`, "gi")
                  }
                },
                (err, presentCat) => {
                  if (presentCat == null) {
                    socket.emit("catError", "");
                    Category.find()
                      .sort({ $natural: -1 })
                      .limit(1)
                      .exec((err, el) => {
                        if (el.length == 0) {
                          let newCat = new Category({
                            _id: 1,
                            name: `${cat}`,
                            topics: [],
                            notified: false
                          });
                          newCat.save(err => {
                            if (err == null) {
                              socket.emit("success", "category");
                              Category.find()
                                .sort({ $natural: 1 })
                                .exec((err, cats) => {
                                  socket.emit("categories", cats);
                                });
                            } else {
                            }
                          });
                        } else {
                          let id = parseInt(el[0]._id);
                          id++;
                          let newCat = new Category({
                            _id: id,
                            name: `${cat}`,
                            topics: [],
                            notified: false
                          });
                          newCat.save(err => {
                            if (err == null) {
                              socket.emit("success", "category");
                              Category.find()
                                .sort({ $natural: 1 })
                                .exec((err, cats) => {
                                  io.emit("categories", cats);
                                });
                            } else {
                            }
                          });
                        }
                      });
                  } else {
                    socket.emit("catError", "Branch already exists!");
                  }
                }
              );
            }
          });
          socket.on("removeTop", t => {
            Category.findById(t.cid, (err, cate) => {
              cate.topics = _.reject(cate.topics, top => top.id == t.tid);
              cate.markModified("topics");
              cate.save(err => {
                Category.find()
                  .sort({ $natural: 1 })
                  .exec((err, cats) => {
                    io.emit("categories", cats);
                  });
              });
            });
          });
          socket.on("categoryNotify", c => {
            Category.findById(c.cid, (err, cate) => {
              let index = _.findIndex(cate.topics, { name: c.name });
              cate.topics[index].notified = true;
              cate.markModified("topics");
              cate.save(err => {
                Category.find()
                  .sort({ $natural: 1 })
                  .exec((err, cats) => {
                    io.emit("categories", cats);
                    dbCheck.emit(
                      "notify",
                      `${c.name} has been added to ${cate.name}`
                    );
                  });
              });
            });
          });
        }
        Category.find()
          .sort({ $natural: 1 })
          .exec((err, cats) => {
            socket.emit("categories", cats);
          });
        Tags.find().exec((err, tags) => {
          socket.emit("tags", tags);
        });

        if (level == 0) {
          socket.on("updateNoti", det => {
            details.notifications = det.notifications;
            details.markModified("notifications");
            details.save(err => {
              pubsub.emit("change", acc._id);
            });
          });
          socket.on("reset", ({ topic, cat }) => {
            if (acc.questions[cat][topic].qo == undefined) {
              acc.questions[cat][topic].qo = [];
            }
            acc.questions[cat][topic].qo.concat(acc.questions[cat][topic].q);
            Questions.countDocuments(
              { "category.name": cat, "topic.name": topic },
              (err, c) => {
                count = parseInt(c);
                let q = [];
                console.log(acc.questions[cat][topic].qo.length - count);
                if (
                  count > 100 &&
                  count - acc.questions[cat][topic].qo.length > 100
                ) {
                  console.log("looping");
                  while (q.length < 100) {
                    var r = Math.floor(Math.random() * count);
                    if (
                      q.indexOf(r) === -1 &&
                      !acc.questions[cat][topic].qo.includes(r)
                    )
                      q.push(r);
                  }
                }

                acc.questions[cat][topic].q = q.map(k => {
                  return { n: k, a: 0 };
                });
                console.log("resetr");
                acc.markModified("questions");
                acc.save(err => {
                  if (err) {
                  } else {
                    io.emit("change", [acc._id]);
                  }
                });
              }
            );
          });
          socket.emit("q", acc.questions);
          socket.on("requestCourse", det => {
            let { cat, faculty: pid, student: sid, cid, topic } = det;
            Users.findById(acc._id, (err, stacc) => {
              acc.questions = stacc.questions;
              UserDetails.findOne({ _id: pid }, (err, fac) => {
                if (
                  _.find(fac.details.students, {
                    _id: sid,
                    cat: cat,
                    topic: topic
                  }) == undefined
                ) {
                  fac.details.students.push({
                    cat: cat,
                    topic: topic,
                    _id: sid,
                    a: true,
                    name: details.details.name
                  });
                  fac.markModified("details");
                  fac.save(err => {
                    if (acc.questions == undefined) {
                      acc.questions = {};
                      acc.questions[cat] = {};
                    }
                    if (acc.questions[cat] == undefined) {
                      acc.questions[cat] = {};
                    }
                    acc.questions[cat][topic] = {
                      a: true,
                      q: [],
                      cat: cat,
                      pid: fac._id,
                      topic: topic
                    };
                    let q = [],
                      count = 0;
                    Questions.countDocuments(
                      { "category.name": cat, "topic.name": topic },
                      (err, c) => {
                        count = c;
                        if (count > 100) {
                          while (q.length < 100) {
                            var r = Math.floor(Math.random() * count);
                            if (q.indexOf(r) === -1) q.push(r);
                          }
                        }

                        acc.questions[cat][topic].q = q.map(k => {
                          return { n: k, a: 0 };
                        });
                        acc.markModified("questions");
                        acc.save(err => {
                          socket.emit("q", acc.questions);
                          io.emit("change", [sid, pid]);
                        });
                      }
                    );
                  });
                }
              });
            });
          });
          socket.on("changeQuestion", opts => {
            let [q, cat, topic] = opts;
            acc.questions[cat][topic] = q;
            acc.markModified("questions");
            acc.save(err => {
              if (!err) {
                socket.emit("q", acc.questions);
                io.emit("change", [acc.questions[cat][topic].pid]);
              }
            });
          });
          socket.on("addProblem", report => {
            let { pid } = report;
            UserDetails.findById(pid, (err, fac) => {
              report.resolution = false;
              if (fac.details.problems == undefined) {
                fac.details.problems = [];
              }
              fac.details.problems.push(report);
              fac.markModified("details");
              fac.save(err => {
                if (!err) {
                  io.emit("change", [pid]);
                  UserDetails.findOne({ level: 1 }, (err, coord) => {
                    if (coord.details.problems == undefined) {
                      coord.details.problems = [];
                    }
                    coord.details.problems.push(report);
                    coord.markModified("details");
                    coord.save(err => {
                      if (!err) {
                        io.emit("change", [coord._id]);
                      }
                    });
                  });
                }
              });
            });
          });
        }
        if (level == 1) {
          pubsub.emit("count");
          socket.on("resolve", ({ problem, action }) => {
            let ind = _.findIndex(details.details.problems, problem);
            if (ind != -1) {
              details.details.problems[ind].resolution = action
                ? true
                : "rejected";
              details.markModified("details");
              details.save(err => {
                UserDetails.findById(problem.pid, (err, prof) => {
                  let inde = _.findIndex(prof.details.problems, problem);
                  if (inde != -1) {
                    prof.details.problems[inde] = details.details.problems[ind];
                    prof.markModified("details");
                    prof.save(err => {
                      dbCheck.emit("singlenotify", {
                        name: `Your reported problem with a question in ${
                          problem.topic.name
                        } has been ${action ? "Resolved" : "Rejected"}`,
                        id: problem.sid
                      });
                      io.emit("change", [problem.pid, acc._id]);
                    });
                  }
                });
              });
            }
          });
          socket.on("questionChange", ({ changed, cat, n, topic }) => {
            Questions.findOne(
              { "category.name": cat, "topic.name": topic, number: n },
              (err, question) => {
                question.qname = changed.qname;
                question.markModified("qname");
                question.qdef = changed.qdef;
                question.markModified("qdef");
                question.options = changed.options;
                question.markModified("options");
                question.answer = changed.answer;
                question.markModified("answer");
                question.hints = changed.hints;
                question.markModified("hints");

                question.save(err => {
                  if (!err) {
                    socket.emit("changeResponse", {
                      fail: false,
                      message: "success"
                    });
                  } else {
                    socket.emit("changeResponse", {
                      fail: true,
                      message: "error"
                    });
                  }
                });
              }
            );
          });
          socket.on("addQuestion", q => {
            Questions.countDocuments(
              { category: q.category, topic: q.topic },
              (err, count) => {
                let question = new Questions({
                  category: q.category,
                  qname: q.qname,
                  qdef: q.qdef,
                  options: q.options,
                  answer: q.answer,
                  hints: q.hints,
                  topic: q.topic,
                  number: count
                });
                question.save(err => {
                  if (!err) {
                    socket.emit("addResponse", {
                      fail: false,
                      message: "success"
                    });
                  } else {
                    socket.emit("addResponse", {
                      fail: true,
                      message: "error"
                    });
                  }
                });
              }
            );
          });
        }
        if (level == 4) {
          socket.on("acceptCourse", ([user, cat, action, d, topic]) => {
            details.details.students = d.details.students.map(s => ({
              ...s,
              loading: false
            }));

            Users.findOne({ _id: user }, (err, student) => {
              if (!err && action === true && student != null) {
                student.questions[cat][topic].a = true;
                let q = [],
                  count = 0;
                Questions.countDocuments(
                  { "category.name": cat, "topic.name": topic },
                  (err, c) => {
                    count = c;
                    if (count > 100) {
                      while (q.length < 100) {
                        var r = Math.floor(Math.random() * count);
                        if (q.indexOf(r) === -1) q.push(r);
                      }
                    }

                    student.questions[cat][topic].q = q.map(k => {
                      return { n: k, a: 0 };
                    });
                    student.markModified("questions");
                    student.save(err => {
                      if (err) {
                      } else {
                        details.markModified("details");
                        details.save(err2 => {
                          io.emit("change", [student._id, acc._id]);
                        });
                      }
                    });
                  }
                );
              } else if (!err && student != null) {
                try {
                  delete student.questions[cat][topic];
                  student.markModified("questions");
                  student.save(err => {
                    if (err) {
                    } else {
                      console.log("rejected and deleted");
                      details.markModified("details");
                      details.save(err2 => {
                        io.emit("change", [student._id, acc._id]);
                      });
                    }
                  });
                } catch (e) {}
              }
            });
          });
        }
      });
    });
    loginCheck.on("fail", reason => {
      socket.emit("fail", reason);
    });
  });

  socket.on("reg", r => {
    if (canReg) {
      Users.find({ $or: [{ id: r.regNo }, { email: r.email }] }, (err, acc) => {
        if (acc.length == 0) {
          UsersDetails.find(
            { $or: [{ id: r.regNo }, { email: r.email }] },
            (err, accid) => {
              if (accid.length == 0) {
                loginCheck.emit("canRegister");
              } else {
                socket.emit("registerResponse", {
                  fail: true,
                  message: "Registration Failed"
                });
              }
            }
          );
        } else {
          socket.emit("registerResponse", {
            fail: true,
            message: "Registration Failed"
          });
        }
      });
      loginCheck.on("canRegister", () => {
        let user, details;
        bcrypt.hash(r.password, 10, function(err, hash) {
          try {
            if (!mode) {
              user = new Users({
                _id: r.regNo,
                email: r.email,
                password: hash,
                type: "Student",
                questions: {},
                level: 0
              });
              details = new UserDetails({
                _id: r.regNo,
                level: 0,
                details: {
                  name: r.name,
                  regNo: r.regNo,
                  department: r.branch,
                  branch: r.cbranch
                }
              });
            } else {
              user = new Users({
                _id: r.regNo,
                email: r.email,
                password: hash,
                type: "Faculty",
                level: 4
              });
              details = new UserDetails({
                _id: r.regNo,
                level: 4,
                details: {
                  name: r.name,
                  regNo: r.regNo,
                  department: r.branch,
                  branch: r.cbranch,
                  students: []
                }
              });
            }
            details.save();
            user.save(err => {
              socket.emit("registerResponse", {
                fail: false,
                message: "Registration Successful"
              });
              pubsub.emit("count");
            });
          } catch (e) {
            socket.emit("registerResponse", {
              fail: true,
              message: "Registration Failed"
            });
          }
        });
      });
    }
  });

  socket.on("addTag", info => {
    if (loggedIn && level == 2) {
      Tags.findOne(
        {
          name: {
            $regex: new RegExp(`(${info.name})\\b`, "gi")
          }
        },
        (err, presentTag) => {
          if (presentTag == null) {
            socket.emit("tagError", "");
            let tag = new Tags({
              name: info.name,
              group: info.group
            });
            tag.save(err => {
              if (err == null) {
                socket.emit("success", "tag");
                Tags.find().exec((err, tags) => {
                  socket.emit("tags", tags);
                });
              }
            });
          } else {
            socket.emit("tagError", "Tag already Exists!");
          }
        }
      );
    }
  });
  socket.on("addTopic", info => {
    if (loggedIn && level == 2) {
      Category.findOne(
        {
          name: {
            $regex: new RegExp(`(${info.category})\\b`, "gi")
          }
        },
        (err, cat) => {
          if (_.findIndex(cat.topics, { name: info.topic }) == -1) {
            cat.topics.push({
              id: `${cat._id * 100 + cat.topics.length + 1}`,
              name: info.topic,
              notified: false
            });
            cat.markModified("topics");
            cat.save((err, sct) => {
              socket.emit("success", "topic");
              Category.find()
                .sort({ $natural: 1 })
                .exec((err, cats) => {
                  socket.emit("categories", cats);
                });
            });
          } else {
            socket.emit("topError", "Course already exists!");
          }
        }
      );
    }
  });
  socket.on("disconnect", () => {
    concurrentUsers--;
  });

  socket.on("forgot", details => {
    let fid = "/eskill/reset/" + makeid();
    resetArray.push(fid);
    let email = details.email;
    Users.find({ email: email }, (err, user) => {
      if (user.length > 0) {
        try {
          transporter.sendMail({
            from: emailid,
            to: email,
            subject: "eSkill Password Reset",
            html: `<p>In Order to reset the password, please click the link below: </p><p><a href="${resetURL}${fid}">Reset Password</a></p><p>This link is valid for 30 minutes from the time of generation</p>`
          });
          setTimeout(() => {
            resetArray = resetArray.filter(k => k != fid);
          }, 1800000);

          app.get(fid, (req, res) => {
            res.sendFile(path.resolve(__dirname, "forgot", "index.html"));
          });
          app.post(fid, (req, res) => {
            Users.findOne({ email: email }, (err, resetacc) => {
              bcrypt.hash(req.body.p, 10, function(err, hash) {
                resetacc.password = hash;
                resetArray = resetArray.filter(k => k != fid);
                resetacc.save();
              });
            });
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(user);
      }
    });
  });
});
app.use("/eskill/reset", express.static(path.resolve(__dirname, "forgot")));
app.post("/eskill/api/student", (req, res) => {
  let { sid, cat, topic } = req.body;
  Users.findById(sid, (err, student) => {
    try {
      let { questions } = student;
      let q = {};

      let at = 0,
        cm = 0;
      correct = 0;
      questions[cat][topic].q.map(qa => {
        if (qa.a > 0) {
          at++;
          if (qa.a < 3) {
            cm++;
          }
          if (qa.a == 2) {
            correct++;
          }
        }
      });
      q.a = at;
      q.c = cm;
      q.cor = correct;
      res.json(q);
    } catch (e) {
      res.json({ err: "no student" });
    }
  });
});

app.post("/eskill/api/question", (req, res) => {
  let { n, cat, topic } = req.body;
  if (dbconnect) {
    try {
      Questions.findOne(
        { "category.name": cat, number: n, "topic.name": topic },
        (err, q) => {
          if (!err) {
            res.json({ question: q, err: false });
          }
        }
      );
    } catch (e) {
      res.json({ err: true });
    }
  }
});

app.post("/eskill/api/faculty", (req, res) => {
  let { branch, cbranch } = req.body;
  try {
    UserDetails.find(
      {
        "details.department": `${branch}`,
        "details.branch": `${cbranch}`,
        level: 4
      },
      (err, fac) => {
        res.json({ faculty: fac, err: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.json({ err: true });
  }
});
app.get("*", (req, res, next) => {
  if (resetArray.includes(req.url)) {
    next();
  } else {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  }
});
const port = 5000;
sticky.listen(server, port, () => {
  console.log("Listening on " + port);
  setInterval(() => {
    console.log("Current User Count:", concurrentUsers);
  }, 5000);
});
