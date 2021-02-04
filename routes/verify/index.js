const express = require('express');
const router = express.Router();
const sql = require("../../modules/sql");

router.get("/", (req, res) => {
  const key = req.query.key;
  let query = `UPDATE users SET verify='1' WHERE verify='${key}'`;
  sql.query(query, (err, result) => {
    if (result && result.changedRows === 1) {
      let content = `<body
      style="padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: black;">
      <div
        style="height: 100%; width: 100%; background: linear-gradient(135deg, rgba(33, 243, 163, 1) 0%, rgba(33, 214, 243, 1) 100%); display: flex; justify-content: center; align-items: center;flex-direction: column;">
        <div style="background: white; border-radius: 10px; text-align: center; padding: 50px;">
          <h1>Messenger Phakè</h1>
          <b>Email đã được xác minh, tài khoản của bạn đã hoàn tất đăng kí 🎉🎉🎉</b>
          <br />
          <br />
          <p>Đang chuyển hướng về trang chủ ...</p>
        </div>
      </div>
      <script>setTimeout(() => {
        window.location='${process.env.HOME_URL}'
      }, 3000);</script>
    </body>`;
      res.send(content);
    }
    else {
      let content = `<body
      style="padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: black;">
      <div
        style="height: 100%; width: 100%; background: linear-gradient(135deg, rgba(33, 243, 163, 1) 0%, rgba(33, 214, 243, 1) 100%); display: flex; justify-content: center; align-items: center;flex-direction: column;">
        <div style="background: white; border-radius: 10px; text-align: center; padding: 40px 100px;">
          <h1>Messenger Phakè</h1>
          <b>Không thể xác minh email 😥</b>
          <br />
          <br />
          <p>Đang chuyển hướng về trang chủ ...</p>
        </div>
      </div>
      <script>setTimeout(() => {
        window.location='${process.env.HOME_URL}'
      }, 3000);</script>
    </body>`;
      res.send(content);
    }
  });
})

module.exports = router;