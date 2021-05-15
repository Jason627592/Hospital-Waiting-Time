const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var crypto = require("crypto");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const multer = require('multer');
var methodOverride = require('method-override');
var fs = require('fs');

const app = express();
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  // res.header('Referrer-Policy', 'no-referrer');
  next();
});

mongoose.connect("mongodb://s1155124855:x08761@localhost/s1155124855");


let upload = multer();

var db = mongoose.connection;

// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));

// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");
});

var UserAccountSchema = mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  bookmarked_list: {
    type: Array,
    default: [],
  },
});

var HospitalSchema = mongoose.Schema({
  hospitalId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

var CommentDatabaseSchema = mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  hospitalId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  commentTime: {
    type: Date,
    required: true,
  },
  commentContent: {
    type: String,
    required: true,
  },
});

var UserAccountSchema = mongoose.model("UserAccount", UserAccountSchema);
var Comment = mongoose.model(
  "CommentDatabases",
  CommentDatabaseSchema,
  "commentdatabases"
);
var Hospital = mongoose.model("Hospital", HospitalSchema, "hospital");

/*
List of username and password (username, password, isAdmin):
- Jason, zH5FH9, true
- Gary, H6YYnj, true
- Leo_1, 3fUr2Q, false
- Elaine, 3P64zH, false
*/

// create_new_user(1, "Jason", "e5f92237b70bdc8c2cd375f00406c5517c308655ae04c8b7bd47656226e6f0e8", true);
// create_new_user(2, "Gary", "a5421d32b82ef301741e2a33f8d6aeef832f6dae8a0ea955201bc7aa9fb9fa37", true);
// create_new_user(3, "Leo_1", "609eceb4efb7b639cac25b16a47ae9fb458ab2a63023aadfe6efae22298083fd", false);
// create_new_user(4, "Elaine", "e6fde7813318df320257ae8a579d27379fa36a49fda2e0129d5702fb9c7c8486", false);

//User Login
app.post("/Login", function (req, res) {
  const hashed_password = crypto
    .createHash("sha256")
    .update(req.body["password"])
    .digest("hex")
    .toLowerCase();
  UserAccountSchema.findOne(
    { username: req.body["username"], password: hashed_password },
    "userId username password isAdmin",
    function (err, e) {
      if (err) {
        res.send(err);
      } else if (e == null) {
        res.send("Login Failed!");
      } else {
        const current_time = Date.now().toString();
        const hidden_key_phase = crypto
          .createHash("sha256")
          .update(
            e.userId + e.username + current_time + e.password + "rb;KK:82"
          )
          .digest("hex")
          .toLowerCase();
        // res.writeHead(200, {
        //   "Set-Cookie": "auth=" + JSON.stringify({username: e.username, time: current_time, hidden_key: hidden_key_phase}) + ";domain=;path=/",
        //   "Access-Control-Allow-Credentials": "true"
        // })
        res.send(
          JSON.stringify({
            userId: e.userId,
            username: e.username,
            is_admin: e.isAdmin,
            time: current_time,
            hidden_key: hidden_key_phase,
          })
        );
      }
    }
  );
});

app.use(express.json());

app.get("/hospital", function (req, res) {
  Hospital.find().exec((err, hospitals) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (!hospitals || !hospitals.length) {
      return res.json([]);
    }
    return res.json(hospitals);
  });
});

app.get("/hospital/:hospitalId", function(req,res) {
  Hospital.findOne({hospitalId: req.params.hospitalId})
  .exec((err,hospital) => {
    if (err) res.json({ message: err });
    if (!hospital) {
      return res.json({message: "No this hospital"});
    }
    return res.send(hospital);
  })
})

app.get("/comment/:hospitalId", async (req, res) => {
  Comment.find({ hospitalId: req.params.hospitalId }).exec((err, comment) => {
    if (err) res.json({ message: err });
    if (!comment || !comment.length) {
      return res.json([]);
    }
    return res.json(comment);
  });
});

app.get("/user/:id", async (req, res) => {
  UserAccountSchema.findOne({ userId: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
    return res.json({ username: user.username });
  });
});

app.post("/comment", async (req, res) => {
    Comment.findOne({ commentId: { $gt: 0 } }, null)
      .sort({ commentId: -1 })
      .exec(function (err, count) {
        if (err) {
          console.log(err);
          res.status(500).json({ message: err });
        }
        if (count == null) currentId = 0;
        else currentId = count.commentId;
        var e = new Comment({
          commentId: currentId + 1,
          hospitalId: req.body["hospitalId"],
          userId: req.body["userID"],
          commentTime: req.body["date"],
          commentContent: req.body["comment"],
        });
        e.save(function (err) {
          if (err) {
            console.log(err);
            res.status(500).json({ message: err });
          }
          return res.status(201).json(e);
        });
      });
  });


let updateFavouriteList = (req, res) => {
    let userId = req.body["userId"];
    let favouriteListString = req.body["favouriteList"];
    let favouriteList = JSON.parse(favouriteListString);
    UserAccountSchema.updateOne({userId : userId}, {$set : {bookmarked_list : favouriteList}}, (err, result) => {
        if (err){
            return res.status(500).json({message : err});
        }
        else {
            return res.status(201).json({message : "Update favourite successfully", result : result});
        }
    });
}

let getFavouriteList = (req, res) => {
    let userId = req.params.userId;
    UserAccountSchema.findOne(
        {userId : userId},
        'bookmarked_list',
        function(err, e) {
            if (err){
                return res.send(err);
            }
            else{
                return res.status(201).json({result : e.bookmarked_list});
            }
        }
        );
}

app.get("/getfavouritelist/:userId", getFavouriteList);

app.post("/updatefavouritelist", upload.array(), updateFavouriteList);

