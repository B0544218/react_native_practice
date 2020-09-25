const admin = require("../firebase");

// TODO: 設置登入驗證關口

function loginChecker(router) {
  router.use(function(req, res, next) {
    console.log("[進入登入檢查站]");
    // 預設登入狀態
    const auth = {
      islogin: false,
      isAdmin: false,
      user: {}
    };
    // 取得cookie名稱
    const cookieName = req.app.locals.cookieName;
    // 取得使用者的sessionCookie
    const sessionCookie = req.cookies[cookieName] || "";
    console.log(sessionCookie);
    // 驗證                                         是否被登出過
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(user => {
        console.log("user", user);
        auth.islogin = true;
        auth.user = user;
        // 把auth pass到下一個middleware或ejs
        res.locals.auth = auth;
        next();
      })
      .catch(err => {
        console.log("err", err);
        res.locals.auth = auth;
        next();
      });
  });
}

module.exports = loginChecker;
