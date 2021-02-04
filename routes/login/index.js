const express = require('express');
const router = express.Router();
const sha256 = require("sha256");
const { generateAccessToken } = require('../../modules/jwt');
const sql = require("../../modules/sql");

router.post('/', (req, res) => {
  const email = req.body.email,
    password = sha256(req.body.password)
  let response = {};
  let query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

  sql.query(query, (err, result) => {
    if (err) {
      response = {
        code: 400,
        message: err
      }
      res.json(response);
    }
    else {
      if (result.length !== 0) {
        if (result[0].verify !== "1") {
          response = {
            code: 202,
            message: "Email unconfimred",
          }
        }
        else {
          let user = result[0];
          let token = generateAccessToken({ uid: user.uid, fullname: user.fullname, email: user.email })
          response = {
            code: 200,
            message: "Login successfully",
            token,
            uid: `${user.uid}-${user.fullname}`
          }
        }

        res.json(response);
      }
      else {
        response = {
          code: 201,
          message: "Wrong email or password",
        }
        res.json(response);
      }


    }
  })
});

module.exports = router;