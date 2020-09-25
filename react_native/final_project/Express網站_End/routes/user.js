const express = require("express");
const router = express.Router();
const db = require("../db");

const loginChecker = require("../middleware/login-checker");

loginChecker(router); //

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27021,localhost:27022,localhost:27023/";

// 產品詳情路由 /user/show/:pid
router.get("/show/:pid", function(req, res, next) {
  // 渲染product-show.ejs
  res.render("user-show");
});

// 建立產品路由
router.get("/create", function(req, res, next) {
  // 渲染product-create.ejs
  res.render("user-create");
});

// 編輯產品路由
router.get("/edit/:pid", async function(req, res, next) {
  // req前端跟後端要求
  const pid = req.params.pid;
  console.log("[pid]", pid);

  let purchases = "",
    transfers = "",
    donations = "",
    ends = "",
    mongousers = "";

  // firebase

  // 用id取得資料
  // then 會得到的結果   firebase
  const doc = await db.ref(`/users/${pid}`).once("value");

  const user = doc.val();
  // console.log(user);

  // user傳遞給ejs
  res.locals.user = user;

  let doc2 = await db.ref(`/users`).once("value");

  let Fusers = [];
  doc2.forEach(doc => {
    let user = doc.val();
    Fusers.push(user);
  });

  // user傳遞給ejs
  res.locals.Fusers = Fusers;

  //Mongo的部分

  //  顯示資料
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //舊的DB Name
    var dbo = db.db("mydb");

    dbo
      .collection("user")
      .find({}) // key:value
      .project({ _id: 0 }) //隱藏ID
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log("這個是find的result", result);
        mongousers = result;
        res.locals.mongousers = mongousers;
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
        // res.render("trades");
        // result.forEach(doc => {
        //   console.log(new Date(doc.time_num));
        // });

        // db.close();
      });

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
        console.log("transfers_test :", transfers);
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

        res.render("user-edit");
        db.close();
      });
  });

  // res.render("trades");

  // 渲染product-edit.ejs
});

module.exports = router;
