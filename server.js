const fs = require('fs');
const http = require('http');
const express = require('express');
const multer = require('multer');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
server.listen(3001);

const listener = require('socket.io')(server);
listener.on('connection', (socket) => {
  let killServer = false;
  if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
  socket.on('disconnect', () => {
    killServer = true;
    const validateKillingServer = () =>  killServer ? server.close() : null;
    setTimeout(() => validateKillingServer(), 60000);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.params.directory;
    if (!fs.existsSync(`./uploads/${dir}`)) fs.mkdirSync(`./uploads/${dir}`);
    cb(null, `./uploads/${dir}`);
  },
  filename: (req, file, cb) => {
    let shortenedOrOriginalFilename;
    const start = Number(req.params.startPositionToRemove);
    const end = Number(req.params.endPositionToRemove);
    if (start === -1 && end === -1) {
      shortenedOrOriginalFilename = file.originalname
    } else {
      shortenedOrOriginalFilename = file.originalname.slice(0, start) + file.originalname.slice(end + 1);
    }
    const newName = req.params.new_name;
    cb(null, `${newName}_${shortenedOrOriginalFilename}`);
  }
});

const upload = multer({ storage });

app.post('/rename/:new_name/:directory/:startPositionToRemove/:endPositionToRemove', upload.any('files'), (req, res) => {
  try {
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(400);
  }
});