//Create User
app.post("/create_user", function (req, res) {
    console.log(req.body);
    const hashed_password = crypto
      .createHash("sha256")
      .update(req.body["password"])
      .digest("hex")
      .toLowerCase();

    let new_user_id = 0;
    let error = 0;

    let get_max_id = new Promise((resolve, reject) => {
      UserAccountSchema.find({}, 'userId', function(err, e) {
          if (err)
              error = 1;
          console.log(e);
          resolve(e);
      }).sort({
          userId: -1
      }).limit(1);
    });

    get_max_id.then(function(result) {
      new_user_id = result[0]["userId"] + 1;
      //isAdmin: true/false
      var e = new UserAccountSchema({
          userId: new_user_id,
          username: req.body["username"],
          password: hashed_password,
          isAdmin: req.body["is_admin"],
      });

      e.save(function (err) {
          if (err){
              console.log(err);
              res.send(JSON.stringify({Success: -1}));
          }else{
              res.send(JSON.stringify({Success: 0}));
          }
      });
  })

});

//Update User
app.put("/update_user", function (req, res) {
    let current_password;
    UserAccountSchema.findOne({userId: req.body['user_id']},
    "password",
    function(err, result){
      if(err){
          res.send("cannot find the password");
          return;
      }else{
          // res.send(result);
          // return;
          current_password = result["password"];
          console.log(current_password);
          if(req.body['password'] != ""){
              current_password = crypto
                .createHash("sha256")
                .update(req.body["password"])
                .digest("hex")
                .toLowerCase();
          }
          var conditions = { userId: req.body['user_id'] },
          update = { $set: {
              username: req.body['username'],
              password: current_password,
              isAdmin: req.body['is_admin']
          }};

          console.log(req.body['username']);

          UserAccountSchema.updateOne(conditions, update, function(err, result){
              if (err){
                  console.log(err);
                  res.send(JSON.stringify({Success: -1}));
              }else if(result.n!=0){
                  res.send(JSON.stringify({Success: 0}));
              }else{
                  res.send(JSON.stringify({Success: -2}));
              }
          });
          }
      })
});

//Retrieve User
app.get("/get_all_user", function (req, res) {
    UserAccountSchema.find({},
    "userId username isAdmin",
    function(err, result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
});

app.get("/get_one_user/:uid", function (req, res) {
    UserAccountSchema.find({userId: req.params['uid']},
    "userId username isAdmin",
    function(err, result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
});

//Delete User
app.delete("/delete_user", function (req, res) {
  console.log(req.body["user_id"]);
  UserAccountSchema.findOne({
    userId: req.body["user_id"]
  }, "userId, username, password isAdmin",
  function(err, result){
      if(err){
          res.send(err);
      }else{
          UserAccountSchema.remove({
            userId: req.body["user_id"]
        },function(err1, result1) {
            if (err1){
                console.log(err);
                res.send(JSON.stringify({Success: -1}));
            }else if(result == undefined){
                res.send(JSON.stringify({Success: -2}));
            }else{
                res.send(JSON.stringify({Success: 0}));
            }
        });
      }
  });
});

app.post("/hospital/create", async(req,res) =>{
  Hospital.findOne({ hospitalId: { $gt: 0 } }, null)
    .sort({hospitalId: -1})
    .exec(function(err,count) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err });
      }
      if (count == null) currentId = 0;
      else currentId = count.hospitalId
      var e = new Hospital({
        hospitalId: currentId + 1,
        name: req.body["name"],
        address: req.body["address"],
        latitude: req.body["latitude"],
        longitude: req.body["longitude"],
      })
      e.save(function(err) {
        if(err) {
          console.log(err);
          res.status(500).json({ message: err });
        }
        return res.status(201).json(e);
      })
    })
})

app.put("/hospital/update", async(req, res) => {
  await Hospital.findOneAndUpdate(
    {hospitalId: req.body["hospitalId"]},
    {
      name: req.body["name"],
      address: req.body["address"],
      latitude: req.body["latitude"],
      longitude: req.body["longitude"]
    },
    {new: true}
  ).exec((err, e) => {
    if (err) return res.status(500).json({ message: err });
    return res.json({ updateHospital: e });
  });
})

app.delete("/delete_loc", function (req, res) {
  Hospital.findOne({
    hospitalId: req.body["hospital_id"]
  }, "hospitalId name address latitude longitude",
  function(err, result){
      if(err){
          res.send(err);
      }else{
          Hospital.remove({
            hospitalId: req.body["hospital_id"]
        },function(err1, result1) {
            if (err1){
                console.log(err);
                res.send(JSON.stringify({Success: -1}));
            }else if(result == undefined){
                res.send(JSON.stringify({Success: -2}));
            }else{
                res.send(JSON.stringify({Success: 0}));
            }
        });
      }
  });
});

app.get("/refresh_hospital", function(req, res){
    let result;
    Hospital.remove({},function(err, result) {
      if (err){
          console.log(err);
          // res.send(JSON.stringify({Success: -1}));
      }else{
          fs.readFile('./hospital.json', 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);
            for(let i=0; i<18; i++){
                var e = new Hospital({
                    hospitalId: result[i]["hospitalId"],
                    name: result[i]["name"],
                    address: result[i]["address"],
                    latitude: result[i]["latitude"],
                    longitude: result[i]["longitude"]
                });

                e.save(function (err) {
                    if (err){
                        console.log(err);
                        // res.send(JSON.stringify({Success: -1}));
                    }else{
                        // res.send(JSON.stringify({Success: 0}));
                    }
                });
            }
            res.send(JSON.stringify(result));
          });
      }
    });
})


app.all('/*', function(req, res){
	res.send("You connected to the server");
})

// For group : change to your own port
var server = app.listen(2075);
