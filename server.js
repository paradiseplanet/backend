var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer');
bodyParser = require('body-parser');
path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://paradiseplanet:100Mic10*@paradiseplanet.ev1vovz.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
var nodemailer = require('nodemailer');

var fs = require('fs');
var business = require("./model/business.js");
var enquiry = require("./model/enquiry.js");
var user = require("./model/user.js");
var contact = require("./model/contact.js");
//hello
var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));


app.use("/", (req, res, next) => {
  try {
    console.log(req.path);
    if (req.path == "/login" || req.path == "/register" || req.path == "/" || req.path == "/contact") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {
          if (data[0].password==req.body.password) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

//Hello
/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        user:data.username,
        status: true
      });
    }
  });
}

/*Api to add enquiry */
app.post("/add-enquiry", upload.any(), (req, res) => {
  try {
    if (req.body && req.body.name && req.body.email && req.body.mobile &&
      req.body.message && req.body.businessId) {

      let new_enquiry = new enquiry();
      new_enquiry.name = req.body.name;
      new_enquiry.email = req.body.email;
      new_enquiry.mobile = req.body.mobile;
      new_enquiry.message = req.body.message;
      new_enquiry.business_id = req.body.businessId;
      new_enquiry.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Enquiry Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to add business */
app.post("/add-business", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
      req.body.discount) {

      let new_business = new business();
      new_business.name = req.body.name;
      new_business.desc = req.body.desc;
      new_business.price = req.body.price;
      new_business.image = req.files[0].filename;
      new_business.discount = req.body.discount;
      new_business.user_id = req.user.id;
      new_business.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Business Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update Business */
app.post("/update-business", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
      req.body.id && req.body.discount) {

      business.findById(req.body.id, (err, new_business) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_business.image) {
          var path = `./uploads/${new_business.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_business.image = req.files[0].filename;
        }
        if (req.body.name) {
          new_business.name = req.body.name;
        }
        if (req.body.desc) {
          new_business.desc = req.body.desc;
        }
        if (req.body.price) {
          new_business.price = req.body.price;
        }
        if (req.body.discount) {
          new_business.discount = req.body.discount;
        }

        new_business.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Business updated.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to delete Business */
app.post("/delete-business", (req, res) => {
  try {
    if (req.body && req.body.id) {
      business.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Business deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/*Api to get and search business with pagination and search by name*/
app.get("/get-business", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    business.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        business.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Business retrived.',
                businesss: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no Business!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

app.post("/contact",(req,res)=>{
  {
    try {
      if ( req.body.name && req.body.email && req.body.phone && req.body.message) {

        var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
    service: 'gmail',
   auth: {
    user: 'paradiseplanet22@gmail.com',
    pass: '100mic10'
  }
});

var mailOptions = {
  from: 'paradiseplanet22@gmail.com',
  to: 'paradiseplanet22@gmail.com',
  subject: 'Website Enquiry',
  text: 'name --> '+req.body.name + ' ' + 'email --> ' + req.body.email + 'phone --> ' + req.body.phome + 'message --> ' + req.body.message
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  
        let new_contact = new contact();
        new_contact.name = req.body.name;
        new_contact.email = req.body.email;
        new_contact.mobile = req.body.mobile;
        new_contact.messege = req.body.messege;

       
        new_contact.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Message Sent successfully.'
            });
          }
        });
  
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  }
});

app.post("/")

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  if(err) throw err;
  console.log("%c Server running", "color: green");
});
