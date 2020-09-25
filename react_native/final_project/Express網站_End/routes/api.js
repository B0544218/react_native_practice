const express = require("express");
const router = express.Router();
const admin = require("../firebase");
const db = require("../db");

//引用mongo
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27021,localhost:27022,localhost:27023/";

// 登入
router.post("/login", function(req, res, next) {
  // req 前端傳給後端的?
  const idToken = req.body.idToken;
  console.log("idToken", idToken);
  // 設定時效性(登入) 3天
  const expiresIn = 60 * 60 * 24 * 3 * 1000;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(sessionCookie => {
      console.log("sessionCookie", sessionCookie);
      const cookieName = req.app.locals.cookieName;
      console.log(cookieName);
      // 設定cookie
      const options = {
        maxAge: expiresIn,
        httpOnly: true //無法被js串改?
      };
      // 把cookie設定給瀏覽器
      res.cookie(cookieName, sessionCookie, options);
      // 回傳成功
      res.status(200).json({ msg: "login" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// 登出
router.post("/logout", function(req, res, next) {
  console.log("[後端登出]");
  const cookie = req.app.locals.cookieName || "";
  // 刪除一個叫做 req.app.locals.cookieName 的cookie
  res.clearCookie(req.app.locals.cookieName);
  admin
    .auth()
    .verifySessionCookie(cookie)
    .then(user => {
      // 註銷sessionCookie
      const result = admin.auth().revokeRefreshTokens(user.sub);
      console.log(result);
      res.status(200).json({ msg: "success" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
  res.status(200).json({ msg: "success" });
});

// 新增商品
router.post("/user/create", function(req, res, next) {});

// 更新商品
router.put("/user/:pid", function(req, res, next) {
  const user = req.body,
    pid = req.params.pid;

  console.log("pid", pid);
  // console.log("use(req.body)", user);
  // 判別來新增修改 user_Allpublish_true
  if (user.Volunteer == 3 || user.Volunteer == 4) {
    // 是志工 update這ID 原本就有沒差 沒有的話會新增
    //   update;
    db.ref(`manage_AllPublish_true/${pid}`)
      .update({ id: pid })
      .then(response => {
        res.status(200).json({ msg: "Publish_id updated" });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    // 非志工 刪除這ID
    //   update;
    db.ref(`manage_AllPublish_true/${pid}`)
      .update({ id: null })
      .then(response => {
        res.status(200).json({ msg: "Publish_id deleted" });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }

  //   update;
  db.ref(`users/${pid}/Volunteer`)
    .update({ v: user.Volunteer })
    .then(response => {
      res.status(200).json({ msg: "Vol updated" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
  //   console.log("USERRRRRRRRRRRR");

  user.service_times = parseInt(user.service_times);
  // console.log(user.service_times, "&&&&", user);
  //   console.log("any QQQQQQQQQQQQ?", user.service_times);

  db.ref(`users/${pid}/user_data`) //這邊先用不到了(因為服務次數不用改)
    .update({ service_times: user.service_times })
    .then(response => {
      res.status(200).json({ msg: "updated" });
    })
    .catch(err => {
      res.status(500).json(err);
    });

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    // var dbo = db.db("me"); //舊的DB Name
    var dbo = db.db("mydb");

    const myquery = { uid: pid };
    const newvalues = { $set: { lost_credit: parseInt(user.lost_credit) } };
    // mogo更新資料的方法            符合的條件 要改的資料
    dbo.collection("user").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
});

// 更新商品2
router.put("/user/editName/:pid", function(req, res, next) {
  const user = req.body,
    pid = req.params.pid;
  //   update;
  db.ref(`users/${pid}/user_data`)
    .update({ name: user.rewrite_name })
    .then(response => {
      res.status(200).json({
        oringin_name: user.oringin_name,
        rewrite_name: user.rewrite_name
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// 刪除商品
router.delete("/user/:pid", function(req, res, next) {});

// 塞選地點
router.post("/selectedCity", function(req, res, next) {
  // const selectedCity_pass = req.body;
  const users_selected = []; // 空陣列
  console.log(req);
  const docs = db
    .ref("/users")
    .once("value")
    .then(response => {
      // docs.forEach(doc => {
      //   const user = doc.val();
      //   users_selected.push(user);
      // });

      res.locals.DDDD = req.body;

      res.status(200).json({ msg: "updated" });

      // res.locals.users_selected = users_selected;
      // res.locals.selectedCity_pass = selectedCity_pass;
      // res.render("volunteer");
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// 新增transfer=give獎勵
router.post("/user/give", function(req, res, next) {
  const user = req.body,
    pid = user.receiver,
    no = user.rank.substring(0, 1);

  // 新增一筆資料　insertOne
  let points = 0;
  console.log("req是什麼", user);

  if (no == 1) {
    //第一名的話
    points = 6; //給6元
  } else if (no == 2) {
    points = 4;
  } else if (no == 3) {
    points = 2;
  }
  let your_var_obj = {
    type: 2,
    giver: "Goverment",
    receiver: pid,
    points: points,
    name: "Goverment",
    time_num: new Date().getTime()
  };

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    console.log("entry gift");
    if (err) throw err;
    var dbo = db.db("mydb"); //DB Name
    res.status(200).json({ msg: "Publish_id updated" });

    dbo.collection("transfer").insertOne(your_var_obj, function(err, res) {
      if (err) throw err;

      console.log("1 document inserted");
      console.log("RESSSSSSSSS", res);
    });
    //  res.status(200).json({ msg: "Publish_id updated" });

    db.close();
  });
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb"); //DB Name
    dbo.collection("user").updateOne(
      { uid: your_var_obj.receiver },
      {
        $inc: { points: parseInt(your_var_obj.points) }
      }
    );
  });
});

module.exports = router;
