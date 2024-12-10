
// .jsで赤線が出ている部分を修正する
// nocheckを追記する


// server.js

const createServer = require('http').createServer;
const next = require('next');

const app = next({ dev: false });
const handleNextRequests = app.getRequestHandler();

app.prepare().then(() => {
  const port = process.env.PORT || 8080;
  
  createServer((req, res) => {
    handleNextRequests(req, res);
  }).listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});