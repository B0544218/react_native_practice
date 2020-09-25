const express = require("express");
const router = express.Router();
//  路由必須引用db，才能抓資料
const db = require("../db");
const loginChecker = require("../middleware/login-checker");

loginChecker(router); //

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27021,localhost:27022,localhost:27023/";
//mainpage Route
router.get("/", async function(req, res, next) {
  res.render("mainpage");
});

// data首頁路由
router.get("/index", async function(req, res, next) {
  // TODO: 取得產品列表
  // then 會得到的結果
  const docs = await db.ref("/users").once("value");
  // console.log(docs.data());
  const users = [];

  // 等於docs.forEach(function(doc){console.log(doc.data())})
  docs.forEach(doc => {
    // console.log(doc.data());
    const user = doc.val();
    // console.log(user);
    // user.id = doc.id;
    users.push(user);
  });
  console.log(users);
  // products傳遞給ejs
  res.locals.users = users;

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("loss")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        console.log("這個是find的result", result);
        loss = result;
        res.locals.loss = loss;

        res.render("index");
        db.close();
      });
  });
  // res.render("index");
});

// 志工頁面路由
router.get("/index/volunteer", async function(req, res, next) {
  // TODO: 取得產品列表
  // then 會得到的結果
  const docs = await db.ref("/users").once("value");
  // console.log(docs.data());
  const users = [];

  // 等於docs.forEach(function(doc){console.log(doc.data())})
  docs.forEach(doc => {
    // console.log(doc.data());
    const user = doc.val();
    // console.log(user);
    // user.id = doc.id;
    users.push(user);
  });
  // console.log(users);
  // products傳遞給ejs
  res.locals.DDDD = "全部";
  res.locals.users = users;
  // res.render("volunteer");

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("end")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        console.log("這個是find的result", result);
        contracts = result;
        res.locals.contracts = contracts;
        res.render("volunteer");
        // result.forEach(doc => {
        //   console.log(new Date(doc.time_num));
        // });
        db.close();
      });
  });
});

// 委託
router.get("/index/contracts", async function(req, res, next) {

  const docs = await db.ref("/users").once("value");
  const usersF = [];

  
  docs.forEach(doc => {
    const user = doc.val();
    usersF.push(user);
  });


  res.locals.usersF= usersF;


  let contracts = "";
  //  顯示資料
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("end")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        console.log("這個是find的result", result);
        contracts = result;
        res.locals.contracts = contracts;
        // res.render("contracts"); //這邊先刪掉
        // result.forEach(doc => {
        //   console.log(new Date(doc.time_num));
        // });
        // db.close(); //這邊也先刪掉
      });

    dbo
      .collection("user")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;

        users = result;
        res.locals.users = users;
        res.render("contracts");

        db.close();
      });
  });
  // console.log("contracts==result怎麼印出來", contracts);
});

//委託資料詳細頁面
router.get("/index/contracts/:pid", async function(req, res, next) {
  let contracts = "";
  const pid = req.params.pid;
  console.log("[pid]", pid);

  //  顯示資料
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("end")
      .find({ contract_id: pid }) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        contracts = result;
        res.locals.contracts = contracts;
        res.render("contractData");

        db.close();
      });
  });
});

//  交易
router.get("/index/trades", async function(req, res, next) {
  const docs = await db.ref("/users").once("value");
  // console.log(docs.data());
  const Fusers = [];

  // 等於docs.forEach(function(doc){console.log(doc.data())})
  docs.forEach(doc => {
    // console.log(doc.data());
    const user = doc.val();
    // console.log(user);
    // user.id = doc.id;
    Fusers.push(user);
  });

  // products傳遞給ejs
  res.locals.Fusers = Fusers;

  let purchases = "",
    transfers = "",
    donations = "",
    ends = "";

  //  顯示資料
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("purchase")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        purchases = result;
        res.locals.purchases = purchases;
        // res.render("trades");
        // result.forEach(doc => {
        //   console.log(new Date(doc.time_num));
        // });

        // db.close();
      });

    dbo
      .collection("transfer")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        transfers = result;
        res.locals.transfers = transfers;
        // res.render("trades");

        // db.close();
      });

    dbo
      .collection("donation")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        donations = result;
        res.locals.donations = donations;
        // res.render("trades");

        // db.close();
      });

    dbo
      .collection("user")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        users = result;
        res.locals.users = users;
        // res.render("trades");

        // db.close();
      });

    dbo
      .collection("end")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        ends = result;
        res.locals.ends = ends;
        res.render("trades");

        db.close();
      });
  });

  // res.render("trades");
});

// try
// router.get("/mainpage", async function(req, res, next) {
//   res.render("mainpage");
// });

module.exports = router;
