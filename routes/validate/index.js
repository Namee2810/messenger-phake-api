const express = require('express');
const router = express.Router();
const sql = require("../../modules/sql");

router.post("/", (req, res) => {
  const user = req.body.decoded;

  let response = {};
  let query = `SELECT * FROM users WHERE uid='${user.uid}' AND email='${user.email}'`
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
        response = {
          code: 200,
          message: "Valid user"
        }
        res.json(response);
      }
      else {
        response = {
          code: 400,
          message: "Invalid user"
        }
        res.json(response);
      }
    }
  })
})

module.exports = router;