// 登入表單送出時
$("#loginForm").submit(function(event) {
  event.preventDefault();
  const email = $("#loginEmail").val(),
    password = $("#loginPassword").val();
  console.log("[開始登入]", { email: email, password: password });
  // 透過firebase auth進行前端登入
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function(res) {
      console.log(res);
      Swal.fire({
        title: "登入成功!",
        type: "success"
      });
      // 取得idToken(登入流程的前端簽證)
      res.user.getIdToken().then(function(idToken) {
        console.log("idToken: ", idToken);
        // 把idToken寄到 /api/login   (傳給後端)
        axios
          .post("/api/login", { idToken: idToken })
          .then(function(res) {
            // 重整畫面
            window.location.reload();
          })
          .catch(function(err) {
            // 重整畫面
            window.location.reload();
          });
      });
    })
    .catch(function(err) {
      console.log(err);
      Swal.fire({
        title: `${err.code}: ${err.message}`,
        type: "error"
      });
    });
});

//
$("#signUpForm").submit(function(event) {
  event.preventDefault();
  const email = $("#signUpEmail").val(),
    password = $("#signUpPassword").val();
  console.log("[開始註冊]", { email: email, password: password });
});

// 登出按鈕點擊時
$("#logoutBtn").click(function() {
  console.log("[開始登出]");
  axios
    .post("/api/logout", {})
    .then(function(res) {
      Swal.fire({
        title: "登出成功!",
        type: "success"
      });
      window.location = "/";
    })

    .catch(function(err) {
      alert(err);
    });
});
