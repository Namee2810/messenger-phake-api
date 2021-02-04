const express = require('express');
const router = express.Router();
const sha256 = require("sha256");
const sql = require("../../modules/sql");
const uniqid = require('uniqid');
const nodemailer = require('nodemailer');
const generatorKey = require('../../modules/generatorKey');

router.post('/', (req, res) => {
  const uid = uniqid(),
    fullname = req.body.fullname,
    email = req.body.email,
    password = sha256(req.body.password),
    key = generatorKey(32);
  let response = {};

  let query = `INSERT INTO users (uid, fullname, email, password, verify, registrationDate) VALUES ('${uid}', '${fullname}', '${email}', '${password}', '${key}', NOW())`;
  sql.query(query, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        response = {
          code: 400,
          message: "Email has been registered"
        }
      }
      else {
        response = {
          code: 401,
          message: err
        }
      }
      res.json(response);
    }
    else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      var html = `<div>
        <h1 style="color: #1ED760; font-weight: bold;">Messenger Phakè</h1>
        <p>Xin chào ${fullname},</p>
        <p>Vui lòng xác minh địa chỉ email của bạn bằng cách nhấn link dưới đây!</p>
        <a href="${process.env.API_URL}/verify?key=${key}">
          <button style="background: #1ED760; color: white; border: none; height: 40px; width: 150px; cursor: pointer;">
            Xác minh
          </button>
        </a>
      </div>`

      var mailOptions = {
        from: 'revoltzme@gmail.com',
        to: email,
        subject: 'Messgenger Phakè',
        html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          response = {
            code: 402,
            message: err
          }
        } else {
          response = {
            code: 200,
            message: "Signup succesfully",
          }
          res.json(response);
        }
      });
    }
  })
});

module.exports = router;