const fs = require('fs');
const http = require('http');
const express = require('express');
const multer = require('multer');

const app = express();
const port = 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`server running on port ${port} . . .`));

const listener = require('socket.io')(server);
listener.on('connection', (socket) => {
  let killServer;
  killServer = false;
  console.log('connection established . . .');

  if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

  socket.on('disconnect', () => {
    killServer = true;
    console.log('connection lost . . .');
    // const validateKillingServer = () =>  killServer ? server.close() : console.log('reconnected');
    // setTimeout(() => validateKillingServer(), 15000);
  });
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(`./uploads/${req.params.directory}`)) {
      fs.mkdirSync(`./uploads/${req.params.directory}`);
    }
    cb(null, `./uploads/${req.params.directory}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.new_name}_${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/rename_one/:new_name/:directory', upload.any('files'), (req, res) => {
  try {
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(400);
  }
});
