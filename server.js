const fs = require('fs');
const http = require('http');
const express = require('express');
const multer = require('multer');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
server.listen(3001, () => console.log(`server running on port 3001. . .`));

const listener = require('socket.io')(server);
listener.on('connection', (socket) => {
  let killServer = false;
  if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
  socket.on('disconnect', () => {
    killServer = true;
    console.log('connection lost . . .');
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.params.directory;
    if (!fs.existsSync(`./uploads/${dir}`)) fs.mkdirSync(`./uploads/${dir}`);
    cb(null, `./uploads/${dir}`);
  },
  filename: (req, file, cb) => {
    // ! need to add logic to remove chars from filename here thru req params
    cb(null, `${req.params.new_name}_${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/rename/:new_name/:directory', upload.any('files'), (req, res) => {
  try {
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(400);
  }
});
