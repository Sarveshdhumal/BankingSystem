const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
// const keys = require(__dirname + '/keys.js');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
var con1 = mongoose.createConnection("mongodb+srv://admin-sarvesh:Test123@cluster1.rgv0p.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var con2 = mongoose.createConnection("mongodb+srv://admin-sarvesh:Test123@cluster1.rgv0p.mongodb.net/transactionDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const usersSchema = {
  Customer_ID: Number,
  Name: String,
  Email: String,
  Current_Balance: Number
};
const transactionsSchema = {
  Customer_ID1: Number,
  Name1: String,
  Customer_ID2: Number,
  Name2: String,
  Debit: Number,
  Status: String,
  Time: String
};
const User = con1.model("User", usersSchema);
const Transaction = con2.model("Transaction", transactionsSchema);
let user1 = new User({
  Customer_ID: 1,
  Name: "Amay singh",
  Email: "user1@gmail.com",
  Current_Balance: 5800
});
let user2 = new User({
  Customer_ID: 2,
  Name: "Raj verma",
  Email: "user2@gmail.com",
  Current_Balance: 7200
});
let user3 = new User({
  Customer_ID: 3,
  Name: "Jitu sharma",
  Email: "user3@gmail.com",
  Current_Balance: 2670
});
let user4 = new User({
  Customer_ID: 4,
  Name: "Vivek Tripathi",
  Email: "user4@gmail.com",
  Current_Balance: 9800
});
let user5 = new User({
  Customer_ID: 5,
  Name: "Gunjan Mishra",
  Email: "user5@gmail.com",
  Current_Balance: 5805
});
let user6 = new User({
  Customer_ID: 6,
  Name: "Shweta Tripathi",
  Email: "user6@gmail.com",
  Current_Balance: 5780
});
let user7 = new User({
  Customer_ID: 7,
  Name: "Richa Chadda",
  Email: "user7@gmail.com",
  Current_Balance: 7000
});
let user8 = new User({
  Customer_ID: 8,
  Name: "Barkha Singh",
  Email: "user8@gmail.com",
  Current_Balance: 5600
});
let user9 = new User({
  Customer_ID: 9,
  Name: "David dobrik",
  Email: "user9@gmail.com",
  Current_Balance: 5000
});
let user10 = new User({
  Customer_ID: 10,
  Name: "Tanmay Bhat",
  Email: "user10@gmail.com",
  Current_Balance: 4500
});
let defaultUsers = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];
app.get("/", function(req, res) {
  res.render("index");
});
let id = 0;
app.post("/transfer.html", function(req, res) {
  id = Number(req.query.id);
  User.find({}, function(err, debitUser) {
    if (err) {
      console.log(err);
    } else {
      res.render("transfer", {
        TransferUserDetail: debitUser[id - 1],
        TransferUserTo: debitUser,
        showId: id
      });
    }
  });
});
var message = "";
var setter = 0;
app.post("/customer.html", function(req, res) {
  let debit = Number(req.body.name);
  var dd2 = req.body.chat1;
  let dd = req.body.touser;
  var result = dd.match(/[0-9]/g);
  var id4 = '';
  var d = new Date();
  var time2 = d.toUTCString();
  var time = new Date(time2 + " UTC-5:30");
  var time3 = time.toUTCString().replace("GMT", "IST");
  result.forEach(function(res) {
    id4 = id4 + res;
  });
  let id2 = Number(id4);
  var result2 = dd2.match(/[0-9]/g);
  var id5 = '';
  result2.forEach(function(res) {
    id5 = id5 + res;
  });
  let amount1 = Number(id5);
  var status = "Failed";
  if (debit > 0) {
    if (id > 0) {
      if (amount1 >= debit) {
        status = "Success";
        var amount3 = amount1 - debit;
        User.updateOne({
          Customer_ID: id
        }, {
          Current_Balance: amount3
        }, function(err, docs) {
          if (err) {
            console.log(err)
          } else {
            console.log("Updated Docs : ", docs);
          }
        });
        User.updateOne({
          Customer_ID: id2
        }, {
          $inc: {
            Current_Balance: debit
          }
        }, function(err, docs) {
          if (err) {
            console.log(err)
          } else {
            console.log("Updated Docs : ", docs);
          }
        });
        message = "Transaction Successful!";
        setter = 1;
      } else {
        message = "Insufficient Balance!";
        setter = 2;
      }
      Transaction.insertMany([{
        Customer_ID1: id,
        Name1: defaultUsers[id - 1].Name,
        Customer_ID2: id2,
        Name2: defaultUsers[id2 - 1].Name,
        Debit: debit,
        Status: status,
        Time: time3
      }], function(err) {
        if (err)
          console.log(err);
        else
          console.log("Success");
      });
    }
  } else {
    message = "Please enter a valid amount to transfer!";
    setter = 3;
  }
  res.redirect("/customer.html");
  id = 0;
});
app.get("/customer.html", function(req, res) {
  User.find({}, function(err, foundUsers) {
    if (foundUsers.length === 0) {
      User.insertMany([user1, user2, user3, user4, user5, user6, user7, user8, user9, user10], function(err) {
        if (err)
          console.log(err);
        else
          console.log("Success");
      });
      res.redirect("/customer.html");
    } else {
      res.render("customer", {
        newList: foundUsers,
        success: message,
        term: setter
      });
      setter = 0;
    }
  });
});
app.get("/history.html", function(req, res) {
  Transaction.find({}, function(err, foundTransaction) {
    if (err) {
      console.log(err);
    } else {
      res.render("history", {
        newTransaction: foundTransaction
      });
    }
  });
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started successfully.")
});
