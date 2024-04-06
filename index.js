const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 8081;

// Middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
  fs.appendFile('server.log', `${new Date().toISOString()} - ${req.method} ${req.url}\n`, (err) => {
    if (err) console.error('Error writing to log:', err);
  });
  next();
});


app.post('/createFile', (req, res) => {
  const { filename, content, password } = req.body;
  if (!filename || !content) {
    return res.status(400).send('Filename and content are required.');
  }
  // Password protection
  // You can implement password logic here

  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error('Error creating file:', err);
      return res.status(500).send('Error creating file.');
    }
    res.status(200).send('File created successfully.');
  });
});

app.get('/getFiles', (req, res) => {
  fs.readdir('.', (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Error reading directory.');
    }
    res.status(200).json(files);
  });
});

app.get('/getFile', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(400).send('File not found.');
    }
    res.status(200).send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});