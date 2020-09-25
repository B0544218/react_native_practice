// TODO: 初始化db
// 引用firebase.js輸出的admin物件
const admin = require("./firebase");
// 初始化firestore
const db = admin.database();
// const DB = admin.firebase();
// 輸出db讓其他的js可以使用db
module.exports = db;
