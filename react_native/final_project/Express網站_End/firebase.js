// TODO: 初始化firebase
var admin = require("firebase-admin");

var serviceAccount = require("./config/key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://express-test01.firebaseio.com"
  databaseURL: "https://projectname2.firebaseio.com"
});

// 輸出admin讓其他js檔案可以使用
module.exports = admin;
