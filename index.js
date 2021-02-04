require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app);

const port = process.env.PORT || 80;
const bodyParser = require("body-parser");
const sql = require("./modules/sql");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
  next();
}
app.use(allowCrossDomain);

sql.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + sql.threadId);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi");
})

const login = require('./routes/login');
app.use('/login', login);
const signup = require('./routes/signup');
app.use('/signup', signup);
const verify = require('./routes/verify');
app.use('/verify', verify);
const validate = require('./routes/validate');
app.use('/validate', validate);


server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

var online = 0;

io.on("connection", socket => {
  console.log("New connection", socket.handshake.address);
  online++;

  socket.on('disconnect', () => {
    console.log('Disconnect');
    online--;
    io.sockets.emit('online', online);
    io.sockets.emit('off', { fullname: "Ai đó" });
  });

  socket.on("sendMessage", data => {
    let query = `INSERT INTO messages (message, uid, fullname, createTime) VALUES ('${data.message}', '${data.uid}', '${data.fullname}', '${data.createTime}')`
    sql.query(query)
    io.sockets.emit('sendMessage', data);
  })
  socket.on('off', user => {
    io.sockets.emit('off', user);
  });
  socket.on('on', user => {
    io.sockets.emit('on', user);
    io.sockets.emit('online', online);
  });

})