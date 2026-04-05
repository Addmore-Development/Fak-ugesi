const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

['index','about','awards','immersiveAfrica','programme','tickets','404'].forEach(name => {
  const file = path.join(PUBLIC_DIR, name + '.html');
  app.get('/' + (name === 'index' ? '' : name), (req, res) => {
    fs.existsSync(file) ? res.sendFile(file) : res.status(404).sendFile(path.join(PUBLIC_DIR,'404.html'));
  });
  app.get('/' + name + '.html', (req, res) => {
    fs.existsSync(file) ? res.sendFile(file) : res.status(404).sendFile(path.join(PUBLIC_DIR,'404.html'));
  });
});

app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html')));

app.listen(PORT, () => {
  console.log('\n Fak\'ugesi running at http://localhost:' + PORT);
  console.log(' Serving from: ' + PUBLIC_DIR + '\n');
});